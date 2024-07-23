// import { getUser } from "@/app/api";
import { Box } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCategory } from "../../../nawriter/api";
import { getMyNews } from "../../api";
import MyNewsForm from "../../new/components/MyNewsForm";

export default async function NewMyNewsPage({
  params,
  searchParams,
}: {
  params: { myNewsSeq: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  if (!token) redirect("/user/login");

  const categoryData = await getCategory({ 
    token: token, 
    refreshToken:refreshToken,
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
          myNewsSeq={myNewsSeq as string}
          title={myNewsData.Title}
          content={myNewsData.Post}
          categoryData={myNewsData.KeyWordTypeName}
          category={categoryList}
          token={token}
          refreshToken={refreshToken}
        />
      </Box>
    </Box>
  );
}
