import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../services/api';
import { saveToken } from '../storage/auth';

type NavProp = NativeStackNavigationProp<any>;

export default function LoginScreen() {
  console.log('LoginScreen rendered');
  const navigation = useNavigation<NavProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre boş bırakılamaz.');
      return;
    }

    setLoading(true);
    try {
      console.log('Login: Sending request...');
      const response = await api.post('/auth/login', { username, password });
      console.log('Login: Response received:', response.data);
      await saveToken(response.data.token);
      console.log('Login: Token saved');
      // Giriş başarılı → ana sekmelere yönlendir, geri dönüş olmasın
      console.log('Login: Navigating to App...');
      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
      console.log('Login: Navigation reset called');
    } catch (error: any) {
      console.error('Login: Error:', error);
      console.error('Login: Error response:', error.response);
      if (error.response?.status === 401) {
        Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı.');
      } else {
        Alert.alert('Hata', 'Giriş sırasında bir sorun oluştu. Detay: ' + (error.message || 'Bilinmeyen hata'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="Kullanıcı adı"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#4f46e5', marginTop: 8 },
});
