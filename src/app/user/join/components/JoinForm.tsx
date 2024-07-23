"use client";

/***** Library *****/
import { useState } from "react";
import Link from "next/link";
import { LuMail, LuLock, LuPhoneCall } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCountdown } from "usehooks-ts";
import Image from "next/image";
import LogoImage from "@/assets/images/NAWriter_logo.png";
import "dayjs/locale/ko";

/***** 타입 파일 경로 *****/
import { IJoinForm, ISelectedCountry, ICountry, ICompany } from "../type";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { postJoin, postPhoneSms, postPhoneValidation } from "../api";
import dayjs from "dayjs";


import { useTranslation } from "@/i18n/client";

export function JoinForm({
  countryData,
  companyData,
}: {
  countryData: ICountry[];
  companyData: ICompany[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [formValue, setFormValue] = useState<IJoinForm>({
    email: "",
    Birth: dayjs(),
    Gender: "",
    LoginPwd: "",
    Phone: "",
    passwordConfirm: "",
    NameKor: "",
    NameEng: "",
    CompanySeq: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60 * 3,
      intervalMs: 1000,
    });

  const formateCount = dayjs()
    .startOf("day")
    .add(count, "second")
    .format("mm:ss");

  const [submitSuccessCount, setSubmitSuccessCount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<ISelectedCountry>({
    CountrySeq: "",
    PhoneCode: "",
  });

  // 회원가입 처리 로직
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formValue.email === "" ||
      formValue.LoginPwd === "" ||
      formValue.passwordConfirm === "" ||
      formValue.Phone === "" ||
      formValue.NameKor === "" ||
      formValue.NameEng === "" ||
      selectedCountry.CountrySeq === ""
    ) {
      toast.error("필수 입력값을 입력해주세요.");
      return;
    } else if (formValue.LoginPwd !== formValue.passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 1. 인증번호 요청
    if (submitSuccessCount == 0) {
      const data = await postPhoneSms(
        formValue.Phone,
        selectedCountry.PhoneCode
      );
      if (data.code == "1111") {
        setSubmitSuccessCount((count) => count + 1); // 폼 성공 카운트 증가
        startCountdown();
      } else {
        toast.error("인증번호 요청에 실패했습니다.");
      }
      return;
    }

    // 2. 인증번호 확인
    if (submitSuccessCount === 1) {
      const data = await postPhoneValidation(
        formValue.email,
        formValue.Phone,
        selectedCountry.PhoneCode,
        verificationCode
      );
      if (data.code == "1111") {
        toast.success("인증번호 확인이 완료되었습니다.");
        setSubmitSuccessCount((count) => count + 1); // 폼 성공 카운트 증가
        stopCountdown();
      } else {
        toast.error("인증번호 확인에 실패했습니다.");
      }
    }

    // 3. 회원가입
    if (submitSuccessCount == 2) {
      if (formValue.CompanySeq === "") {
        toast.error("소속 회사를 선택해주세요.");
        return;
      }
      const birth = formValue.Birth as dayjs.Dayjs;
      const parseBirth = birth.format("YYYY-MM-DD");
      const joinData = {
        email: formValue.email,
        Birth:
          parseBirth.split("-")[0] +
          parseBirth.split("-")[1] +
          parseBirth.split("-")[2],
        LoginPwd: formValue.LoginPwd,
        NameKor: formValue.NameKor,
        NameEng: formValue.NameEng,
        Gender: formValue.Gender,
        Phone: formValue.Phone,
        CompanySeq: formValue.CompanySeq.toString(),
        CountrySeq: selectedCountry.CountrySeq,
      };

      const data = await postJoin(joinData);
      if (data.code == "1111") {
        toast.success("회원가입이 완료되었습니다.");
        router.push("/user/login/");
      } else {
        toast.error("회원가입에 실패했습니다.");
      }
    }
  };

  const handleClickResend = async () => {
    const data = await postPhoneSms(
      formValue.Phone,
      selectedCountry.PhoneCode
    );
    if (data.code == "1111") {
      toast.success("인증번호가 재발송되었습니다.");
      resetCountdown();
    } else {
      toast.error("인증번호 요청에 실패했습니다.");
    }
  };

  // 전화번호 - 숫자 키만 입력 허용
  const handlePhoneNumberKeyDown = (event: any) => {
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            minHeight: "72vh",
            display: "flex",
            width: "360px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link href="/user/login">
              <Image src={LogoImage} width={160} alt="logo-img" priority />
            </Link>
            <Typography variant="h6" color={"primary"}>
            {t("components.header.join")}
            </Typography>
          </Box>
          <TextField
            name="email"
            type="email"
            placeholder="E-MAIL"
            size="small"
            fullWidth
            value={formValue.email}
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
            name="LoginPwd"
            type="password"
            placeholder="PASSWORD"
            value={formValue.LoginPwd}
            onChange={handleChangeInput}
            size="small"
            fullWidth
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
          <TextField
            name="passwordConfirm"
            type="password"
            placeholder="PASSWORD CONFIRM"
            value={formValue.passwordConfirm}
            onChange={handleChangeInput}
            size="small"
            fullWidth
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
          <TextField
            name="NameKor"
            type="text"
            placeholder={t("components.header.name/ko")}
            value={formValue.NameKor}
            onChange={handleChangeInput}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <GoPerson
                  size={20}
                  color="grey"
                  style={{ marginRight: "10px" }}
                />
              ),
            }}
          />
          <TextField
            name="NameEng"
            type="text"
            placeholder={t("components.header.name/en")}
            value={formValue.NameEng}
            onChange={handleChangeInput}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <GoPerson
                  size={20}
                  color="grey"
                  style={{ marginRight: "10px" }}
                />
              ),
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              label={t("components.header.birth")}
              value={formValue.Birth as dayjs.Dayjs}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              onChange={(date) =>
                setFormValue({
                  ...formValue,
                  Birth: date as dayjs.Dayjs,
                })
              }
            />
          </LocalizationProvider>
          <ToggleButtonGroup
            value={formValue.Gender}
            exclusive
            fullWidth
            color="primary"
            onChange={(e, value) =>
              setFormValue({
                ...formValue,
                Gender: value,
              })
            }
          >
            <ToggleButton value="1002001">{t("components.header.men")}</ToggleButton>
            <ToggleButton value="1002002">{t("components.header.woman")}</ToggleButton>
          </ToggleButtonGroup>
          <FormControl fullWidth size="small">
            <InputLabel id="select-label">{t("components.header.select country")}</InputLabel>
            <Select
              labelId="select-label"
              size="small"
              label={t("components.header.select country")}
              value={selectedCountry.CountrySeq}
              onChange={(e) => {
                const CountrySeq = e.target.value;
                const selectedCountry = countryData.find(
                  (country) => country.CountrySeq == CountrySeq
                );
                setSelectedCountry({
                  CountrySeq: selectedCountry?.CountrySeq.toString() as string,
                  PhoneCode: selectedCountry?.PhoneCode as string,
                });
              }}
              fullWidth
            >
              {countryData.map((country) => (
                <MenuItem
                  key={country.CountryName}
                  value={country.CountrySeq || ""}
                >
                  {`${country.CountryName} ${country.PhoneCode}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="text"
            name="Phone"
            placeholder={t("components.header.phone")}
            value={formValue.Phone}
            onChange={handleChangeInput}
            onKeyDown={handlePhoneNumberKeyDown}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <LuPhoneCall
                  size={20}
                  color="grey"
                  style={{ marginRight: "10px" }}
                />
              ),
            }}
          />
          {submitSuccessCount === 1 && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TextField
                name="verificationCode"
                type="text"
                placeholder={t("components.header.authentication number")}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                size="small"
                helperText={`${formateCount} 후에 인증번호가 만료됩니다.`}
                fullWidth
              />
              <Box
                sx={{
                  width: "100px",
                }}
              >
                <Button
                  onClick={handleClickResend}
                  fullWidth
                  variant="outlined"
                  sx={{
                    py: 1,
                  }}
                >
                  {t("components.header.resend")}
                </Button>
              </Box>
            </Box>
          )}
          {submitSuccessCount === 2 && (
            <FormControl fullWidth size="small">
              <InputLabel id="company-select-label">{t("components.writerForm.select your company")}</InputLabel>
              <Select
                labelId="company-select-label"
                size="small"
                label={t("components.writerForm.select your company")}
                required
                value={formValue.CompanySeq}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    CompanySeq: e.target.value as string,
                  })
                }
                fullWidth
              >
                {companyData.map((company) => (
                  <MenuItem
                    key={company.CompanyName}
                    value={company.CompanySeq || ""}
                  >
                    {company.CompanyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: "360px", mt: 2 }}
          >
            {submitSuccessCount === 0 && t("components.header.authentication number request")}
            {submitSuccessCount === 1 && t("components.header.authentication number chk")}
            {submitSuccessCount === 2 && t("components.header.join")}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
