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
import Image from "next/image";
import LogoImage from "@/assets/images/NAWriter_logo.png";
import { useCallback, useState } from "react";
import { LuMail, LuLock } from "react-icons/lu";
import { postLogin } from "../../api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ICompany } from "../../join/type";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";

export default function LoginForm({
  companyData,
}: {
  companyData: ICompany[];
}) {
  const [formValue, setFormValue] = useState({
    userId: "",
    password: "",
    companySeq: "",
  });
  const router = useRouter();
  const { t } = useTranslation();
  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValue({
        ...formValue,
        [name]: value,
      });
    },
    [formValue]
  );

  const handleSubmit = async () => {
    try {
      const data = await postLogin(formValue);
      if (data.code === 1111) {
        toast.success("로그인 성공");
        router.push("/service/nawriter");
      }
    } catch (error) {
      toast.error("아이디 또는 비밀번호가 일치하지 않습니다");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        // width: "",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Link href="/user/login">
        <Image src={LogoImage} width={160} alt="logo-img" priority />
      </Link>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Box
          sx={{
            mt: 4,
            width: "360px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <TextField
            name="userId"
            type="email"
            placeholder="E-MAIL"
            size="small"
            fullWidth
            required
            value={formValue.userId}
            onChange={handleChangeInput}
            InputProps={{
              startAdornment: (
                <LuMail
                  size={20}
                  color="grey"
                  style={{ marginRight: "10px" }}
                />
              ),
            }}
          />
          <TextField
            name="password"
            type="password"
            placeholder="PASSWORD"
            value={formValue.password}
            onChange={handleChangeInput}
            size="small"
            fullWidth
            required
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <LuLock
                  size={20}
                  color="grey"
                  style={{ marginRight: "10px" }}
                />
              ),
            }}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="company-select-label">
              {t("components.writerForm.select your company")}
            </InputLabel>
            <Select
              labelId="company-select-label"
              size="small"
              label={t("components.writerForm.select your company")}
              required
              value={formValue.companySeq}
              onChange={(e) =>
                setFormValue({
                  ...formValue,
                  companySeq: e.target.value as string,
                })
              }
              fullWidth
            >
              {companyData.map((company) => (
                <MenuItem
                  key={company.CompanyName}
                  value={company.CompanySeq.toString() || ""}
                >
                  {company.CompanyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ height: "40px" }}
          >
            {t("components.header.login")}
          </Button>
        </Box>
      </form>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Link href="/user/join">
          <Typography variant="subtitle2" color="primary">
            {t("components.header.join")}
          </Typography>
        </Link>
        <Divider orientation="vertical" flexItem />
        <Link href="/user/find">
          <Typography variant="subtitle2" color="primary">
            {t("components.header.find your email/password")}
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
