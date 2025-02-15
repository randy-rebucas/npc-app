import Modal from "@/components/modal";

export default async function CollaboratorDetailsModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    console.log(id);
    return (
        <Modal>
            <div className="p-6 max-w-2xl w-full bg-background text-foreground">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div>
                        <h2 className="text-xl font-semibold">Name Here</h2>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                            <span className="text-primary">Primary Care</span>
                            <span>Florida</span>
                        </div>
                    </div>
                </div>

                {/* Basic Info Section */}
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Basic Info</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Practice Type:</span>
                            <span>Primary Care</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">State:</span>
                            <span>Florida</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Effective Date:</span>
                            <span>2024-04-01</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly Rate:</span>
                            <span>$800</span>
                        </div>
                    </div>
                </div>

                {/* Practice Requirements */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Practice Requirements</h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                            Controlled Substances
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            200+ Patients
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                            New Grad
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            Startup
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
