import { zDialogueSchema } from "@/zod-schemas/dialogue-schema";
import { z } from "zod";

export type DialogueSchema = z.infer<typeof zDialogueSchema>;
export type SingleSpeakerDialogue = Extract<DialogueSchema["speaker"], { type: "single" }>;
export type MultipleSpeakerDialogue = Extract<DialogueSchema["speaker"], { type: "multiple" }>;
