import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import { getSubjects, Subject } from '../services/subjectService';

// Bugünün tarihini YYYY-MM-DD formatında döner
const getTodayStr = (): string => new Date().toISOString().split('T')[0];

interface StatInput {
  solved_count: string;
  net: string;
}

export default function HomeScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [inputs, setInputs] = useState<Record<number, StatInput>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = getTodayStr();

  const loadData = useCallback(async () => {
    setLoading(true);
    console.log('HomeScreen: Veriler yükleniyor...');
    
    try {
      // 1. Dersleri çek (JWT gerektirmez)
      const subjectList = await getSubjects();
      setSubjects(subjectList);
      console.log('HomeScreen: Dersler yüklendi:', subjectList.length);

      // 2. İstatistikleri çek (JWT gerektirir)
      let existingStats = [];
      try {
        const statsRes = await api.get(`/daily-stats?date=${today}`);
        existingStats = statsRes.data;
        console.log('HomeScreen: Mevcut istatistikler yüklendi:', existingStats.length);
      } catch (statsError: any) {
        console.warn('HomeScreen: İstatistikler çekilemedi (401?), devam ediliyor...', statsError.message);
      }

      // 3. Inputları doldur
      const initialInputs: Record<number, StatInput> = {};
      subjectList.forEach((s) => {
        const existing = existingStats.find((e: any) => e.subject_id === s.id);
        initialInputs[s.id] = {
          solved_count: existing ? String(existing.solved_count) : '',
          net: existing ? String(existing.net) : '',
        };
      });
      setInputs(initialInputs);
    } catch (error: any) {
      console.error('HomeScreen: Kritik yükleme hatası:', error);
      Alert.alert('Hata', 'Ders listesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  }, [today]);



  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Her ders için ayrı POST isteği gönder (sadece dolu olanlar)
      const requests = subjects
        .filter((s) => inputs[s.id]?.solved_count !== '')
        .map((s) =>
          api.post('/daily-stats', {
            subject_id: s.id,
            date: today,
            solved_count: parseInt(inputs[s.id].solved_count) || 0,
            net: parseFloat(inputs[s.id].net) || 0,
          }),
        );

      await Promise.all(requests);
      Alert.alert('Başarılı', 'Kayıtlar kaydedildi.');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Kayıt sırasında hata oluştu.';
      Alert.alert('Hata', Array.isArray(msg) ? msg.join('\n') : msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Günlük Soru Girişi</Text>
      <Text style={styles.date}>{today}</Text>

      {subjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz ders eklenmemiş</Text>
          <Text style={styles.emptySubtext}>Admin panelinden ders ekleyebilirsiniz</Text>
        </View>
      ) : (
        subjects.map((subject) => (
        <View key={subject.id} style={styles.card}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Çözülen</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                value={inputs[subject.id]?.solved_count ?? ''}
                onChangeText={(v) =>
                  setInputs((prev) => ({
                    ...prev,
                    [subject.id]: { ...prev[subject.id], solved_count: v },
                  }))
                }
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Net</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                value={inputs[subject.id]?.net ?? ''}
                onChangeText={(v) =>
                  setInputs((prev) => ({
                    ...prev,
                    [subject.id]: { ...prev[subject.id], net: v },
                  }))
                }
              />
            </View>
          </View>
        </View>
      ))
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kaydet</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  date: { color: '#666', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  subjectName: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { flex: 1 },
  label: { fontSize: 12, color: '#666', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
