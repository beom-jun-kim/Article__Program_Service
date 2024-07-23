//** Mui Components
import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Typography from "@mui/material/Typography";

// import { getUser } from "@/app/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAiArticle } from "../ai-news/api";
import AiArticleButton from "../ai-news/components/AiArticleButton";
import Attached from "./component/Attached";
import { getCategory } from "../api";

export default async function AttachmentPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const createDate = searchParams?.createDate || "";
  const aiResultDate = searchParams?.aiResultDate || "";

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";

  if (!token) redirect("/user/login");

  const data = await getAiArticle({
    createdAt: createDate as string,
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
    data.result && typeof data.result === "object"
      ? parseArticleData(data.result)
      : null;

  const categoryData = await getCategory({
    token: token,
    refreshToken: refreshToken,
  });

  const categoryList = categoryData.map((category: any) => {
    return category.remark;
  });

  return (
    <Box className="container"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        px: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 1600,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          mt: 6,
          padding: 2,
          gap: 2,
        }}
      >
        <Attached
          createdAt={createDate as string}
          title={aiArticleData?.title || ""}
          content={aiArticleData?.content || ""}
          category={aiArticleData?.category as string}
          aiResultDate={aiResultDate as string}
          categoryList={categoryList}
          token={token}
          refreshToken={refreshToken}
        />
        {/* {aiArticleData && <AiArticleButton
          createdAt={createDate as string}
          title={aiArticleData?.title || ""}
          content={aiArticleData?.content || ""}
          category={aiArticleData?.category as string}
          aiResultDate={aiResultDate as string}
          token={token}
          refreshToken={refreshToken}
        />} */}
      </Box>
    </Box>
  );
}
