import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HistoryItem {
  wagerID: string;
  amount: number;
  pickedOutcome: string;
  betTitle: string;
  betDescription: string;
  odds: number;
  type: string;
  outcome: string | null;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        console.warn('Username not found in storage.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5001/History?username=${username}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.betTitle}</Text>
      <Text>{item.betDescription}</Text>
      <Text>Amount Wagered: ${item.amount}</Text>
      <Text>Picked: {item.pickedOutcome}</Text>
      <Text>Odds: {item.odds}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Outcome: {item.outcome || 'Pending'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Bet History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.wagerID}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No bet history available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F4F9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});
