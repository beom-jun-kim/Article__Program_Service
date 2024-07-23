import { cookies } from "next/headers";
import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { getUser } from "../../../app/api";
import SettingForm from "./component/SettingForm";
import UserInfo from "../setting/component/userInfo";

export default async function Setting() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  const user = await getUser(token, refreshToken);
  const userData = {
    username: user.result[0].username,
    email: user.result[0].email,
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "80vh",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          mt: 12,
          width: 600,
        }}
      >
        <Box sx={{ backgroundColor: grey[100], width: "100%", display: "flex", flexDirection: "column", borderRadius: 4, padding: 4, gap: 4, }} >
          <UserInfo 
            username={userData.username}
            email={userData.email}
          />
          <SettingForm token={token} refreshToken={refreshToken} />
        </Box>
      </Box>
    </Box>
  );
}