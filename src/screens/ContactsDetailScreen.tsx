import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from 'react-native-contacts';

interface ContactDetailProps {
  route: {
    params: {
      contact: Contact;
    };
  };
}

const ContactsDetailScreen: React.FC<ContactDetailProps> = ({ route, navigation }) => {
  const { contact } = route.params;
  const [solanaAddress, setSolanaAddress] = useState<string>('');
  const [isAddressSaved, setIsAddressSaved] = useState<boolean>(false);

  const favoriteIcon = require('../assets/favorite.png');
  const phoneIcon = require('../assets/phone.png');
  const emailIcon = require('../assets/email.png');
  const messageIcon = require('../assets/message.png');
  const pointsIcon = require('../assets/points.png');
  const solanaIcon = require('../assets/solana.webp');

  useEffect(() => {
    // Kaydedilmiş Solana adresini al
    const getSavedAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem(`solanaAddress_${contact}`);
        if (savedAddress !== null) {
          setSolanaAddress(savedAddress);
          setIsAddressSaved(true);
        }
      } catch (error) {
        console.error('Error retrieving saved Solana address:', error);
      }
    };

    getSavedAddress();
  }, []);

  const handleSaveAddress = async () => {
    try {
      await AsyncStorage.setItem(`solanaAddress_${contact}`, solanaAddress);
      console.log('Saved Solana address:', solanaAddress);
      setIsAddressSaved(true);
    } catch (error) {
      console.error('Error saving Solana address:', error);
    }
  };

  const handleSolanaAddressPress = () => {
    // sendSolScreen ekranına yönlendirme işlemi
    navigation.navigate('sendSolScreen', { solanaAddress });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={contact.thumbnailPath ? { uri: contact.thumbnailPath } : require('../assets/Phantom.png')}
          style={styles.contactImage}
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Image source={favoriteIcon} style={styles.favoriteIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.pointsButton}>
          <Image source={pointsIcon} style={styles.pointsIcon} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.name}>{`${contact.givenName} ${contact.familyName}`}</Text>
      
      <View style={styles.infoContainer}>
        <TouchableOpacity>
          <Image source={phoneIcon} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.infoText}>{contact.phoneNumbers[0]?.number}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Image source={emailIcon} style={styles.emailIcon} />
        <Text style={styles.infoText}>{contact.emailAddresses[0]?.email}</Text>
      </View>

      <View style={styles.solanaContainer}>
        <Image source={solanaIcon} style={styles.solanaIcon} />
        <TextInput
          style={styles.solanaInput}
          placeholder='Enter your Solana address'
          placeholderTextColor='#7f8c8d'
          onChangeText={setSolanaAddress}
          value={solanaAddress}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {isAddressSaved && solanaAddress ? (
        <TouchableOpacity onPress={handleSolanaAddressPress}>
          <View style={styles.solanaAddressContainer}>
            <Text style={styles.solanaAddressText}>{`Solana Address: ${solanaAddress}`}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  contactImage: {
    width: '100%',
    aspectRatio: 16 / 12,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: -30,
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 60,
    borderRadius: 15,
    padding: 5,
  },
  pointsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 15,
    padding: 5,
  },
  favoriteIcon: {
    width: 30,
    height: 30,
  },
  pointsIcon: {
    width: 30,
    height: 30,
  },
  emailIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginLeft: 10,
  },
  solanaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  solanaIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  solanaInput: {
    flex: 1,
    height: 40,
    borderColor: '#3d58d1',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  saveButton: {
    backgroundColor: '#3d58d1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    shadowColor:'#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  solanaAddressContainer: {
    backgroundColor: '#E2F1FC',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  solanaAddressText: {
    color: '#0055FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactsDetailScreen;
