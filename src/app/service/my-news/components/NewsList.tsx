"use client";

//** Mui Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { grey } from "@mui/material/colors";
import { useTranslation } from "@/i18n/client";

export default function MyNewsList({ newsList }: { newsList: any[] }) {
  const [newsListData, setNewsListData] = useState(newsList);
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const newList = newsList.filter((data) => {
      const regexp = new RegExp(search.toLowerCase() || "");
      return data.title.toLowerCase().match(regexp);
    });

    setNewsListData(newList);
  }, [search, category, newsList]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {newsListData.length > 0 ? (
        newsListData
          .filter(
            (item) =>
              item.category === category || category === "" || category === null
          )
          .map((item) => (
            <Box
              key={item.myNewsSeq}
              sx={{
                width: "100%",
              }}
            >
              <Button
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
                onClick={() => {
                  router.push(`/service/my-news/edit/${item.myNewsSeq}`);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Chip
                    label={item.category}
                    color="primary"
                    sx={{
                      py: 2,
                    }}
                  />
                  <Typography variant="subtitle2">{item.title}</Typography>
                </Box>
              </Button>
              <Divider
                sx={{
                  my: 2,
                }}
              />
            </Box>
          ))
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            p: 12,
            backgroundColor: grey[100],
          }}
        >
          <Typography>{t("components.myNews.no date")}</Typography>
        </Box>
      )}
    </Box>
  );
}
