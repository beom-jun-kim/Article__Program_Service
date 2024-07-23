export const postLogin = async (data: {
  userId: string;
  password: string;
  companySeq: string;
}) => {
  const response = await fetch(`/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (responseData.code === 1111) {
    return responseData;
  } else {
    throw new Error(responseData.message.msg);
  }
};
