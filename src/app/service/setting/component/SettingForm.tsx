"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useTranslation } from "@/i18n/client";

export default function SettingForm({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) {
  const [password, setPassword] = useState({ value: "", error: false });
  const [newPassword, setNewPassword] = useState({ value: "", error: false });
  const [newPasswordConfirm, setNewPasswordConfirm] = useState({
    value: "",
    error: false,
  });

  const { t } = useTranslation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!password.value) {
      toast("현재 비밀번호를 입력해주세요.", { type: "warning" });
      setPassword({ ...password, error: true });
      return;
    }
    if (!newPassword.value) {
      toast("새 비밀번호를 입력해주세요.", { type: "warning" });
      setNewPassword({ ...newPassword, error: true });
      return;
    }
    if (!newPasswordConfirm.value) {
      toast("새 비밀번호 확인란을 입력해주세요.", { type: "warning" });
      setNewPasswordConfirm({ ...newPasswordConfirm, error: true });
      return;
    }
    if (newPassword.value !== newPasswordConfirm.value) {
      toast("같은 비밀번호를 입력해주세요.", { type: "warning" });
      setNewPasswordConfirm({ ...newPasswordConfirm, error: true });
      return;
    }
    if (password.value === newPassword.value) {
      toast("현재 비밀번호와 동일한 비밀번호입니다.", { type: "warning" });
      setNewPassword({ ...newPassword, error: true });
      return;
    }

    const res = await fetch(`/api/setting/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
        // "x-refresh-token": refreshToken,
        Cookie: `token=${token}; refreshToken=${refreshToken};`,
      },
      body: JSON.stringify({
        password: password.value,
        newPassword: newPassword.value,
        newPasswordConfirm: newPasswordConfirm.value,
      }),
    });
    
    const data = await res.json();

    toast(data.message, {
      type: (() => {
        switch (Math.floor(res.status / 100)) {
          case 2:
            setPassword({ value: "", error: false });
            setNewPassword({ value: "", error: false });
            setNewPasswordConfirm({ value: "", error: false });
            return "success";
          case 4:
            return "warning";
          default:
            return "error";
        }
      })(),
    });
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
      onSubmit={handleSubmit}
    >
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "gray",
          }}
        >
          {t("components.setting.current password")}
        </Typography>
        <br />
        <TextField
          type="password"
          size="small"
          name="password"
          error={password.error}
          value={password.value}
          onChange={(e) => setPassword({ value: e.target.value, error: false })}
        />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "gray",
          }}
        >
          {t("components.setting.new password")}
        </Typography>
        <br />
        <TextField
          type="password"
          size="small"
          name="newPassword"
          error={newPassword.error}
          value={newPassword.value}
          onChange={(e) =>
            setNewPassword({ value: e.target.value, error: false })
          }
        />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "gray",
          }}
        >
          {t("components.setting.new password confirmation")}
        </Typography>
        <br />
        <TextField
          type="password"
          size="small"
          name="newPasswordConfirm"
          error={newPasswordConfirm.error}
          value={newPasswordConfirm.value}
          onChange={(e) =>
            setNewPasswordConfirm({ value: e.target.value, error: false })
          }
        />
      </Box>
      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" size="small" variant="contained">
          {t("components.setting.correction")}
        </Button>
      </Box>
    </Box>
  );
}
