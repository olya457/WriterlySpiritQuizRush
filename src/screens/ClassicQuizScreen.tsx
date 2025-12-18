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

type Props = NativeStackScreenProps<RootStackParamList, 'ClassicQuiz'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_TINY = H < 680;
const IS_SMALL = H < 750;
const IS_BIG = H >= 860;

const BG = require('../assets/background.png');
const IMG_INTRO = require('../assets/classic_girl.png');
const IMG_QUESTION = require('../assets/classic_question.png');
const IMG_WIN = require('../assets/classic_win.png');
const IMG_LOSE = require('../assets/classic_lose.png');

type Q = {
  id: number;
  q: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
};

const ALL_QUESTIONS: Q[] = [
  { id: 1, q: 'Who wrote “Pride and Prejudice”?', options: ['Charlotte Brontë', 'Jane Austen', 'Mary Shelley'], correctIndex: 1 },
  { id: 2, q: 'In which novel does the character Jay Gatsby appear?', options: ['The Sun Also Rises', 'The Great Gatsby', 'Of Mice and Men'], correctIndex: 1 },
  { id: 3, q: 'Who is the author of “Crime and Punishment”?', options: ['Leo Tolstoy', 'Fyodor Dostoevsky', 'Anton Chekhov'], correctIndex: 1 },
  { id: 4, q: '“1984” was written by which author?', options: ['Aldous Huxley', 'Ray Bradbury', 'George Orwell'], correctIndex: 2 },
  { id: 5, q: 'Which novel begins with the line “Call me Ishmael”?', options: ['Robinson Crusoe', 'Moby-Dick', 'Treasure Island'], correctIndex: 1 },
  { id: 6, q: 'Who wrote “The Picture of Dorian Gray”?', options: ['Charles Dickens', 'Oscar Wilde', 'Thomas Hardy'], correctIndex: 1 },
  { id: 7, q: 'In “Romeo and Juliet”, the two families are the Montagues and the…', options: ['Medicis', 'Capulets', 'Borgias'], correctIndex: 1 },
  { id: 8, q: 'Which author created the detective Sherlock Holmes?', options: ['Agatha Christie', 'Arthur Conan Doyle', 'Edgar Allan Poe'], correctIndex: 1 },
  { id: 9, q: '“Brave New World” explores a dystopian future written by…', options: ['George Orwell', 'Aldous Huxley', 'H.G. Wells'], correctIndex: 1 },
  { id: 10, q: 'Who wrote “Anna Karenina”?', options: ['Leo Tolstoy', 'Ivan Turgenev', 'Nikolai Gogol'], correctIndex: 0 },
  { id: 11, q: 'Which novel features the character Atticus Finch?', options: ['The Catcher in the Rye', 'To Kill a Mockingbird', 'East of Eden'], correctIndex: 1 },
  { id: 12, q: '“The Old Man and the Sea” was written by…', options: ['John Steinbeck', 'Ernest Hemingway', 'William Faulkner'], correctIndex: 1 },
  { id: 13, q: 'In which novel does Winston Smith appear?', options: ['Fahrenheit 451', 'Brave New World', '1984'], correctIndex: 2 },
  { id: 14, q: 'Who is the author of “Jane Eyre”?', options: ['Emily Brontë', 'Charlotte Brontë', 'Anne Brontë'], correctIndex: 1 },
  { id: 15, q: '“The Catcher in the Rye” was written by…', options: ['J.D. Salinger', 'Jack Kerouac', 'Kurt Vonnegut'], correctIndex: 0 },
  { id: 16, q: 'Which novel tells the story of Victor Frankenstein?', options: ['Dracula', 'Frankenstein', 'Dr. Jekyll and Mr. Hyde'], correctIndex: 1 },
  { id: 17, q: 'Who wrote “The Trial”?', options: ['Thomas Mann', 'Franz Kafka', 'Hermann Hesse'], correctIndex: 1 },
  { id: 18, q: 'In “The Lord of the Rings”, who is the author?', options: ['C.S. Lewis', 'J.R.R. Tolkien', 'George R.R. Martin'], correctIndex: 1 },
  { id: 19, q: 'Which novel is set largely on the Yorkshire moors?', options: ['Jane Eyre', 'Wuthering Heights', 'Great Expectations'], correctIndex: 1 },
  { id: 20, q: 'Who wrote “Fahrenheit 451”?', options: ['Ray Bradbury', 'Isaac Asimov', 'Philip K. Dick'], correctIndex: 0 },
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

function buildPack(all: Q[], count: number): Q[] {
  if (all.length >= count) return shuffle(all).slice(0, count);

  const out: Q[] = [];
  let safety = 0;
  while (out.length < count && safety < 500) {
    out.push(all[safety % all.length]);
    safety++;
  }
  return shuffle(out).slice(0, count);
}

type Phase = 'intro' | 'question' | 'feedback' | 'win' | 'lose';

export default function ClassicQuizScreen({ navigation }: Props) {
  const QUIZ_COUNT = 10; 

  const [pack, setPack] = useState<Q[]>(() => buildPack(ALL_QUESTIONS, QUIZ_COUNT));
  const [phase, setPhase] = useState<Phase>('intro');

  const [answered, setAnswered] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [lastOk, setLastOk] = useState<boolean | null>(null);
  const [showExit, setShowExit] = useState(false);
  const rewardedRef = useRef(false);

  const q = pack[answered];
  const totalDots = QUIZ_COUNT;

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

  const goMenu = () => navigation.replace('Menu');

  const startQuiz = () => {
    rewardedRef.current = false; 
    setPack(buildPack(ALL_QUESTIONS, QUIZ_COUNT));
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
    const ok = selected === q.correctIndex;
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

  const contentAnim = useMemo(
    () => ({ opacity: fade, transform: [{ translateY }, { scale }] }),
    [fade, translateY, scale]
  );

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
                Classic Quiz Challenge
              </Text>
              <Text style={[styles.cardSub, { fontSize: IS_BIG ? 14 : IS_TINY ? 12 : 13, lineHeight: IS_BIG ? 20 : 18 }]}>
                Put your knowledge of timeless literature to the test. Think carefully, choose wisely, and see how far your
                literary instincts can take you.
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
              <Text style={[styles.qTitle, { fontSize: IS_BIG ? 14 : IS_TINY ? 12 : 13 }]}>{q.q}</Text>
            </View>

            <View style={[styles.dotsRow, { width: cardW }]}>
              {Array.from({ length: totalDots }).map((_, i) => {
                const active = i === answered;
                const done = i < answered;
                return <View key={`dot-${i}`} style={[styles.dot, done && styles.dotDone, active && styles.dotActive]} />;
              })}
            </View>

            <View style={[styles.opts, { width: cardW }]}>
              {q.options.map((opt, i) => {
                const locked = phase === 'feedback';
                const correct = phase === 'feedback' && i === q.correctIndex;
                const wrongPick = phase === 'feedback' && selected === i && i !== q.correctIndex;
                const active = selected === i && phase === 'question';

                return (
                  <Pressable
                    key={`${q.id}-${i}`}
                    disabled={locked}
                    onPress={() => setSelected(i)}
                    style={[
                      styles.opt,
                      { height: IS_BIG ? 50 : IS_TINY ? 42 : 44 },
                      active && styles.optActive,
                      correct && styles.optCorrect,
                      wrongPick && styles.optWrong,
                    ]}
                  >
                    <Text style={[styles.optText, { fontSize: IS_BIG ? 13 : IS_TINY ? 11 : 12 }]}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>

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
  hudHeart: { color: '#E56BFF', fontSize: 16, fontWeight: '900' },
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
  btnSmall: { borderRadius: 10, backgroundColor: '#7A42FF', alignItems: 'center' },
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
  dotActive: { backgroundColor: '#7A42FF' },

  opts: { marginTop: IS_TINY ? 10 : 12, gap: IS_TINY ? 8 : 10 },
  opt: {
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  optActive: { borderColor: 'rgba(120,170,255,0.95)', backgroundColor: 'rgba(30,60,140,0.35)' },
  optCorrect: { borderColor: 'rgba(90,220,140,0.95)', backgroundColor: 'rgba(30,120,60,0.35)' },
  optWrong: { borderColor: 'rgba(255,90,90,0.95)', backgroundColor: 'rgba(140,30,30,0.35)' },
  optText: { color: '#fff', fontWeight: '800', textAlign: 'center' },

  bottomBtns: { marginTop: IS_TINY ? 10 : 12, alignItems: 'center', gap: 10 },

  btnConfirm: { borderRadius: 10, backgroundColor: '#7A42FF', alignItems: 'center' },
  btnConfirmText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  btnMenu: {
    borderRadius: 10,
    backgroundColor: '#5A3DB7',
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
