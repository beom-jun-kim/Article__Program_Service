export const getTmpArticle = async ({
  createDate,
  token,
  refreshToken,
}: {
  createDate: string;
  token: string;
  refreshToken:string;
}) => {
  try {
    const response = await fetch(
      `/api/post/AiNewsTmpDetail?createDate=${createDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}; refreshToken=${refreshToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const postSaveTmpArticle = async ({
  articleData,
  token,
  refreshToken,
}: {
  articleData: any;
  token: string;
  refreshToken:string;
}) => {
  const response = await fetch(`/api/post/AiNewstmpSave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}; refreshToken=${refreshToken}`,
    },
    body: JSON.stringify(articleData),
  });
};

export const postNewAiNews = async ({
  articleData,
  token,
  refreshToken,
}: {
  articleData: any;
  token: string;
  refreshToken:string;
}) => {
  const response = await fetch(`/api/post/AiNewsCreate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}; refreshToken=${refreshToken};`,
    },
    body: JSON.stringify(articleData),
  });

  const data = await response.json();
  return data;
};

export const deleteTmpArticle = async ({
  createDate,
  token,
  refreshToken,
}: {
  createDate: string;
  token: string;
  refreshToken:string;
}) => {
  const response = await fetch(
    `/api/post/AiNewsDetail?createDate=${createDate}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const deleteMainText = async ({
  createDate,
  mainSerl,
  token,
  refreshToken,
}: {
  createDate: string;
  mainSerl: string;
  token: string;
  refreshToken:string;
}) => {
  const response = await fetch(
    `/api/post/Mainserl?createDate=${createDate}&mainSerl=${mainSerl}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const deleteHighlightText = async ({
  createDate,
  highlightserl,
  token,
  refreshToken,
}: {
  createDate: string;
  highlightserl: string;
  token: string;
  refreshToken:string;
}) => {
  const response = await fetch(
    `/api/post/Highlightserl?createDate=${createDate}&highlightserl=${highlightserl}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};