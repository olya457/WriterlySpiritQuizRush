import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const { height: H, width: W } = Dimensions.get('window');
const IS_SMALL = H < 750;
const IS_TINY = H < 680;

const BG = require('../assets/background.png'); 
const LOGO = require('../assets/logo.png');     

export default function LoaderScreen({ navigation }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(t);
  }, [navigation, logoOpacity, logoScale]);

  const logoSize = IS_TINY ? Math.min(W * 0.42, 150) : IS_SMALL ? Math.min(W * 0.48, 170) : Math.min(W * 0.52, 190);

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        <Animated.Image
          source={LOGO}
          style={[
            styles.logo,
            {
              width: logoSize,
              height: logoSize,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />

        <View style={{ height: IS_TINY ? 10 : 14 }} />

        <Text style={[styles.sub, IS_TINY && styles.subTiny]}>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  logo: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  sub: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  subTiny: {
    fontSize: 13,
  },
});
