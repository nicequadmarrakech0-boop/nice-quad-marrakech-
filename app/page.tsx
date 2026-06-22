import { redirect } from "next/navigation"

// Root page redirects to the default locale
// The middleware handles runtime locale detection and rewrites,
// but during static generation we need an explicit redirect
export default function RootPage() {
  redirect("/en")
}
