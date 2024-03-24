import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TextInput, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import Contacts, { Contact } from 'react-native-contacts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ContactsDetailScreen: { contact: Contact };
};

type ContactsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactsDetailScreen'>;

const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
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
      const sortedContacts = contactsData.sort((a, b) => {
        const nameA = (a.givenName + ' ' + a.familyName).toLowerCase();
        const nameB = (b.givenName + ' ' + b.familyName).toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setContacts(sortedContacts);
      setFilteredContacts(sortedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // İlk olarak sorgu ile başlayan kişileri filtrele
    const startsWithFilter = contacts.filter(contact =>
      contact.givenName.toLowerCase().startsWith(query.toLowerCase()) ||
      contact.familyName.toLowerCase().startsWith(query.toLowerCase())
    );
  
    // Ardından sorguyu içeren ama ile başlamayan kişileri filtrele
    const includesFilter = contacts.filter(contact =>
      (contact.givenName.toLowerCase().includes(query.toLowerCase()) ||
      contact.familyName.toLowerCase().includes(query.toLowerCase())) &&
      !startsWithFilter.includes(contact) // Daha önce başlayanlar listesine alınmamış kişiler
    );
  
    // İki listeyi birleştir
    const filteredContacts = [...startsWithFilter, ...includesFilter];
    setFilteredContacts(filteredContacts);
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ContactsDetailScreen', { contact: item })}>
      <View style={styles.card}>
        <Image
          source={item.thumbnailPath ? { uri: item.thumbnailPath } : require('../assets/Phantom.png')}
          style={styles.contactImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{`${item.givenName} ${item.familyName}`}</Text>
          {item.jobTitle && <Text style={styles.jobTitle}>{item.jobTitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Image style={styles.menuIcon} source={require('../assets/menu.png')}/>
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
    fontSize:18
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomWidth:0.25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // elevation: 1,
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
});

export default ContactsScreen;
