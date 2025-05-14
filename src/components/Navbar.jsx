"use client";
import "Navbar.scss";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import { Button, Image, Modal } from "react-bootstrap";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";

import { themeContext } from "./CustomContexts/Contexts";
import { GetCookies, SetCookies } from "./CustomFunctions/HandleCookies";

import { Signup } from "../../AccountSettings/Signup";
import { Signin } from "../../AccountSettings/Signin";
import { Signout } from "../../AccountSettings/Signout";

import StellyHappy from "../assets/images/StellyHappy.png";
import StellyAngry from "../assets/images/StellyAngry.png";

import { HomepageLinks } from "./Links/1-Homepage";
import { HabitTrackerLinks } from "./Links/2-HabitTracker";
import { AccountSettingsLinks } from "./Links/3-AccountSettings";

export default function Navbar() {
  const { themeState, setThemeState } = useContext(themeContext);

  const pathname = usePathname();
  const [expandSidebar, setExpandSidebar] = useState(true);
  const [showDropdown, setShowDropdown] = useState([]);

  useEffect(() => {
    if (pathname === "/email-verification") {
      setExpandSidebar(false);
    }
    setShowDropdown(GetCookies("expandedLinks") || []);
  }, [pathname]);
}
