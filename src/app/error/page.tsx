import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default async function ErrorPage() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 600,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            color="primary.main"
            sx={{
              fontWeight: 500,
            }}
          >
            {"ERROR"}
          </Typography>
        </Box>
        <Typography variant="h6" component={"p"}>
          {"정보를 불러오는 중에 오류가 발생했습니다."}
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" sx={{ mt: 4 }}>
            홈으로
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
