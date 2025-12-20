import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Pressable, ScrollView, Dimensions, Share } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { NOVELS } from './LibraryScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'NovelDetail'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_TINY = H < 680;

const BG = require('../assets/background.png');

export default function NovelDetailScreen({ navigation, route }: Props) {
  const { novelId } = route.params;

  const novel = useMemo(() => NOVELS.find((n) => n.id === novelId), [novelId]);

  const onShare = async () => {
    if (!novel) return;
    await Share.share({
      message: `${novel.title}\n\n${novel.text}`,
    });
  };

  if (!novel) {
    return (
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <View style={styles.center}>
          <Text style={styles.title}>Novel not found</Text>
          <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Back</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.topBar, { paddingTop: IS_TINY ? 44 : 54 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Pressable style={styles.shareBtn} onPress={onShare}>
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <Image source={novel.image} style={styles.hero} resizeMode="cover" />

        <Text style={styles.novelTitle}>{novel.title}</Text>

        <View style={styles.textCard}>
          <Text style={styles.body}>{novel.text}</Text>
        </View>

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Pressable style={styles.bigShare} onPress={onShare}>
            <Text style={styles.bigShareText}>Share</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.70)',
  },
  backText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  shareBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#437cadff',
  },
  shareText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  hero: {
    width: Math.min(W * 0.92, 420),
    height: 220,
    borderRadius: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.75)',
  },

  novelTitle: {
    marginTop: 12,
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 18,
  },

  textCard: {
    width: Math.min(W * 0.92, 420),
    alignSelf: 'center',
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.75)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 14,
  },
  body: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },

  bigShare: {
    width: 200,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#437cadff',
    alignItems: 'center',
  },
  bigShareText: { color: '#fff', fontWeight: '900' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  btn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: '#437cadff' },
  btnText: { color: '#fff', fontWeight: '900' },
});
