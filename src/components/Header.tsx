"use client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  AppBar,
  IconButton,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useTranslation } from "@/i18n/client";
import CloseIcon from "@mui/icons-material/Close";
import { cookieName } from "@/i18n/settings";
import LogoImage from "@/assets/images/NAWriter_logo.png";
import { logout } from "@/app/api";

// 메뉴 아이콘 import
import { BiUser } from "react-icons/bi";
import { TfiClip } from "react-icons/tfi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { HiOutlineCog } from "react-icons/hi";
import { IoMdMenu } from "react-icons/io";

const StyledAppBar = styled(AppBar)<{ muitheme: Theme }>`
  background-color: transparent;
  .css-y5vr6w-MuiButtonBase-root-MuiListItemButton-root.Mui-selected {
    background: #fff;
  }
  .header-toolbar {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 2rem 1rem;
    img[alt="logo-img"] {
      cursor: pointer;
    }

    .menu-wrapper {
      flex-direction: column;
      width: 100%;
    }
    .menu-wrapper li {
      display: block;
      width: 100%;
      text-align: left;
    }
    .menu-wrapper li a {
    }
    .menu-wrapper li a p {
      display: flex;
      align-items: center;
    }
    .menu-wrapper li a p svg {
      margin-right: 12px;
    }
    .menu-wrapper,
    .menu-Bnav {
      display: flex;
      justify-content: start;
      align-items: center;
      list-style-type: none;
      padding: 1rem 0;
      gap: 1rem;
      margin-top: 5rem;

      &.menu-wrapper {
        margin-top: 5rem;
        padding: 1rem;
        max-width: 200px;
      }

      &.menu-Bnav {
        padding: 0;
        gap: 20px;
      }

      li {
        a {
          text-decoration: none;

          .menu-text {
            font-size: 1.25rem;
            text-align: left;

            &.menu-wrapper {
              font-size: 1.5rem;
            }
          }
        }

        &[data-selected="true"] {
          .menu-text {
            color: ${({ muitheme }) => muitheme.palette.primary.light};
            font-weight: bold;
          }
        }

        .lng-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1em;
          height: 1em;
        }
      }
    }
  }
`;

const MenuItem = ({
  children,
  href = "/",
  selected = false,
  icon: Icon,
}: {
  children?: string;
  href?: string;
  selected?: boolean;
  icon?: React.ComponentType<{ style?: React.CSSProperties }>;
}) => (
  <li data-selected={selected}>
    <Link href={href}>
      <Typography className="menu-text">
        {Icon && <Icon style={{ marginRight: "12px" }} />}
        {children}
      </Typography>
    </Link>
  </li>
);

type MenuOption = {
  text: string;
  href: string;
  icon?: React.ComponentType;
  activePaths?: string[];
};

