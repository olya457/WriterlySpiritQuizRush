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
  Modal,
  ScrollView,
  Platform,
  Alert,
  Share,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { buyNovel, getCoins, getOwnedNovelIds } from '../store/bookcoins';

type Props = NativeStackScreenProps<RootStackParamList, 'Library'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_TINY = H < 680;

const BG = require('../assets/background.png');

type Novel = {
  id: number;
  title: string;
  image: any;
  text: string;
};

export const NOVELS: Novel[] = [
  {
    id: 1,
    title: 'The Rival of Olympus',
    image: require('../assets/novel_01_rival_of_olympus.png'),
    text: `The old gods rarely watched the world anymore, but when they did, it was never out of boredom. High above the clouds, among cracked marble columns and silent temples, a solitary figure stood. His golden armor still reflected the sky, though its shine had softened with centuries of neglect.
There was a time when rivalry among the gods defined the order of existence. Thunder answered pride, and strength was measured by who could shake the earth the hardest. Back then, belief flowed naturally — mortals feared the sky and prayed without being asked.
Now the world below glowed with its own constellations. Cities burned with light, machines replaced miracles, and faith had found quieter forms. Watching this, the god felt something unfamiliar — not anger, but doubt.
Was power still power if no one feared it? Could a god exist without worship, without stories whispered in the dark?
A storm gathered behind him, born not from command, but unrest. Clouds twisted, lightning waiting for purpose. Perhaps the rivalry was no longer against other gods, but against time itself.
With a final glance at Olympus, he stepped forward. Not to reclaim dominance — but to redefine what divinity meant.`,
  },
  {
    id: 2,
    title: 'The Ledger of Fortune',
    image: require('../assets/novel_02_ledger_of_fortune.png'),
    text: `The book was heavier than it appeared, its worn leather cover marked by countless hands. It had no title on its spine, as if it refused to be defined. Wealth, the old man believed, had never been about gold alone.
He had crossed deserts and cities chasing rumors of the book. Some said it revealed hidden treasure. Others claimed it ruined those who read it. The truth, as always, lived somewhere in between.
Opening it felt like opening memory itself. The pages revealed moments from his life — choices made in haste, risks taken for pride, opportunities ignored out of fear. The book did not judge. It simply reflected.
With each page, he felt lighter and heavier at once. Lighter from understanding, heavier from realization. Wealth had followed him, but so had consequence.
When he finally closed the book, its weight remained — not in his hands, but in his thoughts.
True fortune, he realized, was knowing the cost of what one desired.`,
  },
  {
    id: 3,
    title: "The Captain’s Last Song",
    image: require('../assets/novel_03_captains_last_song.png'),
    text: `The sea had taken many things from the captain — ships, crew, years — but never his voice. Each morning, he sang to the horizon, as if the waves still remembered him. His parrot listened in quiet loyalty.
Once, his flag ruled the open waters. His name traveled faster than the wind, carried by fear and admiration alike. Gold filled the hold, and danger followed every sail.
Now the sea felt calmer, older. The world had moved on, leaving legends behind. A folded map rested in his coat, its ink fading, its promise uncertain.
He understood then that treasure was never the destination. It was the journey — the storms survived, the choices made, the songs sung under unfamiliar stars.
As the sun dipped low, he sang one last time. Not for gold. Not for glory. But for freedom.
The tide carried the melody away, and with it, a life well lived.`,
  },
  {
    id: 4,
    title: 'The Second Fortune',
    image: require('../assets//novel_04_second_fortune.png'),
    text: `She never searched for the second book. It found her when ambition had finally grown quiet. Unlike the first, it felt lighter — almost patient, as if waiting for the right moment.
Its pages spoke not of gain, but of balance. Of knowing when to push forward and when to step back. Each chapter asked questions rather than offering answers.
As she read, she recognized herself — not just in success, but in excess. Not just in failure, but in resilience. The book revealed patterns she had never noticed before.
For the first time, wealth felt less like accumulation and more like alignment. Between effort and rest. Between desire and restraint.
Closing the book felt like setting something down. Something unnecessary.
The second fortune, she realized, was clarity — and peace.`,
  },
  {
    id: 5,
    title: "The Mustang’s Path",
    image: require('../assets/novel_05_mustangs_path.png'),
    text: `The plains stretched endlessly, offering neither shelter nor promise. Dust rose with every step, clinging to boots and memories alike. He moved forward because standing still had become heavier than the road itself.
Gold had ruined men he once trusted. He had seen friendships fracture, names forgotten, loyalties traded for a handful of shining metal. Still, rumors of opportunity followed him like distant thunder.
The land tested patience more than courage. It rewarded those who listened, who waited, who learned when not to rush. Those who chased too fiercely were swallowed without ceremony.
At night, the stars offered no guidance. Only silence and the quiet question of choice. Why continue when the end was never certain?
He realized then that the pursuit was never about gold. It was about endurance. About proving that the past did not decide the future.
And so he walked on, steady and unbroken, letting the road shape him rather than consume him.`,
  },
  {
    id: 6,
    title: 'Fire and Strings',
    image: require('../assets/novel_06_fire_and_strings.png'),
    text: `The musician played as if fire itself flowed through his fingers. Each note carried heat, movement, and a challenge to listen closely. People gathered before they understood why.
Spice and rhythm followed the same law. Too little faded into nothing. Too much overwhelmed. Mastery lived in balance, and he danced along that edge effortlessly.
Stories followed him wherever he went. Of kitchens turned battlegrounds. Of flavors that demanded courage and rewarded patience. Music, like heat, revealed character.
When he played, time slowed. The air thickened with anticipation, each chord building something unseen but undeniable.
As the final note faded, warmth remained — not burning, but alive. Lingering in memory rather than on the tongue.
Some performances entertained. Others transformed. This one did both.`,
  },
  {
    id: 7,
    title: 'The Forest That Smiled Back',
    image: require('../assets/novel_07_forest_smiled_back.png'),
    text: `The forest glowed softly, its light filtering through leaves like a held breath. Paths shifted subtly, guiding rather than obstructing. Nothing here felt accidental.
Luck, she sensed, was not random within these woods. It responded. To patience. To awareness. To respect. The forest listened more than it spoke.
She followed no map. Time loosened its grip, measured instead by footsteps and intuition. Each turn felt earned rather than chosen.
At the heart of the forest, she found no treasure chest, no sudden reward. Only clarity.
Luck, she realized, was never about surprise. It was about recognition — seeing opportunity when it appeared.
And as she turned back, the forest seemed quietly satisfied.`,
  },
  {
    id: 8,
    title: 'The Gentle Guardian',
    image: require('../assets/novel_08_gentle_guardian.png'),
    text: `The panda watched the valley without urgency. Strength rested beneath stillness, quiet and certain. He had no need to prove it.
Travelers spoke in hushed tones of strange fortune near his domain. Lost trails reappeared. Storms softened without warning. Missteps became lessons instead of endings.
The guardian never intervened loudly. His presence adjusted the balance rather than disrupted it.
In a world driven by force, he embodied restraint. In a land shaped by motion, he mastered stillness.
Luck followed him not as a gift, but as a consequence.
Peace, it seemed, had its own power.`,
  },
  {
    id: 9,
    title: 'The Northern Oath',
    image: require('../assets/novel_09_northern_oath.png'),
    text: `Battle had shaped his body, but duty shaped his spirit. The north demanded endurance, not glory. Survival came before celebration.
Honor guided every decision. Each action carried weight, not because of reward, but because it would be remembered.
As winter closed in, preparation replaced ambition. Strength alone would not endure the cold — purpose would.
He thought often of legacy. Not of how many battles were won, but of which values remained when strength faded.
Steel would dull. Blood would freeze. Stories, however, would travel.
And so he stood firm, bound not by fear, but by oath.`,
  },
  {
    id: 10,
    title: 'The Run That Mattered',
    image: require('../assets/novel_10_run_that_mattered.png'),
    text: `The donkey ran despite the laughter that followed him. Not to escape, but to prove something unseen. Mostly to himself.
Obstacles appeared quickly. Some tripped him. Some slowed him. Each fall carried embarrassment — and instruction.
He learned when to push, and when to pause. When stubbornness helped, and when it hindered. Progress became less about speed and more about persistence.
The world did not change its pace for him. He adapted instead.
When he finally stopped, breathless and smiling, the run felt complete. Not because he had won.
But because he had continued.`,
  },
];

