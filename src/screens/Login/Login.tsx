import { useIsFocused } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RenderIf } from '../../utils/Hook/RenderIf';
import { getDataStorage, storeDataStorage } from '../../utils/Hook/storage';
import { login, loginWithBiometric } from './actions';

export default function Login({ navigation = null as any }) {
  const [showForm, setshowForm] = useState(false);
  const isFocused = useIsFocused();
  const [form, setform] = useState({
    email: '',
    password: '',
  });

  const handleChangeForm = (name: string, value: string) => {
    setform({
      ...form,
      [name]: value,
    });
  };

  const alertComponent = (
    title: string,
    mess: any,
    btnTxt: string,
    btnFunc: () => void,
  ) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
    storeDataStorage('biometric', false);
    navigation.push('Login');
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable) {
      return alertComponent(
        'Please enter your password',
        'Biometric Authentication not supported',
        'OK',
        () => fallBackToDefaultAuth(),
      );
    }

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return alertComponent(
        'Biometric record not found',
        'Please login with your password',
        'OK',
        () => fallBackToDefaultAuth(),
      );
    }

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
      requireConfirmation: true,
      fallbackLabel: 'Use Password',
    });

    // Log the user in on success
    if (
      // biometricAuth.error !== 'user_cancel' &&
      biometricAuth.success === false
    ) {
      storeDataStorage('biometric', false);
      navigation.push('Login');
    }

    if (biometricAuth.success) {
      return await loginWithBiometric().then(res => {
        if (res.status === 201) {
          storeDataStorage('token', res.data.token);
          navigation.navigate('MainTabNavigation');
        }
      });
    }
  };

  const handleLogin = async () => {
    // when user have login and set login with biometric just show the button login only
    if (showForm) {
      return handleBiometricAuth();
    } else {
      return await login({
        email: form.email.toLowerCase(),
        password: form.password,
      }).then(res => {
        if (res.status === 201) {
          storeDataStorage(
            'user',
            JSON.stringify({
              email: form.email.toLowerCase(),
              password: form.password,
            }),
          );
          storeDataStorage('token', res.data.token);
          navigation.navigate('MainTabNavigation');
        }
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      getDataStorage('biometric').then(res => {
        setshowForm(res);
      });

      getDataStorage('token').then(res => {
        res && navigation.navigate('MainTabNavigation');
      });
    }
  }, [navigation, isFocused]);

  return (
    <SafeAreaView style={style.viewArea}>
      <View style={style.container}>
        <Text style={style.heading}>Loginsss</Text>
        <RenderIf condition={!showForm}>
          <TextInput
            placeholder="Enter your name"
            style={style.input}
            secureTextEntry={false}
            onChangeText={text => handleChangeForm('email', text)}
            value={form.email}
          />
          <TextInput
            placeholder="Password"
            style={style.input}
            secureTextEntry={true}
            onChangeText={text => handleChangeForm('password', text)}
            value={form.password}
          />
        </RenderIf>
        <Pressable
          disabled={!showForm && !form.email && !form.password}
          style={style.button}
          onPress={handleLogin}>
          <Text style={style.textButton}>
            {showForm ? 'Login Biometric' : 'Loginss'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  viewArea: {
    height: '100%',
    backgroundColor: 'white',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: 'silver',
    paddingHorizontal: 12,
    fontSize: 20,
    width: '100%',
    maxHeight: 50,
    borderRadius: 10,
    color: 'black',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'blue',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});
