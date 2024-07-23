const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAiArticle = async ({
  createdAt,
  aiResultDate,
  token,
  refreshToken
}: {
  createdAt: string;
  aiResultDate: string;
  token: string;
  refreshToken:string;
}) => {
  const res = await fetch(
    `${baseUrl}/api/post/AiNewsDetail?createDate=${createdAt}&aiResultDate=${aiResultDate}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
    }
  );
  const data = await res.json();
  return data;
};

export const postRegisterArticle = async ({
  userSeq,
  companySeq,
  myNewsSeq,
  title,
  content,
  category,
  token,
}: {
  userSeq: string;
  companySeq: string;
  myNewsSeq: string;
  title: string;
  content: string;
  category: string;
  token: string;
}) => {
  const res = await fetch(`/api/main/createArc/AiNewsRegister`, {
    method: "POST",
    body: JSON.stringify({
      userSeq,
      companySeq,
      myNewsSeq,
      title,
      content,
      category,
    }),
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token};`,
    },
  });
  const data = await res.json();
  return data;
};
