"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteDescription: z.string().min(2, {
    message: "Site description must be at least 2 characters.",
  }),
  siteLogo: z.string().url({
    message: "Please enter a valid URL.",
  }),
  siteFavicon: z.string().url({
    message: "Please enter a valid URL.",
  }),
  siteUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  maintenanceMode: z.boolean().default(false),
});

export default function Application() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      siteUrl: "",
      siteLogo: "",
      siteFavicon: "",
      maintenanceMode: false,
    },
  });

  useEffect(() => {
    fetch("/api/config").then(res => res.json()).then(data => {
      form.reset(data)
    })
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update configuration",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Application Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h4 className="text-sm font-medium">General Settings</h4>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Application" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your site's name as it appears throughout the
                      application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A brief description of your site"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This description will be used for SEO and meta tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/logo.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The URL of your site's logo image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteFavicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Favicon URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/favicon.ico"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The URL of your site's favicon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The base URL of your application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Maintenance Mode
                      </FormLabel>
                      <FormDescription>
                        Put the application in maintenance mode.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Save changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
