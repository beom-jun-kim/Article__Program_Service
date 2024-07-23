import Box from "@mui/material/Box";
// import { getUser } from "@/app/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCategory } from "../../nawriter/api";
import MyNewsForm from "./components/MyNewsForm";
import { getMyNews } from "../api";

export default async function NewMyNewsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  if (!token) redirect("/user/login");

  const categoryData = await getCategory({
    token: token,
    refreshToken: refreshToken,
  });
  const categoryList = categoryData.map((category: any) => {
    return category.remark;
  });

  const { myNewsSeq } = params;

  const data = await getMyNews({
    seq: myNewsSeq,
    token: token,
    refreshToken:refreshToken,
  });

  const myNewsData = data.result;

  const title = (searchParams?.title as string) || "";
  const content = (searchParams?.content as string) || "";
  const category = (searchParams?.category as string) || "";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 1600,
          width: "100%",
          display: "flex",
          height: "100%",
          padding: 2,
          gap: 1,
        }}
      >
        <MyNewsForm
          title={title}
          myNewsSeq={myNewsSeq as string}
          content={content}
          categoryData={category}
          category={categoryList}
          // userSeq={userData.userSeq}
          // companySeq={userData.companySeq}
          token={token}
          refreshToken={refreshToken}
        />
      </Box>
    </Box>
  );
}
