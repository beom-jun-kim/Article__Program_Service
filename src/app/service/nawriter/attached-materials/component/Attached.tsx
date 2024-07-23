"use client";

import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { postMyNews } from "@/app/service/my-news/api";
import { toast } from "react-toastify";
import { postNewAiNews } from "../../edit/api";
import { INAWriterFormAttached } from "../../type";
import AiArticleBtnSec from "../../ai-news/components/AiArticleBtnSec";
import AiArticleButton from "../../ai-news/components/AiArticleButton";

export default function Attached({
  createdAt,
  title,
  content,
  category,
  categoryList,
  aiResultDate,
  token,
  refreshToken,
}: {
  createdAt: string;
  title: string;
  content: string;
  category: string;
  categoryList: string[];
  aiResultDate: string;
  token: string;
  refreshToken: string;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [formValues, setFormValues] = useState<INAWriterFormAttached>({
    category: category || "",
    title: title || "",
    content: content || "",
  });

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value as string,
    });
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setFormValues({
      ...formValues,
      category: event.target.value as string,
    });
  };

  const handleReset = () => {
    setFormValues({
      category: "",
      title: "",
      content: "",
    });
  };
  const innerDate = title && content && category;

  return (
    <Box>
      {innerDate ? (
        <>
          <Typography variant="h6" color="primary">
            {pathname.startsWith("/service/nawriter/ai-news")
              ? t("components.writerForm.keyword")
              : null}
          </Typography>

          {pathname.startsWith("/service/nawriter/ai-news") ? (
            <Typography variant="body1">{category}</Typography>
          ) : (
            <FormControl
              sx={{
                width: 120,
              }}
            >
              <InputLabel id="category-select-label">
                {t("components.writerForm.keyword")}
              </InputLabel>
              <Select
                name="category"
                labelId="category-select-label"
                id="category-select"
                value={formValues.category || ""}
                label={t("components.writerForm.keyword")}
                onChange={handleChangeCategory}
              >
                {Array.isArray(categoryList) ? (
                  categoryList.map((cat, index) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={category}>{category}</MenuItem>
                )}
              </Select>
            </FormControl>
          )}

          <Typography variant="h6" color="primary">
            {pathname.startsWith("/service/nawriter/ai-news")
              ? t("components.writerForm.title")
              : null}
          </Typography>

          {!pathname.startsWith("/service/nawriter/ai-news") ? (
            <TextField
              name="title"
              label={t("components.writerForm.representative text")}
              value={formValues.title}
              onChange={handleChangeInput}
              fullWidth
            />
          ) : (
            <Typography variant="body1">{title}</Typography>
          )}
          <Divider />

          <Typography variant="h6" color="primary">
            {pathname.startsWith("/service/nawriter/ai-news")
              ? t("components.writerForm.content of the article")
              : null}
          </Typography>

          {!pathname.startsWith("/service/nawriter/ai-news") ? (
            <TextField
              name="content"
              label={t("components.writerForm.article text")}
              value={formValues.content}
              onChange={handleChangeInput}
              fullWidth
              multiline
              rows={10}
              placeholder={t("components.writerForm.please write the content")}
            />
          ) : (
            <Typography variant="body1" whiteSpace={"pre-line"}>
              {content || t("components.writerForm.no article content")}
            </Typography>
          )}
          <AiArticleButton
            aiResultDate={aiResultDate}
            createdAt={createdAt}
            category={formValues.category}
            title={formValues.title}
            content={formValues.content}
            token={token}
            refreshToken={refreshToken}
            onReset={handleReset}
          />
        </>
      ) : (
        <>
          <FormControl
            sx={{
              width: 120,
            }}
          >
            <InputLabel id="category-select-label">
              {t("components.writerForm.keyword")}
            </InputLabel>
            <Select
              name="category"
              labelId="category-select-label"
              id="category-select"
              value={formValues.category || ""}
              label={t("components.writerForm.keyword")}
              onChange={handleChangeCategory}
            >
              {Array.isArray(categoryList) ? (
                categoryList.map((cat, index) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={category}>{category}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Divider />
          <TextField
            name="title"
            label={t("components.writerForm.title")}
            value={formValues.title}
            onChange={handleChangeInput}
            fullWidth
          />
          <TextField
            name="content"
            label={t("components.writerForm.content of the article")}
            value={formValues.content}
            onChange={handleChangeInput}
            fullWidth
            multiline
            rows={10}
            placeholder={t("components.writerForm.please write the content")}
          />
          <AiArticleBtnSec
            category={formValues.category}
            title={formValues.title}
            content={formValues.content}
            token={token}
            refreshToken={refreshToken}
            onReset={handleReset}
          />
        </>
      )}
    </Box>
  );
}
