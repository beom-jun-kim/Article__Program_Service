"use client";

import { Box, Typography } from "@mui/material";
import { useTranslation } from "@/i18n/client";

export default function UserInfo({
  username,
  email,
}: {
  username:string;
  email:string;
}) {
  
  const { t } = useTranslation();

  return (
    <Box>
        <Typography variant="h6" color={"primary"} sx={{ fontWeight: "bold", }} >
            {t("components.setting.userInfo")}
        </Typography>
        <Box>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "gray", }} >
                {t("components.setting.username")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", }} >
                {username}
            </Typography>
        </Box>
        <Box>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "gray", }} >
                {t("components.setting.user email")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", }} >
                {email}
            </Typography>
        </Box>
    </Box>
  );
}
