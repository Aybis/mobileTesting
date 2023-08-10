import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import React, {useEffect, useState} from 'react';
import {Alert, Button, StatusBar, Text, TouchableHighlight} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Home() {
  const [isBiometricSupported, setIsBiometricSupported] =
    useState<boolean>(false);

  const storeData = async (value: any) => {
    try {
      await AsyncStorage.setItem('my-key', value);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  console.log(storeData);

  // Check if hardware supports biometrics
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

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

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable) {
      console.log(LocalAuthentication, 'LocalAuthentication');
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
    }

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      console.log('testt');
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
    });

    console.log(biometricAuth, 'biometricAuth');
    // Log the user in on success
    if (biometricAuth) {
      console.log('success');
    }

    console.log(LocalAuthentication, 'local auth');
    console.log(supportedBiometrics);
    console.log(savedBiometrics, 'is enroll');
    console.log(biometricAuth);
  };

  return (
    <SafeAreaView>
      <Text
        style={{
          color: 'black',
        }}>
        {isBiometricSupported
          ? 'Your device is compatible with Biometrics'
          : 'Face or Fingerprint scanner is available on this device'}
      </Text>

      <TouchableHighlight
        style={{
          height: 60,
        }}>
        <Button
          title="Login with Biometrics"
          color="#fe7005"
          onPress={handleBiometricAuth}
        />
      </TouchableHighlight>

      <StatusBar />

      {/* <Button
        // onPress={() => navigation.navigate('Detail', {name: 'Detail Screen'})}
        onPress={handleBiometricAuth}
        title="Test Biometric"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
    </SafeAreaView>
  );
}
