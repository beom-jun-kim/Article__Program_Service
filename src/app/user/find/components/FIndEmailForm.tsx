"use client";

// ** Mui Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { GoPerson } from "react-icons/go";
import { ICompany, ICountry } from "../../join/type";
import { LuPhoneCall } from "react-icons/lu";
import { useCountdown } from "usehooks-ts";
import { toast } from "react-toastify";
import { postEmailSms, postFindEmail } from "../api";
import "dayjs/locale/ko";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/client";

export default function FindEmailForm({
  countryData,
  companyData,
}: {
  countryData: ICountry[];
  companyData: ICompany[];
}) {
  const { t } = useTranslation();
  const [formValue, setFormValue] = useState<{
    phoneNumber: string;
    inputCode: string;
    userName: string;
    birth: Dayjs;
    countryCode: string;
    companySeq: string;
  }>({
    phoneNumber: "",
    inputCode: "",
    userName: "",
    birth: dayjs(),
    countryCode: "",
    companySeq: "",
  });

  const [submitSuccessCount, setSubmitSuccessCount] = useState(0);

  const router = useRouter();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

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

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60 * 3,
      intervalMs: 1000,
    });

  const formateCount = dayjs()
    .startOf("day")
    .add(count, "second")
    .format("mm:ss");

  const handleSubmit = async () => {
    if (submitSuccessCount === 0) {
      const parseBirth = formValue.birth.format("YYYY-MM-DD");
      const data = await postEmailSms({
        userName: formValue.userName,
        companySeq: formValue.companySeq,
        birth: parseBirth,
      });
      if (data.code == "1111") {
        toast.success("인증번호가 발송되었습니다.");
        setSubmitSuccessCount(1);
        startCountdown();
      } else {
        toast.error("인증번호 요청에 실패했습니다.");
      }
    }

    if (submitSuccessCount === 1) {
      const parseBirth = formValue.birth.format("YYYY-MM-DD");
      const data = await postFindEmail({
        phoneNumber: formValue.phoneNumber,
        inputCode: formValue.inputCode,
        userName: formValue.userName,
        birth:
          parseBirth.split("-")[0] +
          parseBirth.split("-")[1] +
          parseBirth.split("-")[2],
        countryCode: formValue.countryCode,
        companySeq: formValue.companySeq.toString(),
      });
      if (data.code == "1111") {
        stopCountdown();
        toast.success("이메일 찾기 성공");
        router.push(`/user/find/success-email?email=${data.emails}`);
      } else {
        toast.error("입력하신 정보를 확인해 주세요.");
      }
    }
  };

  const handleClickResend = async () => {
    const parseBirth = formValue.birth.format("YYYY-MM-DD");
    const data = await postEmailSms({
      userName: formValue.userName,
      companySeq: formValue.companySeq,
      birth: parseBirth,
    });
    if (data.code == "1111") {
      toast.success("인증번호가 재발송되었습니다.");
      resetCountdown();
    } else {
      toast.error("인증번호 요청에 실패했습니다.");
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" color={"primary"}>
      {t("components.header.findId")}
      </Typography>
      <TextField
        name="userName"
        type="text"
        placeholder={t("components.header.name/ko")}
        value={formValue.userName}
        onChange={handleChangeInput}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <GoPerson size={20} color="grey" style={{ marginRight: "10px" }} />
          ),
        }}
      />
      <FormControl fullWidth size="small">
        <InputLabel id="company-select-label">{t("components.writerForm.select your company")}</InputLabel>
        <Select
          labelId="company-select-label"
          size="small"
          label={t("components.writerForm.select your company")}
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
            <MenuItem key={company.CompanySeq} value={company.CompanySeq || ""}>
              {company.CompanyName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          label={t("components.header.birth")}
          value={formValue.birth as dayjs.Dayjs}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
          onChange={(date) => {
            setFormValue({
              ...formValue,
              birth: date as dayjs.Dayjs,
            });
          }}
        />
      </LocalizationProvider>
      <FormControl fullWidth size="small">
        <InputLabel id="select-label">{t("components.header.select country")}</InputLabel>
        <Select
          labelId="select-label"
          name="countryCode"
          size="small"
          value={formValue.countryCode}
          label={t("components.header.select country")}
          onChange={(e) => {
            handleChangeInput(e as any);
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
        name="phoneNumber"
        placeholder={t("components.header.phone")}
        value={formValue.phoneNumber}
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
            value={formValue.inputCode}
            onChange={(e) => {
              setFormValue({
                ...formValue,
                inputCode: e.target.value,
              });
            }}
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
      <Button
        onClick={handleSubmit}
        fullWidth
        variant="contained"
        sx={{
          py: 1,
        }}
      >
        {submitSuccessCount === 1 ? t("components.header.findEmail") : t("components.header.authentication number request")}
      </Button>
    </Box>
  );
}
