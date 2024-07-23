export const postEmailSms = async ({
  userName,
  companySeq,
  birth,
}: {
  userName: string;
  companySeq: string;
  birth: string;
}) => {
  const response = await fetch(`/api/user/findId`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName,
      companySeq,
      birth,
    }),
  });

  return response.json();
};

export const postFindEmail = async (emailData: {
  phoneNumber: string;
  inputCode: string;
  userName: string;
  birth: string;
  countryCode: string;
  companySeq: string;
}) => {
  const response = await fetch(`/api/user/find/findId/sms/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });
  const data = await response.json();
  return data;
};

export const postPasswordSms = async ({
  userName,
  companySeq,
  birth,
  email,
}: {
  userName: string;
  companySeq: string;
  birth: string;
  email: string;
}) => {
  const response = await fetch(`/api/user/findPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName,
      companySeq,
      birth,
      email,
    }),
  });

  return response.json();
};

export const postFindPassword = async (passwordData: {
  email: string;
  phoneNumber: string;
  inputCode: string;
  userName: string;
  birth: string;
  countryCode: string;
  companySeq: string;
}) => {
  const response = await fetch(`/api/user/find/password/sms/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });
  const data = await response.json();
  return data;
};
