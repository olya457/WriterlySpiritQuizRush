import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  Dimensions,
  Animated,
  Platform,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { addCoins } from '../store/bookcoins';

type Props = NativeStackScreenProps<RootStackParamList, 'TrueFalse'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_TINY = H < 680;
const IS_SMALL = H < 750;
const IS_BIG = H >= 860;

const BG = require('../assets/background.png');
const IMG_INTRO = require('../assets/classic_girl.png');
const IMG_QUESTION = require('../assets/classic_question.png');
const IMG_WIN = require('../assets/classic_win.png');
const IMG_LOSE = require('../assets/classic_lose.png');

type TF = {
  id: number;
  statement: string;
  answer: boolean;
  note?: string;
};

const ALL_TF: TF[] = [
  { id: 1, statement: '“Pride and Prejudice” was written by Jane Austen.', answer: true },
  { id: 2, statement: 'Jay Gatsby is the narrator of “The Great Gatsby.”', answer: false, note: 'Nick Carraway is the narrator.' },
  { id: 3, statement: '“Crime and Punishment” takes place in St. Petersburg.', answer: true },
  { id: 4, statement: 'George Orwell also wrote “Animal Farm.”', answer: true },
  { id: 5, statement: '“Moby-Dick” is primarily a novel about a shipwreck.', answer: false, note: 'It is about Captain Ahab’s obsession.' },
  { id: 6, statement: 'Oscar Wilde wrote “The Picture of Dorian Gray.”', answer: true },
  { id: 7, statement: 'Romeo and Juliet are members of rival noble families.', answer: true },
  { id: 8, statement: 'Sherlock Holmes lives at 221B Baker Street.', answer: true },
  { id: 9, statement: '“Brave New World” presents a utopian society without conflict.', answer: false, note: 'It is a dystopia.' },
  { id: 10, statement: 'Leo Tolstoy wrote both “War and Peace” and “Anna Karenina.”', answer: true },
  { id: 11, statement: 'Atticus Finch is a lawyer in “To Kill a Mockingbird.”', answer: true },
  { id: 12, statement: '“The Old Man and the Sea” is set mostly in a city environment.', answer: false, note: 'It takes place at sea.' },
  { id: 13, statement: 'Winston Smith rebels against a totalitarian government in “1984.”', answer: true },
  { id: 14, statement: '“Jane Eyre” was written by Emily Brontë.', answer: false, note: 'It was written by Charlotte Brontë.' },
  { id: 15, statement: 'Holden Caulfield is the main character of “The Catcher in the Rye.”', answer: true },
  { id: 16, statement: '“Frankenstein” was written in the 20th century.', answer: false, note: 'It was published in 1818.' },
  { id: 17, statement: 'Franz Kafka wrote “The Trial.”', answer: true },
  { id: 18, statement: 'Middle-earth is the fictional setting of “The Lord of the Rings.”', answer: true },
  { id: 19, statement: '“Wuthering Heights” was written by Charlotte Brontë.', answer: false, note: 'It was written by Emily Brontë.' },
  { id: 20, statement: 'Charles Dickens wrote “Great Expectations.”', answer: true },
  { id: 21, statement: 'Heathcliff is a central character in “Wuthering Heights.”', answer: true },
  { id: 22, statement: '“The Stranger” was written by Jean-Paul Sartre.', answer: false, note: 'It was written by Albert Camus.' },
  { id: 23, statement: 'Dracula is a novel by Bram Stoker.', answer: true },
  { id: 24, statement: 'Gregor Samsa turns into an animal in “The Metamorphosis.”', answer: true },
  { id: 25, statement: '“War and Peace” focuses exclusively on one family.', answer: false, note: 'It follows multiple families.' },
  { id: 26, statement: 'John Steinbeck wrote “The Grapes of Wrath.”', answer: true },
  { id: 27, statement: 'Elizabeth Bennet appears in “Sense and Sensibility.”', answer: false, note: 'She appears in “Pride and Prejudice”.' },
  { id: 28, statement: '“Don Quixote” is considered one of the first modern novels.', answer: true },
  { id: 29, statement: 'Ernest Hemingway wrote “The Sun Also Rises.”', answer: true },
  { id: 30, statement: 'Raskolnikov is the main character in “Crime and Punishment.”', answer: true },
  { id: 31, statement: '“The Brothers Karamazov” explores themes of faith, doubt, and morality.', answer: true },
  { id: 32, statement: 'Gabriel García Márquez wrote “One Hundred Years of Solitude.”', answer: true },
  { id: 33, statement: 'In “Animal Farm,” the pigs represent the working class.', answer: false, note: 'They represent the ruling elite.' },
  { id: 34, statement: '“The Name of the Rose” is set in a medieval monastery.', answer: true },
  { id: 35, statement: 'Victor Hugo wrote “Les Misérables.”', answer: true },
  { id: 36, statement: 'Hester Prynne is punished for adultery in “The Scarlet Letter.”', answer: true },
  { id: 37, statement: '“Of Mice and Men” is set during the Great Depression.', answer: true },
  { id: 38, statement: 'William Faulkner wrote “The Sound and the Fury.”', answer: true },
  { id: 39, statement: 'Meursault is emotionally detached in “The Stranger.”', answer: true },
  { id: 40, statement: '“Fahrenheit 451” depicts a society where books are protected.', answer: false, note: 'Books are banned and burned.' },
];

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function buildPack(all: TF[], count: number): TF[] {
  if (all.length >= count) return shuffle(all).slice(0, count);
  const out: TF[] = [];
  let safety = 0;
  while (out.length < count && safety < 500) {
    out.push(all[safety % all.length]);
    safety++;
  }
  return shuffle(out).slice(0, count);
}

