"use client";

// ** Mui Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { SelectChangeEvent } from "@mui/material/Select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from '@/i18n/client';

export default function MyNewsListSearch({ category }: { category: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryQuery = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(searchQuery);

  const handleChangeCategory = (event: SelectChangeEvent) => {
    router.replace(`?category=${event.target.value}`);
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const { i18n, t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <FormControl
          sx={{
            width: "200px",
          }}
        >
          <InputLabel id="category-select-label" size="small">
            {t('components.writerForm.keyword')}
          </InputLabel>
          <Select
            size="small"
            name="category"
            labelId="category-select-label"
            id="category-select"
            value={categoryQuery || ""}
            onChange={handleChangeCategory}
            label={t('components.writerForm.keyword')}
          >
            <MenuItem value="">전체</MenuItem>
            {category.map((data, index) => (
              <MenuItem key={data} value={data}>
                {data}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label={t('components.writerForm.search word')}
          variant="outlined"
          fullWidth
          size="small"
          value={inputValue}
          onChange={handleChangeInput}
        />
        <Button
          variant="outlined"
          onClick={() => {
            router.replace(`?search=${inputValue}`);
          }}
        >
          {t('components.myNews.search')}
        </Button>
      </Box>
      <Box>
        <Button  
          variant="contained"
          color="secondary"
          onClick={() => {
            router.push(`/service/my-news/new`);
          }}
        >
          {t('components.writerForm.news registration')}
        </Button>
      </Box>
    </Box>
  );
}
