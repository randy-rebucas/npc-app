import SignIn from "../../components/sign-in";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
// import Banner from "@/components/root/home/Banner";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
  console.log(isAuthenticated);
  return (
    <>
        {/* <Banner /> */}
        <main className="flex min-h-screen flex-col items-center justify-center">
          {/* {!isAuthenticated && ( */}
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              An example app built using {process.env.NEXT_PUBLIC_APP_NAME} <small className="text-sm text-muted-foreground">v{process.env.NEXT_PUBLIC_APP_VERSION}</small>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              I&apos;m building a web app with {process.env.NEXT_PUBLIC_APP_NAME} v{process.env.NEXT_PUBLIC_APP_VERSION} and open sourcing everything. Follow along as we figure this out together.
            </p>
            <div className="space-x-4">
              <SignIn />
              <Button variant="outline" asChild>
                <a href="https://github.com/yourusername/yourrepo" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </Button>
            </div>
          </div>
          {/* )} */}
        </main>
    </>
  );
}
