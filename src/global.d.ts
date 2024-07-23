declare global {
  interface LoginType {
    email: string;
    password: string;
    autoLogin: boolean;
    company: string;
  }

  interface JoinType {
    email: string;
    password: string;
    passwordConfirm: string;
    koreanName: string;
    englishName: string;
    countryNumber: string;
    verificationCode: string;
    company: string;
  }
}

export {};
