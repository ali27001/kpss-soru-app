import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
let memoryToken: string | null = null; // AsyncStorage hatası için geçici çözüm

export const saveToken = async (token: string): Promise<void> => {
  memoryToken = token; // Hemen memory'ye kaydet
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('AsyncStorage error in saveToken:', error);
    // Memory'de tutmaya devam et, hata fırlatma
  }
};

export const getToken = async (): Promise<string | null> => {
  if (memoryToken) return memoryToken; // Memory'den döndür
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('AsyncStorage error in getToken:', error);
    return memoryToken; // Memory'dekini döndür
  }
};

export const removeToken = async (): Promise<void> => {
  memoryToken = null;
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('AsyncStorage error in removeToken:', error);
  }
};
