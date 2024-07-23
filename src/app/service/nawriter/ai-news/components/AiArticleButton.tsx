"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { postMyNews } from "@/app/service/my-news/api";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { useState } from "react";
import { INAWriterFormAttached } from "../../type";

export default function AiArticleButton({
  createdAt,
  // userSeq,
  // companySeq,
  title,
  content,
  category,
  aiResultDate,
  token,
  refreshToken,
  onReset,
}: {
  createdAt: string;
  // userSeq: string;
  // companySeq: string;
  title: string;
  content: string;
  category: string;
  aiResultDate: string;
  token: string;
  refreshToken: string;
  onReset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const handleClickBack = () => {
    router.push(`/service/nawriter/edit?createdAt=${createdAt}`);
  };
  const { t } = useTranslation();
  const handleClickRegister = async () => {
    try {
      const response = await postMyNews({
        // userSeq: userSeq,
        // companySeq: companySeq,
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
      console.log("저장에 실패", error);
    }
  };

  const handleClickSummarize = () => {
    if (pathname.startsWith("/service/nawriter/ai-news")) {
      const url = `/service/nawriter/attached-materials?createDate=${createdAt}&aiResultDate=${aiResultDate}`;
      router.push(url);
    } else {
      router.push(
        `/service/nawriter/attachment?createdAt=${createdAt}&aiResultDate=${aiResultDate}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&category=${encodeURIComponent(category)}`
      );
    }
  };

  // const [formValues, setFormValues] = useState<INAWriterFormAttached>({
  //   title: title || "",
  //   content: content || "",
  // });

  // const handleReset = () => {
  //   setFormValues({
  //     title: "",
  //     content: "",
  //   });
  // };

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
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClickRegister}
          sx={{
            width: "50%",
          }}
        >
          {t("components.writerForm.register my news")}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={onReset}
          sx={{
            width: "50%",
          }}
        >
          {t("components.writerForm.reset")}
        </Button>
        {/* <Button
          variant="outlined"
          color="error"
          onClick={handleReset}
          sx={{
            width: "50%",
          }}
        >
          초기화
        </Button> */}
      </Box>
    </Box>
  );
}
