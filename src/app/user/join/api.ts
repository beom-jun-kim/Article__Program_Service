import { IJoinForm } from "./type";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCountry = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/user/country`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });
    const data = await response.json();
    if (data.code === "1111") {
      return data.result;
    } else {
      // 데이터 수집 실패 처리
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCompany = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/user/company`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.code === "1111") {
      return data.result;
    } else {
      // 에러 로직
    }
  } catch (error) {
    console.error(error);
  }
};

export const postPhoneSms = async (phone: string, countryCode: string) => {
  const response = await fetch(`/api/user/sms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countryCode: countryCode,
      phoneNumber: phone,
    }),
  });
  const data = await response.json();
  return data;
};

export const postPhoneValidation = async (
  email:string,
  phoneNumber: string,
  PhoneCode: string,
  inputCode: string
) => {
  try {
    const response = await fetch(`/api/user/checkOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email:email,
        PhoneCode: PhoneCode,
        phoneNumber: phoneNumber,
        inputCode: inputCode,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const postJoin = async (data: IJoinForm) => {
  try {
    const response = await fetch(`/api/user/regist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};
