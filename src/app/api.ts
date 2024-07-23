// Note: client component에서 호출하는 api는 proxy로 처리, server components에서 사용하는 API는 직접 호출
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getUser = async (token: string , refreshToken:string) => {
  try {
    const response = await fetch(`${baseUrl}/api/setting/`, {
      headers: {
        referrerPolicy: "strict-origin-when-cross-origin",
        credentials: "include",
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
  }
};

export const logout = async () => {
  const response = await fetch(`/api/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};