const PRICE = 50;

export default function LibraryScreen({ navigation }: Props) {
  const [coins, setCoins] = useState(0);
  const [owned, setOwned] = useState<number[]>([]);
  const [askId, setAskId] = useState<number | null>(null);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  const load = async () => {
    const [c, o] = await Promise.all([getCoins(), getOwnedNovelIds()]);
    setCoins(c);
    setOwned(o);
  };

  useEffect(() => {
    load();
    fade.setValue(0);
    translateY.setValue(16);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  const anim = useMemo(() => ({ opacity: fade, transform: [{ translateY }] }), [fade, translateY]);
  const goBack = () => navigation.replace('Menu');

  const openNovel = (id: number) => {
    navigation.navigate('NovelDetail', { novelId: id });
  };

  const shareNovel = async (id: number) => {
    const novel = NOVELS.find((n) => n.id === id);
    if (!novel) return;
    await Share.share({ message: `${novel.title}\n\n${novel.text}` });
  };

  const onExchange = async (id: number) => {
    const res = await buyNovel(id, PRICE);
    if (!res.ok) {
      if (res.reason === 'not_enough') {
        Alert.alert('Not enough BookCoins', `You need ${PRICE} BookCoins to exchange this novel.`);
      } else if (res.reason === 'already_owned') {
        Alert.alert('Already owned', 'You already exchanged this novel.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
      return;
    }
    await load();
  };

  const cardW = Math.min(W * 0.92, 410);
  const itemH = IS_TINY ? 92 : 106;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.hud, { paddingTop: IS_TINY ? 42 : 50 }]}>
        <Pressable style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Library</Text>
        <View style={styles.coinPill}>
          <Text style={styles.coinIcon}>◉</Text>
          <Text style={styles.coinText}>x {coins}</Text>
        </View>
      </View>

      <Animated.View style={[styles.wrap, anim]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {NOVELS.map((n) => {
            const isBought = owned.includes(n.id);

            return (
              <View key={n.id} style={[styles.item, { width: cardW, height: itemH }]}>
                <View style={styles.coverWrap}>
                  <Image source={n.image} style={[styles.cover, !isBought && styles.coverLocked]} resizeMode="cover" />
                  {!isBought && <View style={styles.lockOverlay} />}
                </View>

                <View style={styles.itemRight}>
                  <Text style={styles.itemTitle}>{n.title}</Text>

                  {!isBought ? (
                    <View style={styles.row}>
                      <Pressable style={styles.exchangeBtn} onPress={() => setAskId(n.id)}>
                        <Text style={styles.exchangeText}>Exchange for {PRICE}</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View style={styles.row2}>
                      <Pressable style={styles.openBtn} onPress={() => openNovel(n.id)}>
                        <Text style={styles.openText}>Open</Text>
                      </Pressable>
                      <Pressable style={styles.shareBtn} onPress={() => shareNovel(n.id)}>
                        <Text style={styles.shareText}>Share</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>

      <Modal visible={askId !== null} transparent animationType="fade" onRequestClose={() => setAskId(null)}>
        <View style={styles.modalWrap}>
          <View style={[styles.modalCard, { width: Math.min(W * 0.9, 360) }]}>
            <Text style={styles.modalTitle}>Confirm Exchange</Text>
            <Text style={styles.modalText}>Are you sure you want to exchange your bookcoins for this novella?</Text>

            <View style={styles.modalRow}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#1F6B2F' }]}
                onPress={async () => {
                  const id = askId;
                  setAskId(null);
                  if (id) await onExchange(id);
                }}
              >
                <Text style={styles.modalBtnText}>Confirm</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, { backgroundColor: '#8B2B2B' }]} onPress={() => setAskId(null)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>
            </View>

            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={styles.smallHint}>Price: {PRICE} BookCoins</Text>
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
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backArrow: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: -2,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.70)',
  },
  coinIcon: { color: '#D9A8FF', fontWeight: '900' },
  coinText: { color: 'rgba(255,255,255,0.92)', fontWeight: '900' },

  wrap: { flex: 1, paddingTop: IS_TINY ? 100 : 115 },
  title: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },

  item: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.75)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 10,
  },
  coverWrap: { width: IS_TINY ? 76 : 84, height: '100%', padding: 8 },
  cover: { width: '100%', height: '100%', borderRadius: 10 },
  coverLocked: { opacity: 0.30 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 10,
    margin: 8,
  },

  itemRight: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 4,
    justifyContent: 'space-between',
  },
  itemTitle: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 6,
  },

  row: { alignItems: 'center', marginTop: 6 },
  exchangeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#437cadff',
    minWidth: 150,
    alignItems: 'center',
  },
  exchangeText: { color: '#fff', fontWeight: '900', fontSize: 11 },

  row2: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 8 },
  openBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#2464b8ff', alignItems: 'center' },
  openText: { color: '#fff', fontWeight: '900', fontSize: 11 },
  shareBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#2464b8ff',
    alignItems: 'center',
    opacity: Platform.OS === 'android' ? 0.96 : 1,
  },
  shareText: { color: '#fff', fontWeight: '900', fontSize: 11 },

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
  smallHint: { color: 'rgba(255,255,255,0.55)', fontWeight: '800', fontSize: 11 },
});
