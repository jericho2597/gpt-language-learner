import { useSession } from "next-auth/react";
import { useRouter } from "next/router"
import { useEffect } from "react"

export function AuthGuard({ children }: { children: JSX.Element }) {
  const { data: session, status: loadingStatus } = useSession();
  const router = useRouter()
  
  const loading = loadingStatus === "loading";

  useEffect(() => {
    if (!loading && !session) {
        // redirect
        void router.push("/");
    }
  }, [loading, session, router])

  /* show loading indicator while the auth provider is still initializing */
  if (loading) {
    return <h1>Application Loading</h1>
  }

  return <>{children}</>
}