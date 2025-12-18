import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_COINS = '@bookcoins_total_v1';
const KEY_OWNED = '@bookcoins_owned_novels_v1';

type BuyResult =
  | { ok: true }
  | { ok: false; reason: 'not_enough' | 'already_owned' | 'unknown' };

async function readInt(key: string, fallback = 0) {
  const raw = await AsyncStorage.getItem(key);
  const n = raw ? Number(raw) : fallback;
  return Number.isFinite(n) ? n : fallback;
}

async function writeInt(key: string, value: number) {
  await AsyncStorage.setItem(key, String(Math.max(0, Math.floor(value))));
}

async function readOwned(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEY_OWNED);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((x) => typeof x === 'number');
    return [];
  } catch {
    return [];
  }
}

async function writeOwned(ids: number[]) {
  const uniq = Array.from(new Set(ids)).sort((a, b) => a - b);
  await AsyncStorage.setItem(KEY_OWNED, JSON.stringify(uniq));
}


export async function getCoins(): Promise<number> {
  return readInt(KEY_COINS, 0);
}

export async function setCoins(value: number): Promise<void> {
  await writeInt(KEY_COINS, value);
}

export async function addCoins(delta: number): Promise<number> {
  const cur = await getCoins();
  const next = Math.max(0, cur + Math.floor(delta));
  await setCoins(next);
  return next;
}

export async function getOwnedNovelIds(): Promise<number[]> {
  return readOwned();
}

export async function isNovelOwned(id: number): Promise<boolean> {
  const owned = await getOwnedNovelIds();
  return owned.includes(id);
}

export async function buyNovel(id: number, price: number): Promise<BuyResult> {
  try {
    const [coins, owned] = await Promise.all([getCoins(), getOwnedNovelIds()]);

    if (owned.includes(id)) return { ok: false, reason: 'already_owned' };
    if (coins < price) return { ok: false, reason: 'not_enough' };

    await Promise.all([setCoins(coins - price), writeOwned([...owned, id])]);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'unknown' };
  }
}
