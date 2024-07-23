import { Box } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AttachmentContainer from "./components/AttachmenContainer";
import { getAiArticle } from "../ai-news/api";
// import { getUser } from "@/app/api";

export default async function NAWriterAttachment({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const createdAt = searchParams?.createdAt || "";
  const aiResultDate = searchParams?.aiResultDate || "";

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  if (!token) redirect("/user/login");

  const title = searchParams?.title ? searchParams.title.toString() : "";
  const category = searchParams?.category ? searchParams.category.toString() : "";
  const content = searchParams?.content ? searchParams.content.toString() : "";

  const data = await getAiArticle({
    createdAt: createdAt as string,
    aiResultDate: aiResultDate as string,
    token,
    refreshToken,
  });

  const parseArticleData = (data: any) => {
    return {
      title: data.Title,
      content: data.Post,
      category: data.KeyWord,
      userSeq: data.UserSeq,
      aiResultDate: data.AiResultDateTime,
      createDate: data.CreateDateTime,
    };
  };

  const aiArticleData =
    data.result && typeof data.result === "object" ? parseArticleData(data.result) : null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
      }}
    >
      <AttachmentContainer aiArticleData={aiArticleData} token={token} refreshToken={refreshToken} title={title} category={category} content={content}/>
    </Box>
  );
}
