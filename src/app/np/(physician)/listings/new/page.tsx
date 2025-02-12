import ListingForm from "@/components/listings/form/ListingForm";
export default function NewListingPage() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Create Listing</h2>
            <ListingForm />
        </div>
    )
}