import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
interface SendSolScreenProps {
  route: {
    params: {
      solanaAddress: string;
    };
  };
  navigation: any;
}

const SendSolScreen: React.FC<SendSolScreenProps> = ({ route, navigation }) => {
  const { solanaAddress } = route.params;
  const [amount, setAmount] = useState<string>('');

  const sendSol = async () => {
    try {
      // Gerçek cüzdanınızın özel anahtarını buraya girin
      const senderSecretKey = Uint8Array.from([26, 6, 112, 138, 66, 108, 175, 95, 47, 83, 175, 223, 234, 160, 5, 161, 122, 86, 0, 24, 112, 109, 156, 160, 6, 243, 111, 118, 231, 112, 205, 216, 93, 105, 27, 59, 25, 59, 189, 122, 249, 129, 71, 218, 151, 150, 181, 123, 166, 25, 236, 30, 42, 246, 213, 163, 46, 135, 232, 211, 11, 112, 149, 29]);
      const senderKeypair = Keypair.fromSecretKey(senderSecretKey);

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const recipientPublicKey = new PublicKey(solanaAddress);

      // Son blok hash'ini alın ve işlemi imzalayın
      // let { blockhash } = await connection.getRecentBlockhash('finalized');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientPublicKey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );
      console.log('Transaction object:', transaction);

      const { blockhash } = await connection.getRecentBlockhash('finalized');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderKeypair.publicKey;
  
      // İşlemi imzalayın
      transaction.sign(senderKeypair);
  
      // İşlemin doğru imzalandığını doğrulayın
      if (!transaction.verifySignatures()) {
        throw new Error('Transaction signature verification failed');
      }
  
      // İşlemi serileştirin
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false, // Tüm imzaların serileştirmede mevcut olması gerekmiyor
        verifySignatures: true // Serileştirme öncesinde imzaların doğruluğunu kontrol edin
      });
  
      // İşlemi Uint8Array olarak gönderin
      const signature = await connection.sendRawTransaction(serializedTransaction);
  
      // İşlem onayını bekleyin
      await connection.confirmTransaction(signature, 'finalized');
  
      Alert.alert("Success", `Transaction successful with signature: ${signature}`);
    } catch (error) {
      console.error('Transaction error:', error);
      Alert.alert("Error", `Transaction failed: ${error.message}`);
    }
  };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Send SOL</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Recipient Address:</Text>
          <Text style={styles.value}>{solanaAddress}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount (SOL):</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={sendSol}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      color: '#333',
      marginBottom: 5,
    },
    value: {
      fontSize: 18,
      color: '#333',
      padding: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
      marginBottom: 10,
    },
    input: {
      fontSize: 18,
      color: '#333',
      padding: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
    },
    button: {
      backgroundColor: '#0077cc',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  export default SendSolScreen;
