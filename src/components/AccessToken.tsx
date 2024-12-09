import { useSession } from "next-auth/react"
export default function AccessToken() {
    const { data: session } = useSession()
    const accessToken = session?.user?.accessToken
    return (
        <div>Access Token: {accessToken}</div>
    )
}
