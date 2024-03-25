import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface SendSolScreenProps {
  route: {
    params: {
      solanaAddress: string;
    };
  };
  navigation: any;
}

const SendSolScreen: React.FC<SendSolScreenProps> = ({ route }) => {
  const { solanaAddress } = route.params;
  const [amount, setAmount] = useState<string>('');

  const sendSol = async () => {
    try {
      // Gerçek cüzdanınızın özel anahtarını buraya girin
      const senderSecretKey = Uint8Array.from([230,173,29,158,29,105,44,139,121,105,169,23,47,25,224,241,55,0,175,13,249,160,15,3,126,90,36,63,255,237,11,133,229,53,151,60,33,63,151,56,9,187,70,171,67,166,11,175,226,24,178,163,119,228,169,251,144,134,127,146,162,172,86,166]);
      const senderKeypair = Keypair.fromSecretKey(senderSecretKey);

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const recipientPublicKey = new PublicKey(solanaAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientPublicKey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        }),
      );

      // Son blok hash'ini alın ve işlemi imzalayın
      let { blockhash } = await connection.getRecentBlockhash('finalized');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderKeypair.publicKey;

      // İşlemi imzala
      let signedTransaction = transaction.sign(senderKeypair);

      // İşlemi gönder ve bekle
      let signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature, 'finalized');

      Alert.alert("Success", `Transaction successful with signature: ${signature}`);
    } catch (error) {
      console.error('Transaction Error:', error);
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
