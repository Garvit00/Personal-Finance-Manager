"use client"

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Input} from "@/components/ui/input";

const CATEGORIES = ["Food", "Transportation", "Entertainment", "Utilities", "Shopping", "Bills"];

// Define the form schema using Zod
const formSchema = z.object({
  amount: z.preprocess(
            (val) => (val === "" ? undefined : Number(val)),
            z.number().min(0, { message: "Amount must be a positive number" })),

  category: z.string().min(1, { message: "Category is required" }),

  month: z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z.number().min(1, { message: "Month must be between 1 and 12" }).max(12, { message: "Month must be between 1 and 12" })),
  
  year: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number()
        .min(2000, { message: "Year must be 2000 or later" })),
});

  export function BudgetForm() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            amount: undefined,
            category: "",
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        });

        const onSubmit = async (values: z.infer<typeof formSchema>) => {
          try {
            console.log("Submitting Budget Data:", values);
        
            const res = await fetch("/api/budgets", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
        
            if (!res.ok) {
              throw new Error(`Failed to create budget: ${res.status} ${res.statusText}`);
            }
        
            const newBudget = await res.json();
            console.log("Budget created successfully:", newBudget);
        
            form.reset();
            alert("Budget added successfully!");
          } catch (error) {
            console.error("Error creating budget:", error);
            alert("Something went wrong. Please try again!");
          }
        };
        
    
    
    if (!isClient) return null; // Prevents SSR mismatch
  
    return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter amount"
                  {...field}
                  value={field.value === undefined ? "" : field.value} // Allow clearing input
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value)); // Convert empty input to undefined
                  }}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter month (1-12)"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter year (2000+)"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Set Budget</Button>
      </form>
      </Form>
    );
  }