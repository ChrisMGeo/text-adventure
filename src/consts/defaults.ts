import { type CharacterData } from "@/types/character-data";
import { MoodData } from "@/types/mood-data";
import { SceneData } from "@/types/scene-data";
export const defaultCharacters: CharacterData[] = [
  {
    id: "narrator",
    name: "Narrator",
    description: "The omniscient voice that guides you through the story."
  },
  {
    id: "lysandra",
    name: "Lysandra",
    description: "A fierce warrior from the northern plains, skilled in archery."
  },
  {
    id: "thorn",
    name: "Thorn",
    description: "A secretive rogue with a penchant for picking locks and telling tales."
  },
  {
    id: "seraphina",
    name: "Seraphina",
    description: "An enigmatic sorceress with powers over fire and ice."
  },
  {
    id: "galen",
    name: "Galen",
    description: "A noble knight sworn to protect the realm, bearer of the sacred sword."
  },
  {
    id: "elara",
    name: "Elara",
    description: "A wise healer blessed with the ability to mend wounds and cure ailments."
  },
  {
    id: "kael",
    name: "Kael",
    description: "A skilled alchemist searching for the recipe to eternal life."
  },
  {
    id: "isolde",
    name: "Isolde",
    description: "A bard with a magical voice that can enchant even the hardest hearts."
  },
  {
    id: "roran",
    name: "Roran",
    description: "A lumbering giant with a gentle soul, protector of the ancient forest."
  },
  {
    id: "fiona",
    name: "Fiona",
    description: "A spirited pirate captain known for her daring raids and sharp wit."
  },
  {
    id: "varian",
    name: "Varian",
    description: "A cunning rogue with a knack for getting into and out of trouble."
  }
];

export const defaultMoods: MoodData[] = [
  {
    id: "happy",
    name: "Happy",
    description: "Feeling good and cheerful."
  },
  {
    id: "sad",
    name: "Sad",
    description: "Feeling down or unhappy."
  },
  {
    id: "angry",
    name: "Angry",
    description: "Feeling mad or upset."
  },
  {
    id: "scared",
    name: "Scared",
    description: "Feeling afraid or worried."
  },
  {
    id: "surprised",
    name: "Surprised",
    description: "Feeling shocked or amazed by something unexpected."
  },
  {
    id: "disgusted",
    name: "Disgusted",
    description: "Feeling grossed out or repelled by something."
  },
  {
    id: "calm",
    name: "Calm",
    description: "Feeling peaceful and relaxed."
  }
]
export const defaultScenes: SceneData[] = [
  {
    id: "foggy-forest",
    name: "Foggy Forest",
    description: "A dense forest shrouded in fog, with tall trees and the sound of rustling leaves all around."
  },
  {
    id: "sunset-beach",
    name: "Sunset Beach",
    description: "A calm beach with waves gently crashing as the sun sets, painting the sky in hues of orange and pink."
  },
  {
    id: "city-night",
    name: "City at Night",
    description: "A bustling cityscape lit by neon lights and glowing windows under a starless sky."
  },
  {
    id: "snowy-mountain",
    name: "Snowy Mountain",
    description: "A towering mountain covered in fresh snow, with a crisp breeze and clear blue skies."
  },
  {
    id: "desert-dunes",
    name: "Desert Dunes",
    description: "An endless stretch of golden sand dunes under the blazing sun, with the wind gently shifting the sand."
  },
  {
    id: "rainy-street",
    name: "Rainy Street",
    description: "A quiet street glistening with rain, as droplets hit the pavement and the distant sound of thunder rolls."
  },
  {
    id: "meadow-bloom",
    name: "Meadow in Bloom",
    description: "A wide meadow filled with colorful wildflowers swaying in the breeze under a clear, sunny sky."
  }
]
