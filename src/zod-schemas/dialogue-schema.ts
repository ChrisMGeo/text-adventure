import { z } from "zod";
import { zStringChooser } from "./chooser";

export const zDialogueSchemaStrict = ({ characters, moods, scenes }: { moods: string[], scenes: string[], characters: string[] }) => z.object({
  mood: zStringChooser(moods).describe("Overall mood when the dialogue is happening"),
  scene: zStringChooser(scenes).describe("Scene where the dialogue is happening"),
  speaker: z.discriminatedUnion("type", [zSingleSpeakerStrict(characters, moods), zMultipleSpeakerStrict(characters, moods)]).describe("Speaker(s) of the dialogue"),
  content: z.string().describe("Content of the dialogue"),
});

export const zSingleSpeakerStrict = (characters: string[], moods: string[]) => z.object({
  type: z.literal("single"),
  character: zStringChooser(characters),
  mood: zStringChooser(moods)
});

export const zSingleSpeaker = z.object({
  type: z.literal("single"),
  character: z.string(),
  mood: z.string()
});


export const zMultipleSpeakerStrict = (characters: string[], moods: string[]) => z.object({
  type: z.literal("multiple"),
  value: z.array(z.object({
    character: zStringChooser(characters),
    mood: zStringChooser(moods)
  }))
})

export const zMultipleSpeaker = z.object({
  type: z.literal("multiple"),
  value: z.array(z.object({
    character: z.string(),
    mood: z.string()
  }))
});

export const zDialogueSchema = z.object({
  mood: z.string().describe("Overall mood when the dialogue is happening"),
  scene: z.string().describe("Scene where the dialogue is happening"),
  speaker: z.discriminatedUnion("type", [zSingleSpeaker, zMultipleSpeaker]).describe("Speaker(s) of the dialogue"),
  content: z.string().describe("Content of the dialogue")
});

export const zDialogueSchemaArray = z.array(zDialogueSchema);
export const zDialogueSchemaArrayStrict = (params: { moods: string[], scenes: string[], characters: string[] }) => z.array(zDialogueSchemaStrict(params));

export const zToAddSkeleton = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
});

export const zToAddSchema = z.object({
  characters: z.array(zToAddSkeleton).optional(),
  scenes: z.array(zToAddSkeleton).optional(),
  moods: z.array(zToAddSkeleton).optional(),
}).optional();
