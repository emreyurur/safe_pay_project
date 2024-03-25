import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList'; // Assuming you have a RootStackParamList type

type ContactDetailScreenRouteProp = RouteProp<RootStackParamList, 'ContactsDetail'>;

type ContactDetailProps = {
  route: ContactDetailScreenRouteProp;
  navigation: NavigationProp<RootStackParamList>;
};

const ContactsDetailScreen: React.FC<ContactDetailProps> = ({ route, navigation }) => {
  const { contact } = route.params;
  const [solanaAddress, setSolanaAddress] = useState<string>('');
  const [isAddressSaved, setIsAddressSaved] = useState<boolean>(false);

  useEffect(() => {
    // Kaydedilmiş Solana adresini al
    const getSavedAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem(`solanaAddress_${contact.recordID}`);
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
    // AsyncStorage'e adresi kaydet
    try {
      await AsyncStorage.setItem(`solanaAddress_${contact.recordID}`, solanaAddress);
      console.log('Saved Solana address:', solanaAddress);
    } catch (error) {
      console.error('Error saving Solana address:', error);
    }
  };

  const handleSolanaAddressPress = () => {
    // Eğer adres kaydedilmişse, gönderme ekranına yönlendir
    if (isAddressSaved) {
      navigation.navigate('sendSolScreen', { solanaAddress });
    }
  };

  const displayPartialAddress = (address: string) => {
    const maxLength = 15; // Maksimum karakter sayısı
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={contact.thumbnailPath ? { uri: contact.thumbnailPath } : require('../assets/Phantom.png')}
          style={styles.contactImage}
        />
        
        <TouchableOpacity style={styles.favoriteButton}>
          <Image source={require('../assets/favorite.png')} style={styles.favoriteIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.pointsButton}>
          <Image source={require('../assets/points.png')} style={styles.pointsIcon} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.name}>{`${contact.givenName} ${contact.familyName}`}</Text>
      
      <View style={styles.infoContainer}>
        <TouchableOpacity>
          <Image source={require('../assets/phone.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.infoText}>{contact.phoneNumbers[0]?.number}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Image source={require('../assets/email.png')} style={styles.emailIcon} />
        <Text style={styles.infoText}>{contact.emailAddresses[0]?.email}</Text>
      </View>
      
      <View style={styles.solanaContainer}>
        <Image source={require('../assets/solana.webp')} style={styles.solanaIcon} />
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
      
      {/* Kaydedilmiş Solana adresinin kısmen gösterildiği bölüm */}
      {isAddressSaved && solanaAddress ? (
        <View style={styles.solanaSavedContainer}>
          <TouchableOpacity onPress={handleSolanaAddressPress} style={styles.solanaAddressButton}>
            <Text style={styles.solanaAddressButtonText}>
              {`Solana Address: ${displayPartialAddress(solanaAddress)}`}
            </Text>
          </TouchableOpacity>
        </View>
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
  solanaSavedContainer: {
    backgroundColor: '#3d58d1',
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  solanaAddressButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  solanaAddressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ContactsDetailScreen;

