import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import api from '../services/api';

interface WeeklySummary {
  date: string;
  total_solved: number;
}

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [data, setData] = useState<WeeklySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWeekly = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<WeeklySummary[]>('/daily-stats/weekly');
      setData(res.data);
    } catch (error) {
      console.error('Error loading weekly stats:', error);
      Alert.alert('Hata', 'Haftalık veri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeekly();
  }, [loadWeekly]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // react-native-chart-kit'in beklediği format
  const chartData = {
    labels: data.map((d) => d.date.slice(5)), // MM-DD formatında göster
    datasets: [{ data: data.map((d) => d.total_solved) }],
  };

  const totalSolved = data.reduce((sum, d) => sum + d.total_solved, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Haftalık İstatistik</Text>
      <Text style={styles.subtitle}>Son 7 gün — toplam {totalSolved} soru</Text>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz veri bulunmuyor</Text>
          <Text style={styles.emptySubtext}>Soru çözdükçe burada grafik görünecek</Text>
        </View>
      ) : (
        <>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#4f46e5',
              backgroundGradientFrom: '#4f46e5',
              backgroundGradientTo: '#7c3aed',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
          />

          {/* Tarih bazlı detay listesi */}
          {data.map((d) => (
            <View key={d.date} style={styles.row}>
              <Text style={styles.rowDate}>{d.date}</Text>
              <Text style={styles.rowValue}>{d.total_solved} soru</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 16 },
  chart: { borderRadius: 12, marginBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowDate: { color: '#333' },
  rowValue: { fontWeight: '600', color: '#4f46e5' },
});
