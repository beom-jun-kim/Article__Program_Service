import { getCompany, getCountry } from "./api";
import { JoinForm } from "./components/JoinForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Join() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  if (token) redirect("/service/nawriter");

  const countryData = await getCountry();
  const companyData = await getCompany();

  console.log("countryData",countryData);

  return (
    <div>
      <JoinForm countryData={countryData} companyData={companyData} />
    </div>
  );
}
