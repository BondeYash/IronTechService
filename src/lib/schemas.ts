import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("A valid email, please"),
  company: z.string().optional(),
  phone: z.string().optional(),
  scope: z.enum(["structural", "miscellaneous", "both", "other"]).optional(),
  tonnage: z.string().optional(),
  message: z.string().min(10, "A sentence or two about the project"),
  // honeypot: real people leave this empty
  website: z.string().max(0).optional(),
});

export const careerSchema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("A valid email, please"),
  phone: z.string().optional(),
  role: z.enum(["detailer", "checker", "modeller", "trainee", "other"]),
  experience: z.string().min(1, "Years of experience"),
  software: z.string().optional(),
  portfolio: z.string().url("Use a full URL").or(z.literal("")).optional(),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type CareerInput = z.infer<typeof careerSchema>;
