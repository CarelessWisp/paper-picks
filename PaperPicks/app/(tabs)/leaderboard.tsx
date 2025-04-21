import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Picker } from '@react-native-picker/picker';

interface UserData {
  userID: string; // Use string instead of mongoose.ObjectId
  username: string;
  email: string;
  balance: number;
  amountWon: number;
  amountLost: number;
  wins: number;
  losses: number;
}

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<'amountWon' | 'balance'>('amountWon');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/leaderboard?type=${sortType}`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [sortType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      <Picker
        selectedValue={sortType}
        onValueChange={(itemValue) => setSortType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Net Amount Won" value="amountWon" />
        <Picker.Item label="Balance" value="balance" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : leaderboard.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No data to display</Text>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => `${item.username}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.rank}>{index + 1}.</Text>
              <View>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.stats}>
                  Balance: ${item.balance.toFixed(2)} | Won: ${item.amountWon.toFixed(2)} | Lost: ${item.amountLost.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    fontSize: 14,
    color: '#555',
  },
});
