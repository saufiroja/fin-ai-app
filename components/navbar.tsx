"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Avatar } from "@heroui/avatar";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { siteConfig } from "@/config/site";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { getUserMe } from "@/lib/redux/userSlice";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.user);

  // Fetch user data when component mounts
  useEffect(() => {
    if (token && !currentUser) {
      dispatch(getUserMe(token));
    }
  }, [token, currentUser, dispatch]);

  // Get first letter of user's name or default to "U"
  const getAvatarInitial = () => {
    if (currentUser?.full_name) {
      return currentUser.full_name.charAt(0).toUpperCase();
    }
    if (currentUser?.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    if (currentUser?.avatar) {
      return currentUser.avatar.toUpperCase();
    }

    return "U";
  };

  return (
    <HeroUINavbar
      isMenuOpen={menuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">Fin AI</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <div className="flex gap-4 items-center">
          <NextLink href="/setting">
            <Avatar
              isBordered
              className="text-white font-semibold"
              color="primary"
              name={getAvatarInitial()}
              size="sm"
            />
          </NextLink>
        </div>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                href={item.href}
                size="lg"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
