import Image from "next/image";
import LogoImage from "@/assets/images/NAWriter_logo.png";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { getCompany, getCountry } from "../join/api";
import FindPasswordForm from "./components/FindPasswordForm";
import FindEmailForm from "./components/FIndEmailForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Join() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  if (token) redirect("/service/nawriter");

  const countryData = await getCountry();
  const companyData = await getCompany();

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pt: 10,
        }}
      >
        <Link href="/user/login">
          <Image src={LogoImage} width={160} alt="logo-img" priority />
        </Link>
      </Box>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          gap: 8,
        }}
      >
        <FindEmailForm countryData={countryData} companyData={companyData} />
        <Divider orientation="vertical" flexItem />
        <FindPasswordForm countryData={countryData} companyData={companyData} />
      </Box>
    </div>
  );
}
