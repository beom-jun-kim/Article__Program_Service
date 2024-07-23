import Box from "@mui/material/Box";
import React from "react";
import MyNewsList from "./components/NewsList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMyNewsList } from "./api";
// import { getUser } from "@/app/api";
import MyNewsListSearch from "./components/NewsListSearch";
import { getCategory } from "../nawriter/api";

export default async function AiNewsPage({
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

  const data = await getMyNewsList({
    token: token,
    refreshToken: refreshToken,
  });

  const myNewsList = data.result
    ? data.result.map((news: any) => {
        return {
          myNewsSeq: news.MyNewsSeq,
          // seq: news.Seq,
          title: news.Title,
          category: news.KeyWordTypeName,
        };
      })
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        transform: "translateZ(0px)",
        px: 8,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          my: 4,
          maxWidth: 1600,
          width: "100%",
        }}
      >
        <MyNewsListSearch category={categoryList} />
        <MyNewsList newsList={myNewsList as any[]} />
      </Box>
    </Box>
  );
}
