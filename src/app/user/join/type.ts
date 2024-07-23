import { Dayjs } from "dayjs";

export interface IJoinForm {
  email: string;
  Birth: string | Dayjs;
  LoginPwd: string;
  Gender: string;
  Phone: string;
  passwordConfirm?: string;
  NameKor: string;
  NameEng: string;
  CompanySeq: string;
}

export interface ILoginForm {
  email: string;
  password: string;
  autoLogin: boolean;
  company: string;
}

export interface ICountry {
  CountrySeq: string;
  PhoneCode: string;
  CountryName: string;
}

export interface ISelectedCountry {
  CountrySeq: string;
  PhoneCode: string;
}

export interface ICompany {
  CompanyName: string;
  CompanySeq: string;
}
