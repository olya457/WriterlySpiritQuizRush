import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_SMALL = H < 750;
const IS_TINY = H < 680;
const BG = require('../assets/background.png');
const ONB = {
  s1: require('../assets/onboard1.png'),
  s2: require('../assets/onboard2.png'),
  s3: require('../assets/onboard3.png'),
  s4: require('../assets/onboard4.png'),
};

export default function OnboardingScreen({ navigation }: Props) {
  const steps = useMemo(
    () => [
      {
        title: 'Discover the World of Classic Literature',
        text: 'Step into a new journey through timeless stories, iconic authors, and unforgettable characters.',
        image: ONB.s1,
        button: 'Next',
      },
      {
        title: 'Choose Your Challenge',
        text: 'Test your knowledge in the Classic Quiz or try the fast-paced True or False mode — the choice is yours.',
        image: ONB.s2,
        button: 'Next',
      },
      {
        title: 'Earn Bookcoins as You Play',
        text: 'Every correct answer brings you closer to unlocking exclusive literary novels in your personal Library.',
        image: ONB.s3,
        button: 'Next',
      },
      {
        title: 'Build Your Collection',
        text: 'Exchange Bookcoins for beautifully crafted stories and expand your literary universe one win at a time.',
        image: ONB.s4,
        button: 'Begin',
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const onNext = () => {
    const isLast = idx === steps.length - 1;
    if (isLast) navigation.replace('Menu');
    else setIdx((p) => p + 1);
  };

  const cardW = Math.min(W - 34, 340);
  const cardTop = 100;
  const imgH = IS_TINY ? Math.min(H * 0.46, 360) : IS_SMALL ? Math.min(H * 0.52, 420) : Math.min(H * 0.56, 460);

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={styles.root}>
        <View style={[styles.topCard, { width: cardW, marginTop: cardTop }]}>
          <Text style={[styles.topTitle, IS_TINY && styles.topTitleTiny]}>{step.title}</Text>
          <Text style={[styles.topText, IS_TINY && styles.topTextTiny]}>{step.text}</Text>
        </View>

        <View style={styles.bottom}>
          <Image 
            source={step.image} 
            style={[styles.onbImage, { height: imgH, width: Math.min(W * 0.86, 360) }]} 
            resizeMode="contain" 
          />

          <Pressable style={styles.btn} onPress={onNext}>
            <Text style={styles.btnText}>{step.button}</Text>
          </Pressable>

          <View style={styles.dots}>
            {steps.map((_, i) => (
              <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  root: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(4, 10, 30, 0.55)',
    borderWidth: 2,
    borderColor: 'rgba(130, 220, 255, 0.55)',
    zIndex: 10,
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  topTitleTiny: { fontSize: 15 },
  topText: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  topTextTiny: { fontSize: 12, lineHeight: 17 },
  bottom: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 10 : 20, 
  },
  onbImage: {
    marginBottom: 14,
  },
  btn: {
    minWidth: 92,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#437cadff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 18,
  },
});