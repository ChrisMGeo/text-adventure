import { z } from "zod";
export const zStringChooser = (strings: string[]) => z.string()
  // .refine(value => strings.includes(value), v => { message: `Value must be one of ${strings.map(s => `${s}`).join(", ")}` });
  .superRefine((val, ctx) => {
    if (!strings.includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Value is ${val}, and instead must be one of ${strings.map(s => `${s}`).join(", ")}`,
      });
    }
  })
