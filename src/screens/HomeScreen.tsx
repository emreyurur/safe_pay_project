import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Linking, StyleSheet, Text, Image } from 'react-native';
import base58 from 'bs58';
import nacl from 'tweetnacl'; // tweetnacl paketini içe aktarın
import { ImageRequireSource } from 'react-native';


interface ImagePressProps {
  onPress: () => void;
  image: ImageRequireSource;
}

const HomeScreen: React.FC = () => {
  const [dappKeyPair, setDappKeyPair] = useState<nacl.BoxKeyPair | null>(null);

  useEffect(() => {
    const generateRandomKeyPair = () => {
      try {
        // tweetnacl kullanarak rastgele bir anahtar çifti oluşturun.
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
        cluster: 'mainnet-beta', // Testnete bağlanmak için cluster parametresini testnet olarak ayarlayın
        app_url: 'https://phantom.app',
        redirect_link: 'nftTracker://onConnect',
      });

      // Phantom cüzdanını bağlamak için uygun URL'yi açın
      const connectUrl = `${'phantom://'}v1/connect?${params.toString()}`;

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
        {dappKeyPair && (
          <TouchableOpacity onPress={handleConnectPhantom} style={styles.button}>
            <Image source={require('../assets/Phantom.png')} style={styles.image} resizeMode="contain" />
            <Text style={styles.buttonText}>Connect your Phantom Wallet</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0D233B',
    borderRadius: 8,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
