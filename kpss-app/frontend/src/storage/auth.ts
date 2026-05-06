import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
let memoryToken: string | null = null; // Bellekte tutulan kopya

export const saveToken = async (token: string): Promise<void> => {
  memoryToken = token; // Anında belleğe yaz
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('AsyncStorage error in saveToken:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (memoryToken) return memoryToken; // Bellekte varsa anında döndür
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    memoryToken = token; // Belleği güncelle
    return token;
  } catch (error) {
    console.error('AsyncStorage error in getToken:', error);
    return null;
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



