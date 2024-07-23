"use client";

// ** Mui Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/client";

export default function RightSideBar({
  aiArticleList,
}: {
  aiArticleList: any;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        borderRight: "1px solid primary",
        padding: 2,
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        overflowY: "scroll",
        height: "calc(100vh - 64px)",
        width: "320px",
      }}
    >
      <Typography variant="subtitle1" color={"primary"}>
      {t("components.writerForm.AI article list")}
      </Typography>
      {Array.isArray(aiArticleList) && aiArticleList.length > 0 ? (
        aiArticleList.map((article, index) => {
          return (
            <Box
              key={index.toString()}
              sx={{
                width: "100%",
              }}
            >
              <Button
                onClick={() => {
                  router.push(
                    `/service/nawriter/ai-news?createDate=${article.createdAt}&aiResultDate=${article.aiDate}`
                  );
                }}
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  textTransform: "none",
                  borderRadius: 0,
                }}
              >
                <Box
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "200px",
                    my: 1,
                    cursor: "pointer",
                  }}
                >
                  <Typography variant="body2" component={"span"}>
                    {article.title}
                  </Typography>
                </Box>
              </Button>
              <Divider />
            </Box>
          );
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography variant="caption" color={"gray"}>
          {t("components.writerForm.There are no AI articles saved yet")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
