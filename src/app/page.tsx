import { getLogtoContext, signIn } from "@logto/next/server-actions";
import SignIn from "../components/sign-in";
import { logtoConfig } from "./logto";

export default async function Home() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
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
    </main>
  );
}
