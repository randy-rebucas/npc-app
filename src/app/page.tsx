import { getLogtoContext, signIn, signOut } from "@logto/next/server-actions";
import SignIn from "./sign-in";
import SignOut from "./sign-out";
import { logtoConfig } from "./logto";
import Image from 'next/image';

export default async function Home() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header/Nav Section */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/669f12afa08db593880fa90a_NP%20COLABORATOR%20BACKGROUND%20TRANSP%20160%20x%2043.png" alt="Logo" width={200} height={100} className="h-8 w-auto" />
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Welcome, {claims?.name || claims?.sub}</span>
                <SignOut
                  onSignOut={async () => {
                    'use server';
                    await signOut(logtoConfig);
                  }}
                />

              </div>
            ) : (
              <SignIn
                onSignIn={async () => {
                  'use server';
                  await signIn(logtoConfig);
                }}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!isAuthenticated &&  <section className="pt-32 pb-20 px-6">
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

      {/* User Data Section */}
      {(claims && isAuthenticated) && (
        <section className="pt-32 px-6 pb-20">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-semibold mb-6 p-4 text-2xl text-gray-900">Your Profile Data</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(claims).map(([key, value]) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{key}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
