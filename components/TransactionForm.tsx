"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"

const CATEGORIES = ["Food", "Transportation", "Entertainment", "Utilities", "Shopping", "Bills"];

// Define the form schema using Zod
const formSchema = z.object({
    amount: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)), // Convert empty string to undefined, otherwise parse number
      z.number().min(0, { message: "Amount must be a positive number" })
    ), // Convert to number on submit
    date: z.date(),
    description: z.string().optional(),
    category: z.string().min(1, { message: "Category is required" }),
  });

export function TransactionForm() {

   // State to prevent SSR mismatch
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
     setIsClient(true);
   }, []);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        amount: undefined,
        date: new Date(),
        description: "",
        category: ""
      },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
    
        if (!res.ok) throw new Error("Failed to create transaction");
    
        const newTransaction = await res.json();
        alert("Transaction added successfully!");
        console.log("Transaction created:", newTransaction);
    
        form.reset();
      } catch (error) {
        console.error("Error creating transaction:", error);
        alert("Failed to add transaction!");
      }
      }; 

      if(!isClient) return null; // Prevents rendering until mounted on the client

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className = "space-y-4">
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline">
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(selectedDate) => field.onChange(selectedDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Transaction</Button>
        </form>
    </Form>
)
}