"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  age: z
    .number()
    .min(18, {
      message: "age should be 18+",
    })
    .max(65, {
      message: "age must be less than 65",
    }),
  batch: z
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

export function AdmissionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      age: undefined,
      batch: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/submit-user-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
  }

  return (
    <Card className="mx-auto max-w-lg p-6 space-y-6 bg-[#ffffff]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Admission Form</CardTitle>
        <CardDescription>
          Fill up the following details to apply
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Enter your age.."
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          max={65}
                          min={18}
                        />
                      )}
                    />
                  </FormControl>
                  <FormDescription>Age should be between 18-65</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="batch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Batch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="batch-selection">
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectItem value="6-7AM">6-7AM</SelectItem>
                      <SelectItem value="7-8AM">7-8AM</SelectItem>
                      <SelectItem value="8-9AM">8-9AM</SelectItem>
                      <SelectItem value="5-6PM">5-6PM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
