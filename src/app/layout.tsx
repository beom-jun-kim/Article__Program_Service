import "@/init";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { dir, t } from "i18next";
import GlobalStyles from "@/styled/GlobalStyles";
import Theme from "@/styled/Theme";
import Header from "@/components/Header";
import { fallbackLng } from "@/i18n/settings";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "NA Writer",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = cookies();
  const lng = cookieStore.get("lng")?.value;

  return (
    <html lang={lng || fallbackLng} dir={dir(lng || fallbackLng)}>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/rdg.css" />
      </head>
      <Theme>
        <GlobalStyles />
        <body>
          <AppRouterCacheProvider>
            <div id="root">
              <Header />
              <div id="main">
                <div className="sidebar-wrapper">
                  <h2 className="admTitle">현재 페이지명</h2>
                </div>
                {children}
              </div>
            </div>
          </AppRouterCacheProvider>
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </body>
      </Theme>
    </html>
  );
};

export default RootLayout;
