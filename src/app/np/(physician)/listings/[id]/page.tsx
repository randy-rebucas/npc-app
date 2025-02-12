import Listing from "@/components/listings/Listing";


export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    return (
        <div className="flex-1 space-y-4">
            <Listing id={id} />
        </div>
    )
}