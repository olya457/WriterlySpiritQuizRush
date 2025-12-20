import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_SMALL = H < 750;
const IS_TINY = H < 680;

const BG = require('../assets/background.png');
const TOP_IMG = require('../assets/onboard1.png');

const ICONS = {
  quiz: require('../assets/icon_quiz.png'),
  tf: require('../assets/icon_truefalse.png'),
  lib: require('../assets/icon_library.png'),
  settings: require('../assets/icon_settings.png'),
};

function GradientButton({
  title,
  onPress,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: any;
  style?: any;
}) {
  return (
    <Animated.View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.btnWrap,
          pressed && {
            transform: [{ scale: 0.985 }],
            opacity: Platform.OS === 'android' ? 0.96 : 1,
          },
        ]}
      >
        <View style={styles.btnGradBack} />
        <View style={styles.btnGradGlow1} />
        <View style={styles.btnGradGlow2} />

        <View style={styles.btnContent}>
          {icon ? (
            <View style={styles.iconBox}>
              <Image source={icon} style={styles.btnIcon} resizeMode="contain" />
            </View>
          ) : null}

          <Text style={styles.btnText}>{title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function MenuScreen({ navigation }: Props) {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(18)).current;
  const heroScale = useRef(new Animated.Value(0.98)).current;
  const b1 = useRef(new Animated.Value(0)).current;
  const b2 = useRef(new Animated.Value(0)).current;
  const b3 = useRef(new Animated.Value(0)).current;
  const b4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(heroY, { toValue: 0, duration: 520, useNativeDriver: true }),
      Animated.spring(heroScale, { toValue: 1, friction: 8, tension: 90, useNativeDriver: true }),
    ]).start(() => {
      Animated.stagger(90, [
        Animated.spring(b1, { toValue: 1, friction: 7, tension: 110, useNativeDriver: true }),
        Animated.spring(b2, { toValue: 1, friction: 7, tension: 110, useNativeDriver: true }),
        Animated.spring(b3, { toValue: 1, friction: 7, tension: 110, useNativeDriver: true }),
        Animated.spring(b4, { toValue: 1, friction: 7, tension: 110, useNativeDriver: true }),
      ]).start();
    });
  }, [heroOpacity, heroY, heroScale, b1, b2, b3, b4]);

  const topH = IS_TINY
    ? Math.min(H * 0.28, 230)
    : IS_SMALL
      ? Math.min(H * 0.32, 260)
      : Math.min(H * 0.36, 290);

  const btnW = Math.min(W * 0.78, 310);
  const down = IS_TINY ? 26 : 40;

  const heroStyle = {
    opacity: heroOpacity,
    transform: [{ translateY: heroY }, { scale: heroScale }],
  };

  const btnAnim = (v: Animated.Value) => ({
    opacity: v,
    transform: [
      {
        translateY: v.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
      {
        scale: v.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1],
        }),
      },
    ],
  });

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.root, { paddingTop: (IS_TINY ? 44 : 56) + down }]}>
        <Animated.View style={heroStyle}>
          <Image
            source={TOP_IMG}
            style={[styles.topImage, { height: topH, width: Math.min(W * 0.86, 360) }]}
            resizeMode="contain"
          />
        </Animated.View>
        <View style={[styles.col, { width: btnW }]}>
          <GradientButton
            title="Classic Quiz"
            icon={ICONS.quiz}
            onPress={() => navigation.navigate('ClassicQuiz')}
            style={btnAnim(b1)}
          />

          <GradientButton
            title="True/False"
            icon={ICONS.tf}
            onPress={() => navigation.navigate('TrueFalse')}
            style={btnAnim(b2)}
          />

          <GradientButton
            title="Library"
            icon={ICONS.lib}
            onPress={() => navigation.navigate('Library')}
            style={btnAnim(b3)}
          />

          <GradientButton
            title="Settings"
            icon={ICONS.settings}
            onPress={() => navigation.navigate('Settings')}
            style={btnAnim(b4)}
          />
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
    paddingHorizontal: 18,
  },

  topImage: {
    marginBottom: IS_TINY ? 14 : 18,
    alignSelf: 'center',
  },

  col: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: IS_TINY ? 10 : 14,
    paddingBottom: IS_TINY ? 18 : 24,
  },

  btnWrap: {
    width: '100%',
    height: IS_TINY ? 58 : 62,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  btnGradBack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#437cadff',
    opacity: 0.95,
  },
  btnGradGlow1: {
    position: 'absolute',
    right: -48,
    top: -52,
    width: 190,
    height: 190,
    borderRadius: 190,
    backgroundColor: '#437cadff',
    opacity: 0.9,
  },
  btnGradGlow2: {
    position: 'absolute',
    left: -70,
    bottom: -70,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: '#437cadff',
    opacity: 0.35,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnIcon: {
    width: 24,
    height: 24,
  },

  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: IS_TINY ? 15 : 16,
    textAlign: 'center',
  },
});