const Header = () => {
  const [userPosType, setUserPosType] = useState<"G" | "A" | "N">();
  const [isClient, setIsClient] = useState(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);

  const theme = useTheme();
  const pathname = usePathname();
  const { i18n, t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isActive = (href: string, activePaths?: string[]) => {
    if (pathname === href) return true;
    return activePaths?.some((path) => {
      const regex = new RegExp(`^${path.replace(/:\w+/g, "\\w+")}$`);
      return regex.test(pathname);
    });
  };

  const [cookies, setCookies, removeCookie] = useCookies([
    cookieName,
    "theme",
    "token",
    "connect.sid",
  ]);

  const authenticated = useMemo(() => !/^\/user/.test(pathname), [pathname]);

  const handleChangeLang = () => {
    const { lng } = cookies;
    i18n.changeLanguage(lng);
    setCookies("lng", lng === "ko" ? "en" : "ko", { path: "/" });
  };

  const handleChangeTheme = () => {
    setCookies("theme", theme.palette.mode === "light" ? "dark" : "light", {
      path: "/",
    });
  };

  const handleClickLogout = async () => {
    try {
      const data = await logout();
      router.push("/user/login");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    fetch("/manage/api/v1/userinfo")
      .then((res) => res.json())
      .then(({ userPosType }) => setUserPosType(userPosType));
  }, [authenticated]);

  const hiddenPaths = [
    "/user/login",
    "/user/join",
    "/user/find",
    "/user/find/success-email",
    "/user/find/success-password",
  ];
  if (hiddenPaths.includes(pathname)) return null;

  const menuOptions: MenuOption[] = [
    userPosType &&
      userPosType !== "N" && {
        text: t("components.header.menu.manage"),
        href: "/manage",
        icon: BiUser,
      },
    {
      text: t("components.header.menu.nawriter"),
      href: "/service/nawriter",
      activePaths: ["/service/nawriter", "/service/nawriter/ai-news"],
      icon: HiOutlineNewspaper,
    },
    {
      text: t("components.header.menu.attached"),
      href: "/service/nawriter/attached-materials",
      activePaths: [
        "/service/nawriter/attached-materials",
        "/service/nawriter/attachment",
      ],
      icon: TfiClip,
    },
    {
      text: t("components.header.menu.myNews"),
      href: "/service/my-news",
      activePaths: ["/service/my-news/edit/:id"],
      icon: HiOutlineNewspaper,
    },
    {
      text: t("components.header.menu.setting"),
      href: "/service/setting",
      icon: HiOutlineCog,
    },
  ].filter(Boolean) as MenuOption[];

  const handleHamMenu = () => {
    setMobileMenu((menu) => !menu);
  };

  return (
    <StyledAppBar
      position="sticky"
      muitheme={theme}
      sx={{
        zIndex: 10,
      }}
    >
      <div className="m_nav">
        <Link href="/user/login">
          <Image className="Logo" src={LogoImage} alt="logo-img" width={100} priority />
        </Link>
        {mobileMenu ? (
          <CloseIcon onClick={handleHamMenu}></CloseIcon>
        ) : (
          <IoMdMenu className="ioMenuBtn" onClick={handleHamMenu} />
        )}
      </div>
      <Toolbar className={`header-toolbar ${mobileMenu ? "menu_active" : ""}`}>
        <Link href="/user/login">
          <Image className="Logo" src={LogoImage} alt="logo-img" width={100} priority />
        </Link>
        {isClient && (
          <ul className="menu-wrapper" style={{ flex: 1 }}>
            {authenticated &&
              menuOptions.map(({ text, href, icon, activePaths = [] }, i) => (
                <MenuItem
                  key={i}
                  href={href}
                  selected={isActive(href, activePaths)}
                  icon={icon}
                >
                  {text}
                </MenuItem>
              ))}
          </ul>
        )}
        <ul className="menu-Bnav" style={{ gap: "5px" }}>
          <li>
            <Tooltip title={t("components.header.themeBtnTooltip")}>
              <IconButton onClick={handleChangeTheme}>
                <div className="lng-btn">
                  {theme.palette.mode === "light" && <LightModeIcon />}
                  {theme.palette.mode === "dark" && <DarkModeIcon />}
                </div>
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip title={t("components.header.lngBtnTooltip")}>
              <IconButton onClick={handleChangeLang}>
                <div className="lng-btn">
                  <Typography variant="h6">
                    {t("components.header.lngBtnText")}
                  </Typography>
                </div>
              </IconButton>
            </Tooltip>
          </li>
          {authenticated && (
            <li>
              <Tooltip title={t("components.header.logoutBtnTooltip")}>
                <IconButton onClick={handleClickLogout}>
                  <MeetingRoomIcon />
                </IconButton>
              </Tooltip>
            </li>
          )}
        </ul>
      </Toolbar>
      {isClient && (
        <ul className="m-menu-wrapper" style={{ flex: 1 }}>
          {authenticated &&
            menuOptions.map(({ text, href, icon, activePaths = [] }, i) => (
              <MenuItem
                key={i}
                href={href}
                selected={isActive(href, activePaths)}
                icon={icon}
              >
                {text}
              </MenuItem>
            ))}
        </ul>
      )}
    </StyledAppBar>
  );
};

export default Header;
