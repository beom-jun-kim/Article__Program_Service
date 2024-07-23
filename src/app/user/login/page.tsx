import Box from "@mui/material/Box";
import { getCompany } from "../join/api";
import LoginForm from "./components/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  if (token) redirect("/service/nawriter");
  const companyData = await getCompany();

  return (
    <div className="loginPage">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <LoginForm companyData={companyData} />
      </Box>
    </div>
  );
}
