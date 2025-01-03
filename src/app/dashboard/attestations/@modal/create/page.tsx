'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Modal from "@/components/modal"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  recipient: z.string().min(42, {
    message: "Please enter a valid Ethereum address (42 characters).",
  }),
  schema: z.string().min(2, {
    message: "Schema must be at least 2 characters.",
  }),
})

export default function CreateAttestationModal() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      schema: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Handle form submission here
  }

  return (
    <Modal>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Create Attestation</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0x..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the Ethereum address of the recipient
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schema</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter schema" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the schema for this attestation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Attestation</Button>
          </form>
        </Form>
      </div>
    </Modal>
  )
}