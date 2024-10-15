import { CharacterData } from "@/types/character-data";
import { MoodData } from "@/types/mood-data";
import { SceneData } from "@/types/scene-data";
import { zDialogueSchemaArrayStrict } from "@/zod-schemas/dialogue-schema";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import { z } from "zod";

const maxRetries = 10;

const openaiModel = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  maxRetries
});
const groqModel = new ChatGroq({
  model: process.env.GROQ_MODEL,
  maxRetries
});
const mistralaiModel = new ChatMistralAI({
  model: process.env.MISTRALAI_MODEL,
  maxRetries
});

export const model = openaiModel;
export const generateStrictLlm = ({ allCharacterData, allMoodData, allSceneData }: { allCharacterData: CharacterData[], allSceneData: SceneData[], allMoodData: MoodData[] }) => model.withStructuredOutput(z.object({
  dialogues: zDialogueSchemaArrayStrict({
    moods: allMoodData.map(m => m.id),
    scenes: allSceneData.map(s => s.id),
    characters: allCharacterData.map(c => c.id),
  })
}), { name: "dialogue" });
