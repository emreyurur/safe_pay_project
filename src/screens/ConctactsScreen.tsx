import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TextInput, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import Contacts, { Contact } from 'react-native-contacts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  ContactsDetailScreen: { contact: Contact };
  SendSolScreen: { solanaAddress: string };
};

interface ExtendedContact extends Contact {
  solanaAddress?: string;
}

type ContactsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactsDetailScreen'>;

const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<ExtendedContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ExtendedContact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<ContactsScreenNavigationProp>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Access',
          message: 'This app needs access to your contacts to display them.',
        }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          loadContacts();
        }
      }).catch(error => console.error('Error requesting contacts permission:', error));
    } else {
      loadContacts();
    }
  }, []);

  const loadContacts = async () => {
    try {
      const contactsData = await Contacts.getAll();
      const contactsWithAddress = await Promise.all(contactsData.map(async (contact) => {
        const solanaAddress = await AsyncStorage.getItem(`solanaAddress_${contact.recordID}`);
        return { ...contact, solanaAddress }; // Include Solana address in the contact object
      }));

      setContacts(contactsWithAddress);
      setFilteredContacts(contactsWithAddress); // Set filtered contacts initially
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = contacts.filter(contact =>
      contact.givenName.toLowerCase().includes(query.toLowerCase()) ||
      contact.familyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const handleSolanaAddressPress = (solanaAddress: string) => {
    navigation.navigate('SendSolScreen', { solanaAddress });
  };

  const renderItem = ({ item }: { item: ExtendedContact }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ContactsDetailScreen', { contact: item })}>
      <View style={styles.card}>
        <Image
          source={item.thumbnailPath ? { uri: item.thumbnailPath } : require('../assets/Phantom.png')}
          style={styles.contactImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{`${item.givenName} ${item.familyName}`}</Text>
          {item.jobTitle && <Text style={styles.jobTitle}>{item.jobTitle}</Text>}
          {item.solanaAddress && (
            <TouchableOpacity style={styles.solanaAddressContainer} onPress={() => handleSolanaAddressPress(item.solanaAddress)}>
              <Image source={require('../assets/solana.webp')} style={styles.solanaIcon} />
              <Text style={styles.solanaAddressText}>{`Solana Address: ${item.solanaAddress.substring(0, 15)}...`}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Image style={styles.menuIcon} source={require('../assets/menu.png')} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for people"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.recordID || ''}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF6F6',
    borderRadius: 20,
    height: 50,
    padding: 10,
    fontSize: 18,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomWidth: 0.25,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },
  cardContent: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jobTitle: {
    color: 'grey',
  },
  solanaAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  solanaIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  solanaAddressText: {
    color: 'blue',
  },
});

export default ContactsScreen;

