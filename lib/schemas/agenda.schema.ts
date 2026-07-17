import { z } from "zod";

export const createSingleAgendaSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    roleName: z.string().optional(),
    roleId: z.string().optional(),
    duration: z
      .number()
      .min(1, "Duration must be at least 1 minute")
      .max(300, "Duration is too long"),
    sequence: z.number().min(1, "Sequence must be at least 1"),
    assignmentType: z.enum(["member", "guest", "unassigned"]),
    memberId: z.string().optional(),
    memberName: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.assignmentType === "guest" && !data.memberName) {
        return false;
      }
      return true;
    },
    {
      message: "Please enter a guest name",
      path: ["assignmentType"],
    }
  );

export const roleAssignmentSchema = z.object({
  templateItemId: z.string(),
  assignmentType: z.enum(["member", "guest", "unassigned"]),
  memberId: z.string().optional(),
  memberName: z.string().optional(),
});

export const createFromTemplateSchema = z.object({
  templateId: z.string().min(1, "Template is required"),
  roleAssignments: z.array(roleAssignmentSchema),
});

export type CreateSingleAgendaForm = z.infer<typeof createSingleAgendaSchema>;
export type CreateFromTemplateForm = z.infer<typeof createFromTemplateSchema>;
export type RoleAssignmentForm = z.infer<typeof roleAssignmentSchema>;
