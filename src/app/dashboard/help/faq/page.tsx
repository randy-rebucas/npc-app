import { getFaqs } from "@/app/actions/faq";

export default async function FaqPage() {

  const faqs = await getFaqs();
  
  return (
    <div className="max-w-2xl mx-auto">

      {/* Contact Section */}
      <div className="bg-white  p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-900">FAQ</h2>
          <p className="text-gray-500 mt-1">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group border rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <svg
                  className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-gray-500" dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
