import { TextAdventureMessage } from "@/hooks/use-text-adventure";
import { CharacterData } from "@/types/character-data";
import { DialogueSchema } from "@/types/dialogue-schema";

export const dialogueSchemaToMessage = (dialogue: DialogueSchema): TextAdventureMessage => {
  let content = `Scene: ${dialogue.scene}, Overall Mood: ${dialogue.mood}\n`;
  switch (dialogue.speaker.type) {
    case "single":
      {
        const characterId = dialogue.speaker.character;
        const moodId = dialogue.speaker.mood;
        content += `${characterId} (${moodId})`;
      }
      break;
    case "multiple":
      content += dialogue.speaker.value.map(({ character, mood }) => {
        return `${character} (${mood})`
      }).join(", ");
      break;
  }
  content += `: ${dialogue.content}`;
  return { role: "assistant", content };
};

export const getSpeakers = (dialogue: DialogueSchema, allCharacterData: CharacterData[]): string => {
  switch (dialogue.speaker.type) {
    case "single":
      const characterId = dialogue.speaker.character;
      return allCharacterData.find(({ id }) => id === characterId)!.name;
    case "multiple":
      const characterIds = dialogue.speaker.value.map(({ character }) => character);
      return characterIds.map(characterId => allCharacterData.find(({ id }) => id === characterId)!.name).join(", ");
  }
}
