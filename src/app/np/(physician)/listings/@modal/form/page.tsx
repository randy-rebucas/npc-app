import Modal from "@/components/modal";
import ListingForm from "@/components/listings/form/ListingForm";

export default function Form() {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Create Listing</h2>
                <ListingForm />
            </div>
        </Modal>
    )
}