const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const postAttachList = async ({
  articleData,
  token,
  refreshToken,
}: {
  articleData: any;
  token: string;
  refreshToken:string;
}) => {
  const response = await fetch(`/api/comment/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}; refreshToken=${refreshToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      cateGory: articleData.cateGory,
      resText: articleData.resText,
    }),
  });
  const data = await response.json();
  return data;
};

export const postSummarize = async ({
  attachments,
  token,
  refreshToken,
}: {
  attachments: { referenceText: string; referenceFrom: string }[];
  token: string;
  refreshToken: string;
}) => {
  const response = await fetch(`/api/comment/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      Cookie: `token=${token}; refreshToken=${refreshToken};`,
    },

    body: JSON.stringify(attachments),
  });

  const data = await response.json();
  return data;
};
