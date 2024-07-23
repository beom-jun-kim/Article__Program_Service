import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  if (!token) {
    redirect("/user/login");
  } else if (token) {
    redirect("/service/nawriter");
  }

  return null;
}
