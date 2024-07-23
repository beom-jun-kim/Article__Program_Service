"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { postAttachList, postSummarize } from "../api";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import ViewDetailModal from "./ViewDetailModal";
import ConfirmModal from "./ConfirmModal";
import { useTranslation } from "@/i18n/client";

export default function AttachmentContainer({
  aiArticleData,
  token,
  refreshToken,

  title,
  category,
  content,
}: {
  aiArticleData: any;
  token: string;
  refreshToken: string;

  title: string;
  category: string;
  content: string;
}) {
  const [attachmentList, setAttachmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("전체");
  const [summary, setSummary] = useState("");
  const [modalContent, setModalContent] = useState<{
    content: string;
    form: string;
  }>({
    content: "",
    form: "",
  });
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [checkedAttachment, setCheckedAttachment] = useState<
    {
      referenceText: string;
      referenceFrom: string;
    }[]
  >([]);

  const router = useRouter();
  const { t } = useTranslation();

  const handleLoadAttachmentList = async () => {
    try {
      setLoading(true);
      const data = await postAttachList({
        articleData: aiArticleData
          ? {
              cateGory: aiArticleData.category,
              resText: aiArticleData.content,
            }
          : {
              cateGory: category,
              resText: content,
            },
        token,
        refreshToken,
      });

      //   ...(aiArticleData && aiArticleData.category && aiArticleData.content) ? {
      //     articleData: {
      //       cateGory: aiArticleData.category,
      //       resText: aiArticleData.content,
      //     },
      //   } : {
      //     title,
      //     categroy,
      //     content,
      //   }
      //   token,
      //   refreshToken,
      // });

      const parseResult1 = data.result.slice(1).map((item: any) => {
        const data = item.split("--").filter(Boolean);

        return {
          category: data[0],
          relevance: data[1],
          content: data[2],
          from: data[3],
        };
      });
      const parseResult2 = data.result2.map((item: any) => {
        return {
          category: item.catagory,
          relevance: item.rank,
          content: item.attachContent,
          from: item.link,
        };
      });

      setAttachmentList([...attachmentList, ...parseResult1, ...parseResult2]);
    } catch (error) {
      // router.push("/error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    try {
      setLoading(true);
      const data = await postSummarize({
        attachments: checkedAttachment,
        token,
        refreshToken,
      });
      const combinedSummary = data.result.generated_text;
      setSummary(combinedSummary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickDetail = ({
    content,
    form,
  }: {
    content: string;
    form: string;
  }) => {
    setModalContent({
      content,
      form,
    });
    setOpenDetailModal(true);
  };

  return (
    <Box
      sx={{
        mt: 6,
        display: "flex",
        maxWidth: 1600,
        width: "100%",
        gap: 4,
      }}
    >
      {loading && <Loading />}
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            my: 2,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h6">
            {t("components.writerForm.go to attached materials")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <FormControl>
              <InputLabel id="attachment-order">
                {t("components.writerForm.relevance")}
              </InputLabel>
              <Select
                name="관련도 필터"
                labelId="attachment-order"
                id="attachment-filter"
                value={filter}
                label="관련도 필터"
                size="small"
                sx={{
                  width: "200px",
                }}
                onChange={(e: SelectChangeEvent) => {
                  setFilter(e.target.value as string);
                }}
              >
                <MenuItem value={"전체"}>
                  {t("components.writerForm.view all")}
                </MenuItem>
                <MenuItem value={"관련도 : [상]"}>
                  {t("components.writerForm.relevance upper")}
                </MenuItem>
                <MenuItem value={"관련도 : [중]"}>
                  {t("components.writerForm.relevance middle")}
                </MenuItem>
                <MenuItem value={"관련도 : [하]"}>
                  {t("components.writerForm.relevance lower")}
                </MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              size="small"
              onClick={handleLoadAttachmentList}
            >
              {attachmentList.length > 0
                ? t("components.writerForm.find more")
                : t("components.writerForm.find ref")}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSummarize}
              disabled={checkedAttachment.length === 0}
            >
              {t("components.writerForm.summarize")}
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "60vh",
            overflowY: "scroll",
            gap: 2,
            width: "100%",
          }}
        >
          {attachmentList.length > 0 ? (
            attachmentList
              .filter(
                (item: any) => filter === "전체" || item.relevance === filter
              )
              .map((item: any, index: number) => (
                <Box
                  key={item.content}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Checkbox
                    sx={{
                      mr: 2,
                    }}
                    checked={checkedAttachment.some((data) => {
                      return data.referenceText === item.content;
                    })}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedAttachment([
                          ...checkedAttachment,
                          {
                            referenceText: item.content as string,
                            referenceFrom: item.from as string,
                          },
                        ]);
                      } else {
                        setCheckedAttachment(
                          checkedAttachment.filter(
                            (data) => data.referenceText !== item.content
                          )
                        );
                      }
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1" color={"primary"}>
                        {item.category}
                      </Typography>
                      <Typography variant="subtitle2" color={"primary"}>
                        {item.relevance}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2" component={"p"}>
                        {item.content}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "end",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="text"
                          size="small"
                          onClick={() =>
                            handleClickDetail({
                              content: item.content,
                              form: item.from,
                            })
                          }
                        >
                          {t("components.writerForm.details")}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))
          ) : (
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="body2" color={"grey"}>
                {t("components.writerForm.plz btn click")}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 4,
          border: "2px solid #f5f5f5",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" color={"primary"}>
            {t("components.writerForm.summary")}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenConfirmModal(true)}
            sx={
              {
                //   height: "28px",
              }
            }
          >
            {t("components.writerForm.go to create ai articles")}
          </Button>
        </Box>

        {summary ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="body2">{summary}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#f5f5f5",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="body2" color={"grey"}>
              {t("components.writerForm.plz btn click")}
            </Typography>
          </Box>
        )}
      </Box>
      <ViewDetailModal
        open={openDetailModal}
        handleClose={() => setOpenDetailModal(false)}
        aiArticleData={modalContent}
      />
      <ConfirmModal
        open={openConfirmModal}
        createdAt={aiArticleData?.createDate}
        handleClose={() => setOpenConfirmModal(false)}
      />
    </Box>
  );
}
