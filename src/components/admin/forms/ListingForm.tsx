import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface ListingFormProps {
    id: string | null;
}

export default function ListingForm({ id }: ListingFormProps) {
    const form = useForm();
    console.log(id);
    const onSubmit = async () => {
        // if (id) {
        //     // Update existing listing
        //     await updateListing(id, data);
        // } else {
        //     // Create new listing
        //     await createListing(data);
        // }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {/* Add other form fields as needed */}
                <Button type="submit">Save</Button>
            </form>
        </Form>
    );
} 