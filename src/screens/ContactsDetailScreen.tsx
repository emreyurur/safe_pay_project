import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
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

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Contact not found!</Text>
      </View>
    );
  }

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

      {/* E-posta adresi için benzer bir yapı kurulabilir */}
      <View style={styles.infoContainer}>
        <Image source={emailIcon} style={styles.emailIcon} />
        <Text style={styles.infoText}>{contact.emailAddresses[0]?.email}</Text>
        {/* <View style={styles.solanaInput}>
            <TextInput
            placeholder='Enter your Solana address'
            />
        </View> */}
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
    backgroundColor: '#e0e0e0', // Fotoğrafın yerini alacak varsayılan arkaplan rengi.
    position: 'relative', // İçerideki mutlak pozisyonlu öğeleri konumlandırmak için.
  },
  contactImage: {
    width: '100%', // Genişliği ekranın genişliği kadar yap.
    aspectRatio: 16 / 12, // Yükseklik/genişlik oranı.
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: -30, // İsim metnini fotoğrafın üzerine çekmek için.
    backgroundColor: '#fff', // İsim metni arkaplanı.
    width: '100%', // Genişliği ekranın genişliği kadar yap.
    padding: 10, // İsim metni için padding.
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
    top: 20, // Yukarıdan boşluk.
    right: 60, // Sağdan boşluk.
    borderRadius: 15, // Düğme yuvarlaklaştırması.
    padding: 5, // İkon çevresinde padding.
  },
  pointsButton: {
    position: 'absolute',
    top: 20, // Yukarıdan boşluk.
    right: 20, // Sağdan boşluk.
    borderRadius: 15, // Düğme yuvarlaklaştırması.
    padding: 5, // İkon çevresinde padding.
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
    marginLeft:10
  },
});

export default ContactsDetailScreen;
