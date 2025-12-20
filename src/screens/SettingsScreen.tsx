import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  Switch,
  Share,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_TINY = H < 680;
const IS_SMALL = H < 750;

const BG = require('../assets/background.png');

export default function SettingsScreen({ navigation }: Props) {
  const [vibrationOn, setVibrationOn] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  const CARD_W = useMemo(() => Math.min(W * 0.88, 360), []);
  const CARD_H = useMemo(() => (IS_TINY ? 240 : IS_SMALL ? 280 : 305), []);
  const MENU_W = useMemo(() => Math.min(W * 0.4, 170), []);

  const onShare = async () => {
    try {
      await Share.share({
        message:
          'Writerly Spirit: Quiz Rush — a literary quiz experience inspired by classic fiction. Try it and collect bookcoins!',
      });
    } catch {}
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={styles.root}>
        <View style={[styles.contentShift, { width: CARD_W, height: CARD_H }]}>
          <View style={styles.cardGlow}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Settings</Text>

              <View style={[styles.row, IS_TINY && { height: 42 }]}>
                <Text style={styles.rowText}>Vibration</Text>
                <View style={styles.rightBlock}>
                  <Text style={styles.iconPurple}>📳</Text>
                  <Switch
                    value={vibrationOn}
                    onValueChange={setVibrationOn}
                    trackColor={{ false: 'rgba(255,255,255,0.18)', true: 'rgba(130, 165, 225, 0.45)' }}
                    thumbColor={vibrationOn ? '#437cadff' : '#C7CBD1'}
                    style={Platform.OS === 'ios' ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] } : {}}
                  />
                </View>
              </View>

              <Pressable style={[styles.rowPress, IS_TINY && { height: 42 }]} onPress={() => setShowAbout(true)}>
                <Text style={styles.rowText}>About App</Text>
                <Text style={styles.iconPurple}>ⓘ</Text>
              </Pressable>

              <Pressable style={[styles.rowPress, IS_TINY && { height: 42 }]} onPress={onShare}>
                <Text style={styles.rowText}>Share App</Text>
                <Text style={styles.iconPurple}>↗</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.menuBtn, { width: MENU_W, bottom: (IS_TINY ? 40 : 60) + 40 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.menuBtnText}>Menu</Text>
        </Pressable>

        <Modal
          visible={showAbout}
          transparent
          animationType="fade"
          statusBarTranslucent={true}
          onRequestClose={() => setShowAbout(false)}
        >
          <View style={styles.modalWrap}>
            <View style={[styles.aboutGlow, { width: Math.min(W * 0.9, 380), maxHeight: H * 0.7 }]}>
              <View style={styles.aboutInner}>
                <Text style={styles.aboutTitle}>About App</Text>

                <ScrollView
                  style={{ width: '100%' }}
                  contentContainerStyle={{ paddingBottom: 15 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.aboutText}>
                    Silent Prairie: Literary Quiz is a literary quiz experience inspired by classic fiction, iconic authors, and timeless
                    stories.{"\n\n"}
                    The app invites users to test their knowledge through thoughtfully crafted quiz modes, collect bookcoins, and unlock
                    original artistic novellas inspired by the world of literature.{"\n\n"}
                    Designed with a clean neon aesthetic and a calm, immersive atmosphere, the experience focuses on curiosity,
                    learning, and enjoyment without pressure or complexity.{"\n\n"}
                    Whether answering classic multiple-choice questions or choosing between true and false, every session is a chance
                    to rediscover literature in a playful, modern way.
                  </Text>
                </ScrollView>
              </View>
            </View>

            <Pressable style={styles.closeBtn} onPress={() => setShowAbout(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const R = 22;

const styles = StyleSheet.create({
  bg: { flex: 1 },

  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  contentShift: {
    transform: [{ translateY: -30 }],
  },

  cardGlow: {
    flex: 1,
    borderRadius: R,
    borderWidth: 3,
    borderColor: 'rgba(90,205,255,0.85)',
    backgroundColor: 'rgba(12, 12, 35, 0.92)',
    overflow: 'hidden',
    shadowColor: 'rgba(90,205,255,1)',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  cardInner: {
    flex: 1,
    paddingHorizontal: IS_TINY ? 14 : 18,
    paddingTop: IS_TINY ? 12 : 18,
    paddingBottom: 10,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: IS_TINY ? 16 : 18,
    textAlign: 'center',
    marginBottom: IS_TINY ? 12 : 18,
  },

  row: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: IS_TINY ? 8 : 12,
  },

  rowPress: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: IS_TINY ? 8 : 12,
  },

  rowText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: IS_TINY ? 13 : 14,
  },

  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconPurple: {
    color: '#437cadff',
    fontSize: IS_TINY ? 16 : 18,
    fontWeight: '900',
  },

  menuBtn: {
    position: 'absolute',
    borderRadius: 12,
    paddingVertical: IS_TINY ? 10 : 12,
    alignItems: 'center',
    backgroundColor: '#437cadff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: IS_TINY ? 13 : 14 },

  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  aboutGlow: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(90,205,255,0.85)',
    backgroundColor: 'rgba(10, 10, 25, 0.98)',
  },
  aboutInner: {
    padding: IS_TINY ? 16 : 20,
  },
  aboutTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: IS_TINY ? 16 : 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  aboutText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: IS_TINY ? 12 : 13.5,
    lineHeight: IS_TINY ? 17 : 20,
    textAlign: 'center',
  },

  closeBtn: {
    marginTop: 15,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#437cadff',
  },
  closeBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
});
