"use client";

// ** Mui Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { INAWriterForm } from "../type";
import { useState } from "react";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { postNewAiNews, postSaveTmpArticle } from "../edit/api";
import { useTranslation } from "@/i18n/client";

export default function NAWriterForm({
  category,
  article,
  token,
  refreshToken,
}: {
  category: string[];
  article: string[];
  token: string;
  refreshToken: string;
}) {
  const [formValues, setFormValues] = useState<INAWriterForm>({
    category: "",
    articleFormat: "",
    highlightText: [],
    bodyText: [],
  });
  const [textFieldValue, setTextFieldValue] = useState({
    highlight: "",
    main: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const refresh = searchParams.get("refresh") || null;

  const handleChangeSelect = (event: SelectChangeEvent<string>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value as string,
    });
  };

  const handleChangeTextField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextFieldValue({
      ...textFieldValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickHighlightAdd = () => {
    setFormValues({
      ...formValues,
      highlightText: [...formValues.highlightText, textFieldValue.highlight],
    });
  };

  const handleClickMainAdd = () => {
    setFormValues({
      ...formValues,
      bodyText: [...formValues.bodyText, textFieldValue.main],
    });
  };

  const handleDeleteHighlight = (index: number) => {
    const newHighlightText = formValues.highlightText.filter(
      (_, i) => i !== index
    );
    setFormValues({
      ...formValues,
      highlightText: newHighlightText,
    });
  };

  const handleDeleteMain = (index: number) => {
    const newBodyText = formValues.bodyText.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      bodyText: newBodyText,
    });
  };

  const { i18n, t } = useTranslation();

  const parseHighlightText = formValues.highlightText.slice(1);
  const parseBodyText = formValues.bodyText.slice(1);

  const highlightText = parseHighlightText.map((highlight, index) => {
    return {
      ...formValues,
      highlightText: highlight,
      bodyText: "",
      bodySerl: "",
      HighlightSerl: "",
      createDate: "",
    };
  });
  const bodyText = parseBodyText.map((body, index) => {
    return {
      ...formValues,
      highlightText: "",
      bodyText: body,
      bodySerl: "",
      HighlightSerl: "",
      createDate: "",
    };
  });
  const reqData = [
    {
      ...formValues,
      highlightText: formValues.highlightText[0],
      bodyText: formValues.bodyText[0],
      bodySerl: "",
      HighlightSerl: "",
      createDate: "",
    },
    ...highlightText,
    ...bodyText,
  ];
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const articleData = await postNewAiNews({
        articleData: reqData,
        token: token,
        refreshToken: refreshToken,
      });
      const createdAt = articleData?.result[articleData?.result.length - 1];
      const aiResultDate = articleData.aiCreateDate;
      router.push(
        `/service/nawriter/ai-news?createDate=${createdAt}&aiResultDate=${aiResultDate}`
      );
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    console.log('handleSave', reqData);
    try {
      setLoading(true);
      const saveData = await postSaveTmpArticle({
        articleData: reqData,
        token: token,
        refreshToken: refreshToken,
      });
      console.log('handleSave02', saveData);
      toast.success("임시 저장되었습니다.");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    formValues.highlightText.length === 0 ||
    formValues.bodyText.length === 0 ||
    formValues.category === "" ||
    formValues.articleFormat === "";

  return (
    <Box
      sx={{
        margin: 6,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        gap: 4,
        justifyContent: "space-between",
        minWidth: "520px",
      }}
    >
      {loading && <Loading />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="category-select-label">
              {t("components.writerForm.keyword")}
            </InputLabel>
            <Select
              name="category"
              labelId="category-select-label"
              id="category-select"
              value={formValues.category}
              label={t("components.writerForm.keyword")}
              onChange={handleChangeSelect}
            >
              {category.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="articleFormat-select-label">
              {t("components.writerForm.article form")}
            </InputLabel>
            <Select
              name="articleFormat"
              labelId="articleFormat-select-label"
              id="articleFormat-select"
              value={formValues.articleFormat}
              label={t("components.writerForm.story form")}
              onChange={handleChangeSelect}
            >
              {article.map((article, index) => (
                <MenuItem key={index} value={article}>
                  {article}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              gap: 2,
              my: 2,
            }}
          >
            <TextField
              id="outlined-multiline-static"
              label={t("components.writerForm.highlight phrase")}
              name="highlight"
              fullWidth
              multiline
              value={textFieldValue.highlight}
              onChange={handleChangeTextField}
              rows={4}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setTextFieldValue({
                    ...textFieldValue,
                    highlight: "",
                  });
                }}
              >
                {t("components.writerForm.reset")}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleClickHighlightAdd}
                disabled={textFieldValue.highlight === ""}
                sx={{
                  width: "100px",
                }}
              >
                {t("components.writerForm.add")}{" "}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              gap: 2,
              my: 2,
            }}
          >
            <TextField
              id="outlined-multiline-static"
              label={t("components.writerForm.body text")}
              name="main"
              fullWidth
              multiline
              value={textFieldValue.main}
              onChange={handleChangeTextField}
              rows={4}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setTextFieldValue({
                    ...textFieldValue,
                    main: "",
                  });
                }}
              >
                {t("components.writerForm.reset")}
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={handleClickMainAdd}
                disabled={textFieldValue.main === ""}
                sx={{
                  width: "100px",
                }}
              >
                {" "}
                {t("components.writerForm.add")}{" "}
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {formValues.highlightText.length !== 0 && (
            <Divider
              sx={{
                mt: 4,
              }}
            >
              <Typography variant="subtitle2">
                {t("components.writerForm.highlight phrase")}
              </Typography>
            </Divider>
          )}
          {formValues.highlightText.map((highlight, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                borderRadius: "6px",
                flexDirection: "row",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Box key={index}>
                <Typography
                  variant="body2"
                  sx={{
                    textWrap: "balance",
                    wordBreak: "break-all",
                  }}
                >
                  {highlight}
                </Typography>
              </Box>
              <Button
                onClick={() => {
                  handleDeleteHighlight(index);
                }}
              >
                <RemoveCircleIcon />
              </Button>
            </Box>
          ))}
          {formValues.bodyText.length !== 0 && (
            <Divider
              sx={{
                mt: 4,
              }}
            >
              <Typography variant="subtitle2">
                {t("components.writerForm.body text")}
              </Typography>
            </Divider>
          )}
          {formValues.bodyText.map((body, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                borderRadius: "6px",
                flexDirection: "row",
                whiteSpace: "pre-wrap",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textWrap: "balance",
                  wordBreak: "break-all",
                }}
              >
                {" "}
                {body}
              </Typography>
              <Button
                onClick={() => {
                  handleDeleteMain(index);
                }}
              >
                <RemoveCircleIcon />
              </Button>
            </Box>
          ))}
        </Box>
        <Box className="nrBtnWrap">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={handleSave}
              sx={{
                width: "120px",
              }}
            >
              {t("components.writerForm.temporary storage")}
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              fontSize: "0.8rem",
            }}
          >
            <Typography
              variant="subtitle1"
              color="primary"
            >{`${20}/20`}</Typography>
            <Typography variant="caption">이용 가능 횟수</Typography>
            <Typography variant="caption">밤 12 시에 초기화 됩니다.</Typography>
          </Box> */}
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {t("components.writerForm.create an article")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
