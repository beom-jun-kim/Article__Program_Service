const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getArticleList = async ({
  // userSeq,
  // companySeq,
  token,
  refreshToken,
}: {
  // userSeq: string;
  // companySeq: string;
  token: string;
  refreshToken:string;
}) => {
  try {
    const response = await fetch(`${baseUrl}/api/post/selectpost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
      // body: JSON.stringify({
      //   companySeq: companySeq,
      //   userSeq: userSeq,
      // }),
    });
    const data = await response.json();
    return { tmpList: data.result, aiList: data.aiResult };
  } catch (error) {
    console.error(error);
  }
};

export const getCategory = async ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/catagory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
  }
};

export const getArticleType = async ({ token,refreshToken }: { token: string; refreshToken:string; }) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/type`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
  }
};
