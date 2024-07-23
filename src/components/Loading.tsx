"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";

export default function Loading() {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography
          sx={{
            color: "#fff",
            mt: 2,
          }}
        >
          최대 작업 시간은 5분 입니다.
        </Typography>
      </Box>
    </Backdrop>
  );
}
