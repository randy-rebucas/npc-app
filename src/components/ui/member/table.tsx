import { fetchFilteredMembers } from '@/lib/data/members-data';
import Sync from './sync';

export default async function MembersTable({
   query,
   currentPage,
}: {
   query: string;
   currentPage: number;
}) {
   const members = await fetchFilteredMembers(query, currentPage);

   return (
      <div className='mt-6 flow-root'>
         <div className='inline-block min-w-full align-middle'>
            <div className='rounded-lg bg-gray-50 p-2 md:pt-0'>
               <div className='md:hidden'>
                  {members?.map((member: { _id: string; event: string; email: string; createdAt: Date; updatedAt: Date; accountSynced: boolean }) => (
                     <div
                        key={member._id}
                        className='mb-2 w-full rounded-md bg-white p-4'
                     >
                        <div className='flex items-center justify-between border-b pb-4'>
                           <div>
                              <div className='mb-2 flex items-center'>
                                 <p>{member.event}</p>
                              </div>
                              <div className='mb-2 flex items-center'>
                                 <p>{member.email}</p>
                              </div>

                              <p className='text-sm text-gray-500 mt-1'>
                                 Created At: {member.createdAt.toLocaleDateString()}
                              </p>
                              <p className='text-sm text-gray-500 mt-1'>
                                 Updated At: {member.updatedAt.toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <div className='flex w-full items-center justify-between pt-4'>
                           <div className='flex justify-end gap-2'>
                              <Sync id={member._id} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               <table className='hidden min-w-full text-gray-900 md:table'>
                  <thead className='rounded-lg text-left text-sm font-normal'>
                     <tr>
                        <th
                           scope='col'
                           className='px-4 py-5 font-medium sm:pl-6'
                        >
                           Event
                        </th>
                        <th
                           scope='col'
                           className='px-3 py-5 font-medium'
                        >
                           Email
                        </th>
                        <th scope='col' className='px-3 py-5 font-medium'>
                           Account Synced
                        </th>
                        <th scope='col' className='px-3 py-5 font-medium'>
                           Created At
                        </th>
                        <th scope='col' className='px-4 py-5 font-medium'>
                           Updated At
                        </th>
                        <th scope='col' className='relative py-3 pl-6 pr-3'>
                           <span className='sr-only'>Sync</span>
                        </th>
                     </tr>
                  </thead>
                  <tbody className='bg-white'>
                     {members?.map((member) => (
                        <tr
                           key={member._id}
                           className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                        >
                           <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                              <p>{member.event}</p>
                           </td>
                           <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                              <p>{member.email}</p>
                           </td>
                           <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                              <p>{member.accountSynced ? 'Yes' : 'No'}</p>
                           </td>
                           <td className='whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md'>
                              {member.createdAt.toLocaleDateString()}
                           </td>
                           <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                              {member.updatedAt.toLocaleDateString()}
                           </td>
                           <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                              <div className='flex justify-end gap-3'>
                                 <Sync id={member._id} />
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}