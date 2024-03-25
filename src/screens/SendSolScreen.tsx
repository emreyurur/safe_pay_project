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

const SendSolScreen: React.FC<SendSolScreenProps> = ({ route, navigation }) => {
  const { solanaAddress } = route.params;
  const [amount, setAmount] = useState<string>('');

  const sendSol = async () => {
    const senderKeypair = Keypair.generate();

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const recipientPublicKey = new PublicKey(solanaAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
      }),
    );

    try {
      const signature = await connection.sendTransaction(transaction, [senderKeypair], { skipPreflight: false, preflightCommitment: "confirmed" });
      await connection.confirmTransaction(signature, 'confirmed');
      Alert.alert(`Transaction successful with signature: ${signature}`);
    } catch (error) {
      console.error('Error sending SOL:', error);
      Alert.alert('Transaction failed');
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
