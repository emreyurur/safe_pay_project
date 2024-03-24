import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { Contact } from 'react-native-contacts';

interface ContactDetailProps {
  route: {
    params: {
      contact: Contact;
    };
  };
}

const ContactsDetailScreen: React.FC<ContactDetailProps> = ({ route }) => {
  const { contact } = route.params;

  const favoriteIcon = require('../assets/favorite.png');
  const phoneIcon = require('../assets/phone.png');
  const emailIcon = require('../assets/email.png');
  const messageIcon = require('../assets/message.png');
  const pointsIcon = require('../assets/points.png');
  const solanaIcon = require('../assets/solana.webp');

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Contact not found!</Text>
      </View>
    );
  }

  const handleSaveAddress = (address: string) => {
    // Burada Solana adresini kaydetme işlemleri yapılabilir
    console.log('Saved Solana address:', address);
    // Örnek olarak konsola kaydedildiğini gösterelim
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
    placeholderTextColor='#7f8c8d' // Gri ton bir placeholder rengi
    // onChangeText={setSolanaAddress} // Girilen değeri state'e kaydet
    // value={solanaAddress} // TextInput'un değeri
  />
  <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
    <Text style={styles.saveButtonText}>Save</Text>
  </TouchableOpacity>
</View>
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
    fontSize: 22,
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
    backgroundColor: '#fff', // Beyaz arkaplan
    borderRadius: 5, // Köşeleri yuvarlat
    margin: 10,
    marginTop:10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5, // Android için gölge efekti
  },
  solanaIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  solanaInput: {
    flex: 1,
    height: 40, // Yeterli alan sağlamak için
    borderColor: '#3d58d1', // Solana mavisi tonu
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#2c3e50', // Karanlık gri metin rengi
  },
  saveButton: {
    backgroundColor: '#3d58d1', // Solana mavisi tonu
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5, // Android için gölge efekti
  },
  saveButtonText: {
    color: '#fff', // Beyaz metin
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactsDetailScreen;
