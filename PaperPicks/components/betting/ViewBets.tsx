// components/betting/ViewBets.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from '@/components/Themed';
import { ActivityIndicator, StyleSheet } from 'react-native';

type Bet = {
  _id: string;
  title: string;
  description: string;
  odds: number;
  type: string;
  outcome?: string | null;
};

export const ViewBets = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch('http://localhost:5001/betting/getBets');
        const data = await response.json();
        setBets(data);
      } catch (error) {
        console.error('Failed to fetch bets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Existing Bets</Text>
      {bets.length === 0 ? (
        <Text style={styles.empty}>No bets found.</Text>
      ) : (
        bets.map((bet) => (
          <View key={bet._id} style={styles.betCard}>
            <Text style={styles.title}>{bet.title}</Text>
            <Text>{bet.description}</Text>
            <Text>Odds: {bet.odds}</Text>
            <Text>Type: {bet.type}</Text>
            <Text>Outcome: {bet.outcome ?? 'Pending'}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { marginTop: 20 },
  container: { width: '100%', padding: 10 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  empty: { textAlign: 'center', marginTop: 10 },
  betCard: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  title: { fontWeight: 'bold', fontSize: 16 },
});
