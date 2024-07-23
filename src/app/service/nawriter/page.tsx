import Box from "@mui/material/Box";
import React from "react";
import NAWriterForm from "./components/NAWriterForm";
import LeftSideBar from "./components/LeftSideBar";
import { getCategory, getArticleType, getArticleList } from "./api";
// import { getUser } from "@/app/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function NAWriter() {
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
  const articleTypeData = await getArticleType({
    token: token,
    refreshToken: refreshToken,
  });
  const articleTypeList = articleTypeData.map((type: any) => {
    return type.remark;
  });

  const articleData = await getArticleList({
    token: token,
    refreshToken: refreshToken,
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

  const tmpArticleList = Array.isArray(articleData?.tmpList) 
  ? articleData.tmpList.map((article: any) => parseTmpArticleData(article)) 
  : [];

  return (
    <Box className="nrContainer"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <LeftSideBar tmpArticleList={tmpArticleList} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          height: "100%",
          padding: 2,
          gap: 1,
        }}
      >
        <NAWriterForm
          category={categoryList}
          article={articleTypeList}
          token={token}
          refreshToken={refreshToken}
        />
      </Box>
    </Box>
  );
}
