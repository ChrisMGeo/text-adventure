import { generateStrictLlm, model } from "@/consts/langchain";
import { CharacterData } from "@/types/character-data";
import { DialogueSchema } from "@/types/dialogue-schema";
import { MoodData } from "@/types/mood-data";
import { SceneData } from "@/types/scene-data";
import { generateSystemPrompt, summaryPrompt } from "@/util/prompts";
import { randomChoice } from "@/util/random-choice";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

const summarizeLength = 10;

export async function POST(req: Request) {
  const { messageHistory, allCharacterData, allMoodData, allSceneData, userInput }: { allCharacterData: CharacterData[], allMoodData: MoodData[], allSceneData: SceneData[], messageHistory: BaseMessage[], userInput: string } = await req.json();
  // console.log({ messageHistory, allCharacterData, allMoodData, allSceneData });
  if (!messageHistory || !allCharacterData || !allMoodData || !allSceneData) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (process.env.NODE_ENV === "development") {
    const dialogues: DialogueSchema[] = [
      {
        mood: randomChoice(allMoodData).id,
        scene: randomChoice(allSceneData).id,
        speaker: {
          type: "single",
          character: randomChoice(allCharacterData).id,
          mood: randomChoice(allMoodData).id
        },
        content: "Random Gibberish"
      },
      {
        mood: randomChoice(allMoodData).id,
        scene: randomChoice(allSceneData).id,
        speaker: {
          type: "multiple",
          value: [
            {
              character: randomChoice(allCharacterData).id,
              mood: randomChoice(allMoodData).id
            },
            {
              character: randomChoice(allCharacterData).id,
              mood: randomChoice(allMoodData).id
            },
            {
              character: randomChoice(allCharacterData).id,
              mood: randomChoice(allMoodData).id
            },
            {
              character: randomChoice(allCharacterData).id,
              mood: randomChoice(allMoodData).id
            },
            {
              character: randomChoice(allCharacterData).id,
              mood: randomChoice(allMoodData).id
            },
            {
              character: randomChoice(allCharacterData).id,
              mood: randomChoice(allMoodData).id
            }
          ],
        },
        content: "Random Gibberish 2"
      },
    ];
    console.log("In development");
    return NextResponse.json({
      type: "unsummarized", dialogues
    });
  }
  const structuredLlm = generateStrictLlm({ allCharacterData, allMoodData, allSceneData });
  const systemPrompt = generateSystemPrompt({ allCharacterData, allMoodData, allSceneData });
  const systemMessage = { role: "system", content: systemPrompt };
  try {
    if (messageHistory.length >= summarizeLength) {
      // const lastHumanMessage = messageHistory[messageHistory.length - 1] as HumanMessage;
      // console.log({ lastHumanMessage });
      const humanMessage = new HumanMessage(userInput);

      const summaryMessage = await model.invoke([...messageHistory, new HumanMessage(summaryPrompt)]);
      const { dialogues, toAdd } = await structuredLlm.invoke([systemMessage, summaryMessage, humanMessage]);
      return NextResponse.json({ dialogues, summarizedMessage: summaryMessage, toAdd });
    } else {
      const { dialogues, toAdd } = await structuredLlm.invoke([systemMessage, ...messageHistory]);
      return NextResponse.json({ dialogues, toAdd });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
