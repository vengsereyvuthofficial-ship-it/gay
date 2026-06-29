import { ScanResult } from "../types";

export const PRESET_RESULTS: ScanResult[] = [
  {
    title: "100% FABULOUS & FIERCE",
    category: "gay",
    percentageGay: 100,
    percentageStraight: 0,
    verdict: "The quantum scan detected critical levels of sass and flawless taste. Your walking speed exceeds standard pedestrian limits by 150%, and iced coffee flows directly through your bloodstream.",
    stereotypes: [
      "Inability to sit straight on any standard chair or sofa",
      "Walking speed rivals an Olympic power-walking champion",
      "Peace signs or duck-faces are involuntary responses to any camera lens",
      "Unlocking your phone is accompanied by a subtle dramatic hair flip"
    ],
    patronMeme: "An Iced Oat Milk Latte and a Pair of Pristine Platform Boots",
    advice: "Maintain a strict strut limit of three per block to prevent tearing a rift in the fashion space-time continuum.",
    badgeColor: "bg-pink-500 text-white border-2 border-black",
    glowColor: "border-4 border-black bg-pink-500 text-white shadow-[6px_6px_0px_rgba(0,0,0,1)]"
  },
  {
    title: "100% STEADFAST STRAIGHT",
    category: "straight",
    percentageGay: 0,
    percentageStraight: 100,
    verdict: "You are as steady and unyielding as a well-crafted oak dining table. The scanner detected extreme interests in lawn maintenance, backyard barbecue logistics, and grey hoodies.",
    stereotypes: [
      "Possesses the rare anatomical ability to sit perfectly centered in a chair",
      "Enjoys spending more than 25 minutes reviewing lawnmower specs",
      "Owns a t-shirt older than some high school graduates",
      "Vastly relies on all-in-one 'Body-Hair-Face-Car-Dog' soap bottles"
    ],
    patronMeme: "A Stanley Tape Measure and a Seasoned Cast Iron Skillet",
    advice: "Wear a horizontal stripe shirt once in a while to break up your strictly straight geometric alignment.",
    badgeColor: "bg-cyan-400 text-black border-2 border-black",
    glowColor: "border-4 border-black bg-cyan-400 text-black shadow-[6px_6px_0px_rgba(0,0,0,1)]"
  },
  {
    title: "BI-FURIOUS CHAMELEON",
    category: "bi",
    percentageGay: 50,
    percentageStraight: 50,
    verdict: "The scanning laser fluctuated wildly and snapped. You possess maximum decision paralysis. You love everything and everyone but can spend up to 4 hours choosing where to eat dinner.",
    stereotypes: [
      "Legally obligated to cuff every single pair of pants you purchase",
      "Throws double finger-guns to exit any slightly awkward conversation",
      "Vibe shifts from flannel woodshop to neon rave within the same afternoon",
      "Your Spotify playlist experiences an identity crisis every 3 minutes"
    ],
    patronMeme: "A Cuffed Denim Jacket and an Undecided Restaurant Menu",
    advice: "Take a deep breath. You do not have to choose. Finger-guns are legally binding exit strategies.",
    badgeColor: "bg-purple-400 text-black border-2 border-black",
    glowColor: "border-4 border-black bg-purple-400 text-black shadow-[6px_6px_0px_rgba(0,0,0,1)]"
  },
  {
    title: "90% STRAIGHT & 10% SPICY",
    category: "straight",
    percentageGay: 10,
    percentageStraight: 90,
    verdict: "Standard straight profile, but with a highly delightful sparkle. You look completely traditional, yet you harbor an absolute mastery of dramatic showtunes or high-end interior styling.",
    stereotypes: [
      "Keeps a high-end designer hair pomade hidden behind a bottle of Head & Shoulders",
      "Knows every word of Lady Gaga's 'Bad Romance' but sings it in a gruff voice",
      "Uses a coaster but only when your mother or guests are visiting",
      "Enjoys a colorful fruity cocktail but orders a draft beer first to establish a baseline"
    ],
    patronMeme: "A pristine white sneaker with one single bright neon shoelace",
    advice: "Let that 10% spicy side loose! Order the passionfruit margarita with full confidence next time.",
    badgeColor: "bg-orange-400 text-black border-2 border-black",
    glowColor: "border-4 border-black bg-orange-400 text-black shadow-[6px_6px_0px_rgba(0,0,0,1)]"
  },
  {
    title: "80% FABULOUS & 20% DAD VIBES",
    category: "gay",
    percentageGay: 80,
    percentageStraight: 20,
    verdict: "You are the ultimate combination of high drama and absolute logistical utility. You are the friend who coordinates the brunch schedule with color-coded spreadsheets.",
    stereotypes: [
      "Coordinates group holidays with the precision of a seasoned military general",
      "Uses the phrases 'slay' and 'projected margins' in the exact same sentence",
      "Knows precisely which local supermarket has the most flattering lighting",
      "Wears designer shades but clips them to a utility key ring"
    ],
    patronMeme: "A Designer Handbag containing a perfectly sharpened Swiss Army Knife",
    advice: "Keep commanding those brunches. Your friends would starve or look poorly dressed without you.",
    badgeColor: "bg-yellow-400 text-black border-2 border-black",
    glowColor: "border-4 border-black bg-yellow-400 text-black shadow-[6px_6px_0px_rgba(0,0,0,1)]"
  },
  {
    title: "ERROR 404: TOO FASHIONABLE",
    category: "error",
    percentageGay: 69,
    percentageStraight: 31,
    verdict: "The orientation matrix suffered an overload. The scanner detected extremely high levels of aesthetic excellence, caffeine dependence, and cat memes. You transcend standard labels.",
    stereotypes: [
      "Currently has 48 tabs of cute animals and architectural mood boards open",
      "Apologizes to chairs and tables when accidentally bumping into them",
      "Giggle frequency matches a high-frequency dolphin radar system",
      "Drinks bubble tea at a rate that is concerning to financial advisers"
    ],
    patronMeme: "A very tiny kitten wearing a knitted frog hat",
    advice: "Do not stop apologizing to the objects you bump into. They were clearly in the wrong.",
    badgeColor: "bg-emerald-400 text-black border-2 border-black",
    glowColor: "border-4 border-black bg-emerald-400 text-black shadow-[6px_6px_0px_rgba(0,0,0,1)]"
  }
];

/**
 * A simple deterministic string hash function to map a name
 * to a specific preset result. This makes name scanning consistent!
 */
export function getDeterministicResult(name: string): ScanResult {
  if (!name || name.trim() === "") {
    // Return a random preset
    const idx = Math.floor(Math.random() * PRESET_RESULTS.length);
    return PRESET_RESULTS[idx];
  }

  const cleanName = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % PRESET_RESULTS.length;
  return PRESET_RESULTS[index];
}
