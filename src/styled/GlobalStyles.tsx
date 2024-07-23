"use client";
import React from "react";
import { Global, css } from "@emotion/react";
import { CssBaseline } from "@mui/material";

const GlobalStyles = () => {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Global
        styles={css`
          html,
          body,
          #root {
            width: 100%;
            margin: 0;
            padding: 0;
          }

          body {
            position: relative;
          }

          #root {
            display: flex;
            flex-direction: column;
          }

          #main {
            max-width: 100%;
            flex: 1;
            overflow: hidden;
          }
          a {
            text-decoration: none !important;
          }
        `}
      />
    </>
  );
};

export default GlobalStyles;
