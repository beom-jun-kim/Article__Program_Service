"use client";

import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import {
  deleteHighlightText,
  deleteMainText,
  deleteTmpArticle,
  getTmpArticle,
  postNewAiNews,
  postSaveTmpArticle,
} from "../api";
import { toast } from "react-toastify";
import { useTranslation } from "@/i18n/client";

export default function NAWriterEditForm({
  category,
  articleType,
  token,
  refreshToken,
}: {
  category: string[];
  articleType: string[];
  token: string;
  refreshToken: string;
}) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<{
    category: string;
    articleFormat: string;
    highlight: {
      HighlightSerl: string;
      Highlight: string;
    }[];
    body: {
      MainSerl: string;
      Main: string;
    }[];
    createdAt: string;
  }>({
    category: "",
    articleFormat: "",
    highlight: [],
    body: [],
    createdAt: "",
  });

  const [textFieldValue, setTextFieldValue] = useState({
    highlight: "",
    main: "",
  });
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const createdAt = searchParams.get("createdAt");

  useEffect(() => {
    const getTmpArticleData = async () => {
      const response = await getTmpArticle({
        createDate: createdAt as string,
        token: token,
        refreshToken: refreshToken,
      });

      const parsedTmpData = {
        category: response.result.KeyWordType || "",
        articleFormat: response.result.FormatType || "",
        createdAt: response.result.CreateDateTime || "",
        highlight: response.highlight?.map((arc: any) => {
          return {
            HighlightSerl: arc.HighlightSerl,
            Highlight: arc.Highlight,
          };
        }),
        body: response.main?.map((arc: any) => {
          return {
            MainSerl: arc.MainSerl,
            Main: arc.Main,
          };
        }),
      };
      setFormValues(parsedTmpData);
    };

    try {
      setLoading(true);
      getTmpArticleData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [createdAt]);

  // useEffect(() => {
  //   console.log("useEffect");
  //   const check = isDeleted(formValues);
  //   if (check && formValues.category) {
  //     router.push("/service/nawriter");
  //     toast.success("임시 저장된 기사가 삭제되었습니다.");
  //   }
  // }, [formValues]);

  const handleChangeSelect = (event: SelectChangeEvent<string>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value as string,
    });
    setIsChanged(true);
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
      highlight: [
        ...formValues.highlight,
        {
          HighlightSerl: "",
          Highlight: textFieldValue.highlight,
        },
      ],
    });
  };

  const handleClickMainAdd = () => {
    setFormValues({
      ...formValues,
      body: [
        ...formValues.body,
        {
          MainSerl: "",
          Main: textFieldValue.main,
        },
      ],
    });
  };

  const handleDeleteTmpArticle = async () => {
    try {
      await deleteTmpArticle({
        createDate: formValues.createdAt,
        token: token,
        refreshToken: refreshToken,
      });
      toast.success("임시 저장된 기사가 삭제되었습니다.");
      router.push("/service/nawriter");
    } catch (error) {
      toast.error("임시 저장된 기사 삭제에 실패했습니다.");
      console.error(error);
    }
  };

  // const isDeleted = (formValues: any) => {
  //   const highLength = formValues.highlight.filter(
  //     (highlight: any) => highlight.HighlightSerl !== ""
  //   ).length;
  //   const bodyLength = formValues.body.filter(
  //     (body: any) => body.MainSerl !== ""
  //   ).length;

  //   return highLength === 0 && bodyLength === 0;
  // };

  const handleDeleteHighlight = async ({
    index,
    HighlightSerl,
  }: {
    index: number;
    HighlightSerl: string;
  }) => {
    try {
      if (HighlightSerl !== "") {
        await deleteHighlightText({
          createDate: formValues.createdAt,
          highlightserl: HighlightSerl,
          token: token,
          refreshToken: refreshToken,
        });
      }
      const newHighlightText = formValues.highlight.filter(
        (_, i) => i !== index
      );
      setFormValues({
        ...formValues,
        highlight: newHighlightText,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMain = async ({
    index,
    mainSerl,
  }: {
    index: number;
    mainSerl: string;
  }) => {
    try {
      if (mainSerl !== "") {
        await deleteMainText({
          createDate: formValues.createdAt,
          mainSerl: mainSerl,
          token: token,
          refreshToken: refreshToken,
        });
      }
      const newBodyText = formValues.body.filter((_, i) => i !== index);
      setFormValues({
        ...formValues,
        body: newBodyText,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const parseHighlightText = formValues.highlight.slice(1);
  const parseBodyText = formValues.body.slice(1);

  const HighlightSave = parseHighlightText.map((highlight, index) => {
    return {
      category: formValues.category,
      articleFormat: formValues.articleFormat,
      highlightTextSerl: highlight.HighlightSerl.toString(),
      highlightText: highlight.Highlight,
      bodySerl: "",
      bodyText: "",
      createDate: formValues.createdAt,
    };
  });

  const Highlight = parseHighlightText.map((highlight, index) => {
    return {
      ...formValues,
      highlightText: highlight.Highlight,
      bodyText: "",
      bodySerl: "",
      HighlightSerl: "",
      createDate: "",
    };
  });

  const MainSave = parseBodyText.map((body, index) => {
    return {
      category: formValues.category,
      articleFormat: formValues.articleFormat,
      highlightTextSerl: "",
      highlightText: "",
      bodySerl: body.MainSerl.toString(),
      bodyText: body.Main,
      createDate: formValues.createdAt,
    };
  });

  const Main = parseBodyText.map((body, index) => {
    return {
      ...formValues,
      highlightText: "",
      bodyText: body.Main,
      bodySerl: "",
      HighlightSerl: "",
      createDate: "",
    };
  });

  const createData = [
    {
      ...formValues,
      highlightText: formValues.highlight.length > 0 ? formValues.highlight[0].Highlight : "",
      bodyText: formValues.body.length > 0 ? formValues.body[0].Main : "",
      bodySerl: "",
      HighlightSerl: "",
      createDate: "",
    },
    ...Highlight,
    ...Main,
  ];
  const tmpSaveData = [
    ...Highlight.filter((data) => data.HighlightSerl === ""),
    ...Main.filter((data) => data.bodySerl === ""),
  ];

  const createDataSave = [...Highlight, ...Main];
  const tmpSaveDataSave = [
    ...HighlightSave.filter((data) => data.highlightTextSerl === ""),
    ...MainSave.filter((data) => data.bodySerl === ""),
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const articleData = await postNewAiNews({
        articleData: createData,
        token: token,
        refreshToken: refreshToken,
      });
      const createDate = articleData?.result[articleData?.result.length - 1];
      const aiResultDate = articleData.aiCreateDate;
      router.push(
        `/service/nawriter/ai-news?createDate=${createDate}&aiResultDate=${aiResultDate}`
      );
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const data = isChanged ? createDataSave : tmpSaveDataSave;
    try {
      setLoading(true);
      const saveData = await postSaveTmpArticle({
        articleData: data,
        token: token,
        refreshToken: refreshToken,
      });
      toast.success("임시 저장되었습니다.");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    formValues.highlight.length === 0 ||
    formValues.body.length === 0 ||
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
        width: "100%",
        minWidth: "520px",
      }}
    >
      {loading && <Loading />}
      <Typography
        variant="h6"
        color={"primary"}
        sx={{
          fontWeight: "bold",
        }}
      >
        {t("components.writerForm.temporary article modifications")}
      </Typography>
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
            width: "100%",
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
              value={formValues.category || ""}
              label={t("components.writerForm.keyword")}
              onChange={handleChangeSelect}
            >
              {category.map((category, index) => (
                <MenuItem key={category} value={category}>
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
              label={t("components.writerForm.article form")}
              onChange={handleChangeSelect}
            >
              {articleType.map((type, index) => (
                <MenuItem key={type} value={type || ""}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "50%",
            pl: 8,
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
              sx={{
                width: "100px",
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
              sx={{
                width: "100px",
              }}
            >
              {t("components.writerForm.reset")}
            </Button>
            <Button
              variant="contained"
              size="small"
              disabled={textFieldValue.main === ""}
              onClick={handleClickMainAdd}
              sx={{
                width: "100px",
              }}
            >
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
        {formValues.highlight.length !== 0 && (
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
        {formValues.highlight.map((data, index) => (
          <Box
            key={`${data.HighlightSerl}-${index}`}
            sx={{
              display: "flex",
              backgroundColor: "#fafafa",
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
                {data.Highlight}
              </Typography>
            </Box>
            <Button
              onClick={() => {
                handleDeleteHighlight({
                  index,
                  HighlightSerl: data.HighlightSerl,
                });
              }}
            >
              <RemoveCircleIcon />
            </Button>
          </Box>
        ))}
        {formValues.body.length !== 0 && (
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
        {formValues.body.map((data, index) => (
          <Box
            key={`${data.MainSerl}-${index}`}
            sx={{
              display: "flex",
              backgroundColor: "#fafafa",
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
              {data.Main}
            </Typography>
            <Button
              onClick={() => {
                handleDeleteMain({
                  index,
                  mainSerl: data.MainSerl,
                });
              }}
            >
              <RemoveCircleIcon />
            </Button>
          </Box>
        ))}
      </Box>
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
        <Button
          variant="outlined"
          color="error"
          size="large"
          onClick={handleDeleteTmpArticle}
          sx={{
            width: "120px",
          }}
        >
          {t("components.writerForm.delete")}
        </Button>
      </Box>
    </Box>
  );
}
