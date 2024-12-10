import { getLogtoContext, signIn, signOut } from "@logto/next/server-actions";
import SignIn from "./sign-in";
import SignOut from "./sign-out";
import { logtoConfig } from "./logto";

export default async function Home() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  return (
    <main>
      <nav>
        {isAuthenticated ? (
          <p>
            Hello, {claims?.sub},
            <SignOut
              onSignOut={async () => {
                'use server';

                await signOut(logtoConfig);
              }}
            />
          </p>
        ) : (
          <p>
            <SignIn
              onSignIn={async () => {
                'use server';

                await signIn(logtoConfig);
              }}
            />
          </p>
        )}
      </nav>
      {(claims && isAuthenticated) && (
        <div>
          <h2>Claims:</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(claims).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
