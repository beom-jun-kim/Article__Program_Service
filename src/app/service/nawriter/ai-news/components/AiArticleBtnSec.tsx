"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { postMyNews } from "@/app/service/my-news/api";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { postNewAiNews } from "../../edit/api";
import { useState } from "react";

export default function AiattachmentButton({
  title,
  content,
  category,
  token,
  refreshToken,
  onReset,
}: {
  title: string;
  content: string;
  category: string;
  token: string;
  refreshToken: string;
  onReset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleClickRegister = async () => {
    try {
      const response = await postMyNews({
        title: title,
        content: content,
        category: category,
        token,
        refreshToken,
      });
      const myNewsSeq = response.seq;
      toast.success("My News가 등록되었습니다.");
      router.push(`/service/my-news/edit/${myNewsSeq}`);
    } catch (error) {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
      console.error("저장에 실패", error);
    }
  };

  const handleClickSummarize = async () => {
    try {
      router.push(
        `/service/nawriter/attachment?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&category=${encodeURIComponent(category)}`
      );
      router.refresh();
    } catch (error) {
      console.error("AI 요약 실패", error);
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        width: "32%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mx: "auto",
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleClickSummarize}
      >
        {t("components.writerForm.go to attached materials")}
      </Button>
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 2 }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClickRegister}
          sx={{ width: "50%" }}
        >
          {t("components.writerForm.register my news")}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={onReset}
          sx={{ width: "50%" }}
        >
          {t("components.writerForm.reset")}
        </Button>
      </Box>
    </Box>
  );
}
