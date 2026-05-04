import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import api from '../services/api';

interface DailyStat {
  id: number;
  subject_id: number;
  date: string;
  solved_count: number;
  net: number;
}

// react-native-calendars'ın beklediği işaretli günler formatı
type MarkedDates = Record<string, { marked: boolean; dotColor?: string }>;

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Mevcut ay için veri olan günleri işaretle
  // Basit yaklaşım: son 60 günü sorgula ve nokta koy
  const loadMarkedDates = useCallback(async () => {
    try {
      const marks: MarkedDates = {};
      const today = new Date();

      // Son 60 günü kontrol et
      for (let i = 0; i < 60; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const res = await api.get(`/daily-stats?date=${dateStr}`);
        if (res.data.length > 0) {
          marks[dateStr] = { marked: true, dotColor: '#4f46e5' };
        }
      }
      setMarkedDates(marks);
    } catch {
      // İşaretleme başarısız olsa da takvim çalışmaya devam eder
    }
  }, []);

  useEffect(() => {
    loadMarkedDates();
  }, [loadMarkedDates]);

  const handleDayPress = async (day: DateData) => {
    setSelectedDate(day.dateString);
    setLoadingStats(true);
    try {
      const res = await api.get(`/daily-stats?date=${day.dateString}`);
      setStats(res.data);
    } catch {
      Alert.alert('Hata', 'Veriler yüklenemedi.');
    } finally {
      setLoadingStats(false);
    }
  };

  // Seçili günün işaretini selected olarak güncelle
  const combinedMarks = selectedDate
    ? {
        ...markedDates,
        [selectedDate]: {
          ...(markedDates[selectedDate] || {}),
          selected: true,
          selectedColor: '#4f46e5',
        },
      }
    : markedDates;

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={combinedMarks}
        theme={{
          todayTextColor: '#4f46e5',
          selectedDayBackgroundColor: '#4f46e5',
          arrowColor: '#4f46e5',
        }}
      />

      <View style={styles.detail}>
        {!selectedDate && (
          <Text style={styles.hint}>Detay görmek için bir güne tıkla</Text>
        )}

        {selectedDate && loadingStats && (
          <ActivityIndicator color="#4f46e5" style={{ marginTop: 20 }} />
        )}

        {selectedDate && !loadingStats && stats.length === 0 && (
          <Text style={styles.empty}>Bu gün için kayıt bulunamadı</Text>
        )}

        {selectedDate && !loadingStats && stats.length > 0 && (
          <>
            <Text style={styles.dateTitle}>{selectedDate}</Text>
            {stats.map((s) => (
              <View key={s.id} style={styles.statRow}>
                <Text style={styles.statSubject}>Ders #{s.subject_id}</Text>
                <Text style={styles.statValue}>Çözülen: {s.solved_count}</Text>
                <Text style={styles.statValue}>Net: {s.net}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  detail: { flex: 1, padding: 16 },
  hint: { color: '#999', textAlign: 'center', marginTop: 20 },
  empty: { color: '#666', textAlign: 'center', marginTop: 20 },
  dateTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statSubject: { fontWeight: '500', flex: 1 },
  statValue: { color: '#555', marginLeft: 8 },
});
