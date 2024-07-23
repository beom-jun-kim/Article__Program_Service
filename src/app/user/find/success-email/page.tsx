import { Box, Link, Typography } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaArrowCircleRight } from "react-icons/fa";
import { LuMail } from "react-icons/lu";

export default async function SuccessEmail({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  if (token) redirect("/service/nawriter");

  const email = searchParams?.email || "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pt: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          boxShadow: 1,
          width: 400,
          borderRadius: 4,
          p: 4,
        }}
      >
        <Typography variant="h6" color={"primary"}>
          이메일 찾기 성공!
        </Typography>
        <LuMail size={100} color="#2799a3" />
        <Typography variant="subtitle2">회원님의 이메일은</Typography>
        <Typography variant="subtitle2">{`${email} 입니다.`}</Typography>
      </Box>
      <Link href="/user/login">
        <Box
          sx={{
            display: "flex",
            mt: 4,
            alignItems: "center",
            gap: 1,
          }}
        >
          로그인 하러가기
          <FaArrowCircleRight />
        </Box>
      </Link>
    </Box>
  );
}
