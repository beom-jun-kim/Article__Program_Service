import React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/app/api";
import { cookies } from "next/headers";
import { UserProvider } from "./context";

interface SettingLayoutProps {
  children?: React.ReactNode;
  // user:
}

const SettingLayout = async ({ children }: SettingLayoutProps) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  if (!token) redirect("/user/login");
  const data = await getUser(token, refreshToken);
  return <UserProvider data={data}>{children}</UserProvider>;
};

export default SettingLayout;
