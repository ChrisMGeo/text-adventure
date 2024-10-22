import { useCallback, useEffect, useState } from "react";
import { type CharacterData } from "@/types/character-data";
import { type MoodData } from "@/types/mood-data";
import { type SceneData } from "@/types/scene-data";
import { DialogueSchema } from "@/types/dialogue-schema";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { dialogueSchemaToMessage } from "@/util/converters";

export type TextAdventureMessage = { role: "assistant" | "user" | "system", content: string }

export type UseTextAdventureProps = {
  allCharacterData: CharacterData[];
  allMoodData: MoodData[];
  allSceneData: SceneData[];
};

export type TextAdventureLog = { type: "input", value: string } | { type: "dialogue", value: DialogueSchema };


export function useTextAdventure(
  {
    allCharacterData,
    allMoodData,
    allSceneData,
  }: UseTextAdventureProps
) {
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [log, setLog] = useState<TextAdventureLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInitialMessage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/next-text-adventure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageHistory: [],
          allCharacterData,
          allMoodData,
          allSceneData,
          userInput: "",
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error: ${response.statusText}`);
      }

      const { dialogues }: { dialogues: DialogueSchema[] } = await response.json();
      const converted: BaseMessage[] = dialogues.map(d => new AIMessage(dialogueSchemaToMessage(d).content));

      setMessages([...converted]);
      const toAddLog: TextAdventureLog[] = dialogues.map((s) => ({ type: "dialogue", value: s }));
      setLog([...toAddLog]);
    } catch (error) {
      console.error("Failed to fetch model data:", error);
    } finally {
      setLoading(false);
    }
  }, [allCharacterData, allMoodData, allSceneData]);

  const callModel = useCallback(async (messageHistory: BaseMessage[], userInput: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/next-text-adventure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageHistory,
          allCharacterData,
          allMoodData,
          allSceneData,
          userInput,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error: ${response.statusText}`);
      }

      setMessages(messageHistory);
      setLog((prevLog) => [...prevLog, { type: "input", value: userInput }]);

      const { dialogues }: { dialogues: DialogueSchema[] } = await response.json();
      const converted: BaseMessage[] = dialogues.map(d => new AIMessage(dialogueSchemaToMessage(d).content));

      setMessages((prevMessages) => [...prevMessages, ...converted]);
      const toAddLog: TextAdventureLog[] = dialogues.map((s) => ({ type: "dialogue", value: s }));
      setLog((prevLog) => [...prevLog, ...toAddLog]);
    } catch (error) {
      console.error("Failed to fetch model data:", error);
    } finally {
      setLoading(false);
    }
  }, [allCharacterData, allMoodData, allSceneData]);

  const submitMessage = async (userMessage: string) => {
    const newMessage = new HumanMessage(userMessage);
    const newMessages = [...messages, newMessage];
    await callModel(newMessages, userMessage);
  };

  useEffect(() => {
    fetchInitialMessage();
  }, [fetchInitialMessage]);

  return { messages, log, submitMessage, loading };
}
