import { z } from "zod";

const strictUuid = z.string().uuid("Invalid identifier context");

export const getOrganizationMembersSchema = z.object({
  user: z.object({
    userId: strictUuid,
  }),
  params: z.object({
    id: strictUuid,
  }),
});
