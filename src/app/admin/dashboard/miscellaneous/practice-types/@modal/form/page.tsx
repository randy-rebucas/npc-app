"use client"

import Modal from "@/components/modal"
import PracticeTypeForm from "@/components/admin/forms/PracticeTypeForm"

export default function PracticeTypeFormModal() {


    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Add Practice Type</h2>

                <PracticeTypeForm id={null} />
            </div>
        </Modal>
    )
}