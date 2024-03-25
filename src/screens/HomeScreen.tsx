import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Image } from 'react-native';
import base58 from 'bs58';
import nacl from 'tweetnacl';
import 'react-native-get-random-values';

// Örnek olarak assets klasöründen phantom.png'yi import ediyoruz
const phantomIcon = require('../assets/Phantom.png');

const HomeScreen: React.FC = () => {
  const [dappKeyPair, setDappKeyPair] = useState<nacl.BoxKeyPair | null>(null);

  useEffect(() => {
    const generateRandomKeyPair = () => {
      try {
        const newKeyPair = nacl.box.keyPair();
        setDappKeyPair(newKeyPair);
      } catch (error) {
        console.error('Error generating random key pair:', error);
      }
    };
  
    generateRandomKeyPair();
  }, []);

  const handleConnectPhantom = async () => {
    if (dappKeyPair) {
      const params = new URLSearchParams({
        dapp_encryption_public_key: base58.encode(dappKeyPair.publicKey),
        cluster: 'mainnet-beta',
        app_url: 'https://phantom.app',
        redirect_link: 'myapp://onConnect',
      });

      const connectUrl = `phantom://v1/connect?${params.toString()}`;

      try {
        await Linking.openURL(connectUrl);
      } catch (error) {
        console.error('Error connecting to Phantom:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleConnectPhantom}>
          {/* Phantom ikonunu metnin başına ekleyin */}
          <Image source={phantomIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Connect Your Phantom Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    flexDirection: 'row', // İkon ve metni yan yana getirmek için
    alignItems: 'center', // İkon ve metni dikey olarak ortalar
    backgroundColor: '#7C3AED',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18, // Metin boyutunu artırın
    fontWeight: 'bold',
    marginLeft: 10, // İkon ve metin arasında boşluk bırakın
  },
  icon: {
    width: 24, // İkon boyutunu ayarlayın
    height: 24, // İkon boyutunu ayarlayın
  },
});

export default HomeScreen;
