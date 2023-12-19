import * as z from "zod";

export const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  age: z
    .number()
    .min(18, {
      message: "age must be more than 18",
    })
    .max(65, {
      message: "age must be less than 65",
    })
    .nullable(),
  month: z
    .string()
    .nonempty({
      message: "Month selection is required",
    })
    .refine(
      (value) => {
        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
        });
        const nextMonth = new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toLocaleString("default", { month: "long" });
        return value === currentMonth || value === nextMonth;
      },
      {
        message: "Invalid month selection",
      }
    ),
  slot: z
    .string()
    .nonempty({
      message: "Batch selection is required",
    })
    .refine(
      (value) => {
        const validBatches = ["6-7AM", "7-8AM", "8-9AM", "5-6PM"];
        return validBatches.includes(value);
      },
      {
        message: "Invalid batch selection",
      }
    ),
});
