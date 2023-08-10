import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataStorage = async (key: string, value: any) => {
  console.log(value, '<<<value');
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (e) {
    // saving error
    console.log(e);
  }
};

export const getDataStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    // error reading value
    return false;
  }
};

export const removeDataStorage = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
    console.log(e);
  }
};
