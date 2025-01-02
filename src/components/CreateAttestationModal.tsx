// import { Dialog } from '@headlessui/react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { useState } from 'react';

// interface CreateAttestationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: { schema: string; recipient: string }) => void;
// }
// { isOpen, onClose, onSubmit }: CreateAttestationModalProps
export function CreateAttestationModal() {
  // const [formData, setFormData] = useState({
  //   schema: '',
  //   recipient: '',
  // });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  //   onClose();
  // };

  return ( <></>
    // <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    //   <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
    //   <div className="fixed inset-0 flex items-center justify-center p-4">
    //     <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
    //       <div className="flex items-center justify-between mb-4">
    //         <Dialog.Title className="text-lg font-medium">Create Attestation</Dialog.Title>
    //         <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
    //           <XMarkIcon className="h-6 w-6" />
    //         </button>
    //       </div>

    //       <form onSubmit={handleSubmit}>
    //         <div className="space-y-4">
    //           <div>
    //             <label className="block text-sm font-medium text-gray-700">Schema</label>
    //             <input
    //               type="text"
    //               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
    //               value={formData.schema}
    //               onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
    //               required
    //             />
    //           </div>

    //           <div>
    //             <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
    //             <input
    //               type="text"
    //               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
    //               value={formData.recipient}
    //               onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
    //               required
    //             />
    //           </div>

    //           <div className="flex justify-end gap-3 mt-6">
    //             <button
    //               type="button"
    //               onClick={onClose}
    //               className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
    //             >
    //               Cancel
    //             </button>
    //             <button
    //               type="submit"
    //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    //             >
    //               Create
    //             </button>
    //           </div>
    //         </div>
    //       </form>
    //     </Dialog.Panel>
    //   </div>
    // </Dialog>
  );
} 