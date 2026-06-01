import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect root (/) directly to the Login page so users land on authentication immediately.
  redirect("/login");
}
