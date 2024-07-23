// import { getUser } from "@/app/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCategory, getArticleType, getArticleList } from "../api";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import { Box } from "@mui/material";
import NAWriterEditForm from "./components/TmpEditForm";

export default async function NAWriterTmpEdit({
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

  const createdAt = searchParams?.createdAt || "";

  const categoryData = await getCategory({
    token: token,
    refreshToken: refreshToken,
  });
  const categoryList = categoryData.map((category: any) => {
    return category.remark;
  });
  const articleTypeData = await getArticleType({
    token: token,
    refreshToken: refreshToken,
  });
  const articleTypeList = articleTypeData.map((type: any) => {
    return type.remark;
  });

  const parseTmpArticleData = (data: any) => {
    return {
      userSeq: data.UserSeq,
      createdAt: data.CreateDateTime,
      MainSerl: data.MainSerl,
      Main: data.Main,
    };
  };

  const parseArticleData = (data: any) => {
    return {
      userSeq: data.UserSeq,
      createdAt: data.CreateDateTime,
      title: data.Title,
      aiDate: data.AiResultDateTime,
    };
  };

  const articleData = await getArticleList({
    // userSeq: userData.userSeq,
    // companySeq: userData.companySeq,
    token: token,
    refreshToken: refreshToken,
  });

  const tmpArticleList =
    articleData &&
    articleData?.tmpList.map((article: any) => parseTmpArticleData(article));

  const aiArticleList =
    articleData &&
    articleData?.aiList.map((aiResultItem: any) =>
      parseArticleData(aiResultItem)
    );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LeftSideBar tmpArticleList={tmpArticleList} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          mt: 1,
          padding: 2,
          gap: 2,
        }}
      >
        <NAWriterEditForm
          category={categoryList}
          articleType={articleTypeList}
          // userData={userData}
          token={token}
          refreshToken={refreshToken}
          // tmpData={parsedTmpData}
        />
        <RightSideBar aiArticleList={aiArticleList} />
      </Box>
    </Box>
  );
}
