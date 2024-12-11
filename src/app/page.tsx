import { getLogtoContext, signIn } from "@logto/next/server-actions";
import SignIn from "../components/sign-in";
import { logtoConfig } from "./logto";
import { sdk } from "@/lib/sharetribe";

export default async function Home() {

  
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  // Add Sharetribe listings fetch
  const listings = await sdk.listings.query({
    pub_index: 'default',
    include: ['images', 'author'],
  });

  return (
    <main className="min-h-screen  from-indigo-50 to-white">
      {/* Hero Section */}
      {!isAuthenticated && <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your Modern Web App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Experience the future of web applications with our cutting-edge platform.
            Simple, secure, and powerful.
          </p>
          {!isAuthenticated && <SignIn
            onSignIn={async () => {
              'use server';

              await signIn(logtoConfig);
            }}
          />}
        </div>
      </section>}
      
      {/* Add Listings Section */}
      {isAuthenticated && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Available Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.data.data.map((listing: { id: string; attributes: { title: string; description: string; }; }, index: number) => (
                <div key={index} className="border rounded-lg p-4 shadow-sm">
                  <h3 className="text-xl font-semibold">{listing.attributes.title}</h3>
                  <p className="text-gray-600">{listing.attributes.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
