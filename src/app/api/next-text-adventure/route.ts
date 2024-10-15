import { generateStrictLlm, model } from "@/consts/langchain";
import { DialogueSchema } from "@/types/dialogue-schema";
import { CharacterData } from "@/types/character-data";
import { MoodData } from "@/types/mood-data";
import { SceneData } from "@/types/scene-data";
import { generateSystemPrompt, summaryPrompt } from "@/util/prompts";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

const summarizeLength = 10;

export async function POST(req: Request) {
  const { messageHistory, allCharacterData, allMoodData, allSceneData, userInput }: { allCharacterData: CharacterData[], allMoodData: MoodData[], allSceneData: SceneData[], messageHistory: BaseMessage[], userInput: string } = await req.json();
  console.log({ messageHistory, allCharacterData, allMoodData, allSceneData });
  if (!messageHistory || !allCharacterData || !allMoodData || !allSceneData) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const structuredLlm = generateStrictLlm({ allCharacterData, allMoodData, allSceneData });
  const systemPrompt = generateSystemPrompt({ allCharacterData, allMoodData, allSceneData });
  const systemMessage = { role: "system", content: systemPrompt };
  try {
    if (messageHistory.length >= summarizeLength) {
      const lastHumanMessage = messageHistory[messageHistory.length - 1] as HumanMessage;
      console.log({ lastHumanMessage });
      const humanMessage = new HumanMessage(userInput);

      const summaryMessage = await model.invoke([...messageHistory, new HumanMessage(summaryPrompt)]);
      const { dialogues } = await structuredLlm.invoke([systemMessage, summaryMessage, humanMessage]);
      // const dialogues = structuredResponse.map(s => dialogueSchemaToMessage(s, { allCharacterData, allSceneData, allMoodData }).content);
      return NextResponse.json({ type: "summarized", dialogues, summarizedMessage: summaryMessage.content });
    } else {
      const { dialogues } = await structuredLlm.invoke([systemMessage, ...messageHistory]);
      // const dialogues = structuredResponse.map(s => dialogueSchemaToMessage(s, { allCharacterData, allSceneData, allMoodData }).content);
      return NextResponse.json({ type: "unsummarized", dialogues });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
