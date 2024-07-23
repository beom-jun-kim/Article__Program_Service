const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const postMyNews = async (data: any) => {
  const response = await fetch("/api/myNews/myNewsInsert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${data.token}; refreshToken=${data.refreshToken};`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getMyNews = async ({
  seq,
  token,
  refreshToken,
}: {
  seq: string;
  token: string;
  refreshToken: string;
}) => {
  const response = await fetch(
    `${baseUrl}/api/myNews/myNewsDetail?myNewsSeq=${seq}`,
    {
      headers: {
        referrerPolicy: "strict-origin-when-cross-origin",
        credentials: "include",
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getMyNewsList = async ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => {
  const response = await fetch(`${baseUrl}/api/myNews/myNewsList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}; refreshToken=${refreshToken};`,
    },
    cache: "no-cache",
  });

  const data = await response.json();
  return data;
};


export const deleteMyNews = async ({
  myNewsSeq,
  token,
  refreshToken,
}: {
  myNewsSeq: string;
  token: string;
  refreshToken:string;
}) => {
  const response = await fetch(
    `/api/myNews/myNewsDetail?myNewsSeq=${myNewsSeq}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
    }
  );
  const data = response.json();
  return data;
};
