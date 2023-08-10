import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getDataStorage,
  removeDataStorage,
  storeDataStorage,
} from '../../utils/Hook/storage';
import {fetchDetailuser} from './actions';
import {RenderIf} from '../../utils/Hook/RenderIf';
import {useIsFocused} from '@react-navigation/native';

export default function Home({navigation = null as any}) {
  const isFocused = useIsFocused();
  const queryClient = new QueryClient();
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggleSwitch = async () => {
    setIsEnabled(prev => {
      storeDataStorage('biometric', !prev);
      return !prev;
    });
  };

  const handleRemoveToken = async () => {
    removeDataStorage('token').then(() => {
      // removeDataStorage('user');
      navigation.push('Login');
    });
  };

  useEffect(() => {
    isFocused &&
      getDataStorage('biometric').then(res => {
        setIsEnabled(res);
      });
  }, [isFocused]);

  return (
    <SafeAreaView>
      <View style={styles.headerSection}>
        <Text style={styles.text}>Home</Text>
        <Pressable onPress={handleRemoveToken}>
          <Text style={styles.textLogout}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.containerSwitch}>
        <View style={styles.switch}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => handleToggleSwitch()}
            value={isEnabled}
          />
        </View>
        <View>
          <Text> Biometric Login</Text>
        </View>
      </View>

      <View style={styles.container}>
        <QueryClientProvider client={queryClient}>
          <DetailUser />
        </QueryClientProvider>
      </View>
    </SafeAreaView>
  );
}

const DetailUser = () => {
  const {
    status,
    isLoading,
    data: user,
  } = useQuery({
    queryKey: ['data'],
    queryFn: () =>
      getDataStorage('token').then(res => {
        return fetchDetailuser(res).then(resJson => {
          return resJson;
        });
      }),
  });

  return (
    <RenderIf condition={!isLoading && status === 'success'}>
      <View>
        <Text style={styles.textSub}>Detail User</Text>
        <RenderIf condition={user}>
          <Image
            source={{
              uri: user?.avatar,
            }}
            style={styles.avatarFrame}
          />
        </RenderIf>
        <Text>{user?.email}</Text>
      </View>
    </RenderIf>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  containerSwitch: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  switch: {
    marginVertical: 24,
    // flex: 1,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  textLogout: {
    color: 'red',
  },
  container: {
    paddingHorizontal: 14,
    marginTop: 12,
  },
  textSub: {
    fontSize: 24,
    fontWeight: '500',
  },
  avatarFrame: {
    width: 100,
    height: 100,
  },
});
