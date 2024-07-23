"use client";

// ** Mui Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { useRouter, useSearchParams } from "next/navigation";
import { grey } from "@mui/material/colors";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTranslation } from "@/i18n/client";

export default function LeftSideBar({
  tmpArticleList,
}: {
  tmpArticleList: any;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createdAt = searchParams.get("createdAt") || "";
  return (
    <Drawer
      sx={{
        width: "100%",
        flexShrink: 0,
        zIndex: 1,
        "& .MuiDrawer-paper": {
          width: "100%",
          boxSizing: "border-box",
          ml: 2,
          position: "relative",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* <Toolbar />
      <Toolbar /> */}
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Box className="nrBtnWrap">

        <Button
          sx={{
            mb: 2,
            justifyContent: "flex-start",
            textAlign: "left",
          }}
          // onClick={() => {
          //   router.push("/");
          // }}
          variant="text"
          // endIcon={<ArrowForwardIosIcon />}
          color="secondary"
          fullWidth
        >
          {t("components.writerForm.temporary article list")}
        </Button>

        <Button
          sx={{
            mb: 2,
            justifyContent: "end",
            textAlign: "left",
          }}
          onClick={() => {
            router.push("/");
          }}
          variant="text"
          endIcon={<ArrowForwardIosIcon />}
          color="secondary"
          fullWidth
        >
          {t("components.writerForm.create a new")}
        </Button>


        </Box>
        {Array.isArray(tmpArticleList) && tmpArticleList.length > 0 ? (
          tmpArticleList.map((article) => {
            return (
              <Box
                key={article.createdAt}
                sx={{
                  width: "100%",
                }}
              >
                <Button
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
                      width: "220px",
                      py: 1,
                      color: "gray",
                    }}
                    onClick={() => {
                      router.push(
                        `/service/nawriter/edit?createdAt=${article.createdAt}`
                      );
                      router.refresh();
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      component={"span"}
                      color={
                        createdAt === article.createdAt ? "primary" : grey[700]
                      }
                    >
                      {article.Main}
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
            }}
          >
            <Typography variant="caption" color={"gray"}>
              {t("components.writerForm.There are no draft articles saved")}
            </Typography>
          </Box>
        )}
      </List>
    </Drawer>
  );
}
