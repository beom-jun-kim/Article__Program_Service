// ** Mui Components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaArrowCircleRight } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";

export default async function SuccessPassword({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  if (token) redirect("/service/nawriter");

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
          비밀번호 찾기 성공!
        </Typography>
        <RiLockPasswordLine size={100} color="#2799a3" />
        <Typography variant="subtitle2">
          회원님의 이메일로 임시 비밀번호가 전송되었습니다.
        </Typography>
        <Typography variant="subtitle2">이메일 확인 부탁드립니다.</Typography>
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
