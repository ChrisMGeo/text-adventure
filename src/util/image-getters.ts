import { SceneData } from "@/types/scene-data";
import { CharacterData } from "@/types/character-data";

export const getSceneImage = (allSceneData: SceneData[], sceneId: string, moodId?: string): string | undefined => {
  const scene = allSceneData.find((scene) => scene.id === sceneId);
  if (!scene) return undefined;
  if (moodId && scene.images?.moods?.[moodId]) {
    return scene.images.moods[moodId].url;
  }
  return scene.images?.default.url;
}

export const getCharacterImage = (allCharacterData: CharacterData[], characterId: string, moodId?: string): { url: string, direction: "left" | "right" } | undefined => {
  const character = allCharacterData.find((character) => character.id === characterId);
  if (!character) return undefined;
  if (moodId && character.images?.moods?.[moodId]) {
    return { url: character.images.moods[moodId].url, direction: character.images.moods[moodId].facingDirection };
  }
  if (character.images?.default) {
    return { url: character.images.default.url, direction: character.images.default.facingDirection };
  }
  return undefined;
}