type Phase = 'intro' | 'question' | 'feedback' | 'win' | 'lose';

export default function TrueFalseScreen({ navigation }: Props) {
  const QUIZ_COUNT = 10;

  const [pack, setPack] = useState<TF[]>(() => buildPack(ALL_TF, QUIZ_COUNT));
  const [phase, setPhase] = useState<Phase>('intro');

  const [answered, setAnswered] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [lastOk, setLastOk] = useState<boolean | null>(null);

  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const [showExit, setShowExit] = useState(false);

  const q = pack[answered];

  const rewardedRef = useRef(false);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(46)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  const playIn = () => {
    fade.stopAnimation();
    translateY.stopAnimation();
    scale.stopAnimation();

    fade.setValue(0);
    translateY.setValue(46);
    scale.setValue(0.92);

    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    playIn();
  }, [phase, answered]);

  const contentAnim = useMemo(
    () => ({ opacity: fade, transform: [{ translateY }, { scale }] }),
    [fade, translateY, scale]
  );

  const goMenu = () => navigation.replace('Menu');

  const startQuiz = () => {
    rewardedRef.current = false; 
    setPack(buildPack(ALL_TF, QUIZ_COUNT));
    setLives(3);
    setScore(0);
    setAnswered(0);
    setSelected(null);
    setLastOk(null);
    setPhase('question');
  };

  const restart = () => startQuiz();

  const confirm = () => {
    if (selected === null || !q) return;
    const ok = selected === q.answer;
    setLastOk(ok);
    setPhase('feedback');
  };

  const rewardCoinsOnce = async (amount: number) => {
    if (rewardedRef.current) return;
    rewardedRef.current = true;
    try {
      if (amount > 0) await addCoins(amount);
    } catch {
 
    }
  };

  const next = () => {
    if (!q || selected === null || lastOk === null) return;

    const nextLives = lastOk ? lives : lives - 1;
    const nextScore = lastOk ? score + 1 : score;

    setLives(nextLives);
    setScore(nextScore);

    setSelected(null);
    setLastOk(null);

    const nextAnswered = answered + 1;

    if (nextLives <= 0) {
      void rewardCoinsOnce(nextScore);
      setPhase('lose');
      return;
    }

    if (nextAnswered >= QUIZ_COUNT) {
      void rewardCoinsOnce(nextScore * 3);
      setPhase('win');
      return;
    }

    setAnswered(nextAnswered);
    setPhase('question');
  };

  const cardW = Math.min(W * 0.92, 390);
  const topImageH = IS_TINY
    ? Math.min(H * 0.30, 250)
    : IS_SMALL
      ? Math.min(H * 0.34, 300)
      : Math.min(H * 0.38, 350);

  const DOWN = IS_TINY ? 58 : 80;
  const BTN_W = IS_BIG ? 180 : IS_TINY ? 128 : 145;
  const BTN_PY = IS_BIG ? 12 : IS_TINY ? 9 : 10;
  const INTRO_IMG_SHIFT = -20;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      {phase !== 'intro' && (
        <View style={[styles.hud, { paddingTop: IS_TINY ? 44 : 52 }]}>
          <View style={styles.hudLeft}>
            <Text style={styles.hudHeart}>♥</Text>
            <Text style={styles.hudHeart}>♥</Text>
            <Text style={styles.hudHeart}>♥</Text>
            <Text style={styles.hudText}> {Math.max(lives, 0)}</Text>
          </View>
          <View style={styles.hudRight}>
            <Text style={styles.hudText}>× {score}</Text>
          </View>
        </View>
      )}

      <View style={[styles.contentWrap, { paddingTop: (IS_TINY ? 52 : 60) + DOWN }]}>
        {phase === 'intro' && (
          <Animated.View style={[styles.screen, contentAnim]}>
            <Image
              source={IMG_INTRO}
              style={{ width: cardW, height: topImageH, marginTop: INTRO_IMG_SHIFT }}
              resizeMode="contain"
            />

            <View style={[styles.card, { width: cardW, padding: IS_BIG ? 18 : 16 }]}>
              <Text style={[styles.cardTitle, { fontSize: IS_BIG ? 18 : IS_TINY ? 15 : 16 }]}>
                True or False Challenge
              </Text>
              <Text style={[styles.cardSub, { fontSize: IS_BIG ? 14 : IS_TINY ? 12 : 13, lineHeight: IS_BIG ? 20 : 18 }]}>
                Trust your intuition and react fast. Decide what’s true and what’s not as classic literature puts your instincts to the test.
              </Text>
            </View>

            <View style={styles.btnRow}>
              <Pressable style={[styles.btnSmall, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={startQuiz}>
                <Text style={styles.btnSmallText}>Start</Text>
              </Pressable>
              <Pressable style={[styles.btnSmall, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={goMenu}>
                <Text style={styles.btnSmallText}>Menu</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {(phase === 'question' || phase === 'feedback') && q && (
          <Animated.View style={[styles.screen, contentAnim]}>
            <Image source={IMG_QUESTION} style={{ width: cardW, height: topImageH }} resizeMode="contain" />

            <View style={[styles.qCard, { width: cardW, padding: IS_BIG ? 14 : 12 }]}>
              <Text style={[styles.qTitle, { fontSize: IS_BIG ? 14 : IS_TINY ? 12 : 13 }]}>{q.statement}</Text>
            </View>

            <View style={[styles.dotsRow, { width: cardW }]}>
              {Array.from({ length: QUIZ_COUNT }).map((_, i) => {
                const active = i === answered;
                const done = i < answered;
                return <View key={`dot-${i}`} style={[styles.dot, done && styles.dotDone, active && styles.dotActive]} />;
              })}
            </View>

            <View style={[styles.tfRow, { width: cardW }]}>
              {(['True', 'False'] as const).map((label) => {
                const val = label === 'True';
                const locked = phase === 'feedback';
                const isSelected = selected === val && phase === 'question';

                const correctBtn = phase === 'feedback' && val === q.answer;
                const wrongPick = phase === 'feedback' && selected === val && val !== q.answer;

                return (
                  <Pressable
                    key={label}
                    disabled={locked}
                    onPress={() => setSelected(val)}
                    style={[
                      styles.tfBtn,
                      { height: IS_BIG ? 50 : IS_TINY ? 44 : 46 },
                      isSelected && styles.tfBtnActive,
                      correctBtn && styles.tfBtnCorrect,
                      wrongPick && styles.tfBtnWrong,
                    ]}
                  >
                    <Text style={[styles.tfText, { fontSize: IS_BIG ? 13 : IS_TINY ? 12 : 12 }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {phase === 'feedback' && lastOk !== null && (
              <View style={[styles.badge, lastOk ? styles.badgeOk : styles.badgeNo]}>
                <Text style={styles.badgeText}>{lastOk ? '✓' : '✕'}</Text>
              </View>
            )}

            <View style={styles.bottomBtns}>
              {phase === 'question' ? (
                <>
                  <Pressable
                    style={[
                      styles.btnConfirm,
                      { width: BTN_W, paddingVertical: BTN_PY },
                      selected === null && { opacity: 0.45 },
                    ]}
                    onPress={confirm}
                    disabled={selected === null}
                  >
                    <Text style={styles.btnConfirmText}>Confirm</Text>
                  </Pressable>

                  <Pressable style={[styles.btnMenu, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={() => setShowExit(true)}>
                    <Text style={styles.btnMenuText}>Menu</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable style={[styles.btnConfirm, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={next}>
                    <Text style={styles.btnConfirmText}>Next</Text>
                  </Pressable>

                  <Pressable style={[styles.btnMenu, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={() => setShowExit(true)}>
                    <Text style={styles.btnMenuText}>Menu</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {phase === 'lose' && (
          <Animated.View style={[styles.screen, contentAnim]}>
            <Image source={IMG_LOSE} style={{ width: cardW, height: topImageH }} resizeMode="contain" />
            <View style={[styles.card, { width: cardW, padding: IS_BIG ? 18 : 16 }]}>
              <Text style={[styles.cardTitle, { fontSize: IS_BIG ? 18 : IS_TINY ? 15 : 16 }]}>Good Try</Text>
              <Text style={[styles.cardSub, { fontSize: IS_BIG ? 14 : IS_TINY ? 12 : 13, lineHeight: IS_BIG ? 20 : 18 }]}>
                This round was tough, but you made progress.{"\n"}BookCoins Received: {score}
              </Text>
            </View>
            <View style={styles.btnRow}>
              <Pressable style={[styles.btnSmall, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={restart}>
                <Text style={styles.btnSmallText}>Restart</Text>
              </Pressable>
              <Pressable style={[styles.btnSmall, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={goMenu}>
                <Text style={styles.btnSmallText}>Menu</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {phase === 'win' && (
          <Animated.View style={[styles.screen, contentAnim]}>
            <Image source={IMG_WIN} style={{ width: cardW, height: topImageH }} resizeMode="contain" />
            <View style={[styles.card, { width: cardW, padding: IS_BIG ? 18 : 16 }]}>
              <Text style={[styles.cardTitle, { fontSize: IS_BIG ? 18 : IS_TINY ? 15 : 16 }]}>You Win!</Text>
              <Text style={[styles.cardSub, { fontSize: IS_BIG ? 14 : IS_TINY ? 12 : 13, lineHeight: IS_BIG ? 20 : 18 }]}>
                Brilliant answers and sharp thinking!{"\n"}BookCoins Received: {score * 3}
              </Text>
            </View>
            <View style={styles.btnRow}>
              <Pressable style={[styles.btnSmall, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={restart}>
                <Text style={styles.btnSmallText}>Restart</Text>
              </Pressable>
              <Pressable style={[styles.btnSmall, { width: BTN_W, paddingVertical: BTN_PY }]} onPress={goMenu}>
                <Text style={styles.btnSmallText}>Menu</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>

      <Modal visible={showExit} transparent animationType="fade" onRequestClose={() => setShowExit(false)}>
        <View style={styles.modalWrap}>
          <View style={[styles.modalCard, { width: Math.min(W * 0.90, 360) }]}>
            <Text style={styles.modalTitle}>Exit This Round?</Text>
            <Text style={styles.modalText}>
              You&apos;ll lose this round&apos;s progress if you leave now. Do you want to continue or exit to menu?
            </Text>

            <View style={styles.modalRow}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#8B2B2B' }]}
                onPress={() => {
                  setShowExit(false);
                  goMenu();
                }}
              >
                <Text style={styles.modalBtnText}>Confirm</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, { backgroundColor: '#1F6B2F' }]} onPress={() => setShowExit(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  hudLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hudRight: { flexDirection: 'row', alignItems: 'center' },
  hudHeart: { color: '#437cadff', fontSize: 16, fontWeight: '900' },
  hudText: { color: 'rgba(255,255,255,0.92)', fontWeight: '900' },

  contentWrap: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
  screen: { alignItems: 'center' },

  card: {
    marginTop: IS_TINY ? 10 : 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.75)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  cardSub: { color: 'rgba(255,255,255,0.78)', textAlign: 'center' },

  btnRow: { marginTop: IS_TINY ? 10 : 12, gap: 10, alignItems: 'center' },
  btnSmall: { borderRadius: 10, backgroundColor: '#437cadff', alignItems: 'center' },
  btnSmallText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  qCard: {
    marginTop: IS_TINY ? 8 : 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.75)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  qTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },

  dotsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.18)' },
  dotDone: { backgroundColor: 'rgba(150,200,255,0.55)' },
  dotActive: { backgroundColor: '#437cadff' },

  tfRow: {
    marginTop: IS_TINY ? 10 : 12,
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  tfBtn: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tfBtnActive: { borderColor: 'rgba(120,170,255,0.95)', backgroundColor: 'rgba(30,60,140,0.35)' },
  tfBtnCorrect: { borderColor: 'rgba(90,220,140,0.95)', backgroundColor: 'rgba(30,120,60,0.35)' },
  tfBtnWrong: { borderColor: 'rgba(255,90,90,0.95)', backgroundColor: 'rgba(140,30,30,0.35)' },
  tfText: { color: '#fff', fontWeight: '800', textAlign: 'center' },

  badge: {
    position: 'absolute',
    right: 18,
    top: IS_TINY ? 330 : 360,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  badgeOk: { backgroundColor: '#1F9D4B', borderColor: '#8CFFB4' },
  badgeNo: { backgroundColor: '#B3262A', borderColor: '#FF9A9A' },
  badgeText: { color: '#fff', fontWeight: '900', fontSize: 18, marginTop: -1 },

  bottomBtns: { marginTop: IS_TINY ? 10 : 12, alignItems: 'center', gap: 10 },

  btnConfirm: { borderRadius: 10, backgroundColor: '#437cadff', alignItems: 'center' },
  btnConfirmText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  btnMenu: {
    borderRadius: 10,
    backgroundColor: '#437cadff',
    alignItems: 'center',
    opacity: Platform.OS === 'android' ? 0.96 : 1,
  },
  btnMenuText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.75)',
    backgroundColor: 'rgba(10,12,30,0.94)',
    padding: 16,
  },
  modalTitle: { color: '#fff', fontWeight: '900', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  modalText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', lineHeight: 16 },

  modalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: '900', fontSize: 12 },
});
