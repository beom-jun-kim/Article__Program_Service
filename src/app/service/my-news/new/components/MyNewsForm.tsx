"use client";

// ** Mui Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteMyNews, postMyNews } from "../../api";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/components/Loading";
import { useTranslation } from "@/i18n/client";

export default function MyNewsForm({
  myNewsSeq,
  title,
  content,
  category,
  categoryData,
  token,
  refreshToken,
}: {
  myNewsSeq: string;
  title: string;
  content: string;
  category: string[];
  categoryData: string;
  token: string;
  refreshToken: string;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [formValues, setFormValues] = useState({
    category: categoryData || "",
    title: title || "",
    content: content || "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await postMyNews({
        ...formValues,
        myNewsSeq,
        token: token as string,
      });
      toast.success("저장되었습니다.");
      router.push("/service/my-news");
      router.refresh();
    } catch (error) {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickDelete = async () => {
    try {
      setLoading(true);
      await deleteMyNews({
        myNewsSeq: myNewsSeq,
        token: token,
        refreshToken: refreshToken,
      });
      toast.success("삭제되었습니다.");
      router.push("/service/my-news");
      router.refresh();
    } catch (error) {
      toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const disabled =
    !formValues.category || !formValues.title || !formValues.content;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        mt: 6,
        padding: 2,
        gap: 2,
      }}
    >
      {loading && <Loading />}
      <Typography variant="h6" color="primary">
        My News
      </Typography>

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
          {Array.isArray(category) ? (
            category.map((cat, index) => (
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
        label={t("components.writerForm.article text")}
        value={formValues.content}
        onChange={handleChangeInput}
        fullWidth
        multiline
        rows={10}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          gap: 2,
        }}
      >
        {myNewsSeq && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClickDelete}
          >
            {t("components.writerForm.delete")}
          </Button>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={disabled}
        >
          {t("components.grid.save")}
        </Button>
      </Box>
    </Box>
  );
}
