"use client";

import { FC } from "react";
import { Switch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = (isSelected: boolean) => {
    setTheme(isSelected ? "dark" : "light");
  };

  return (
    <Switch
      isSelected={theme === "dark" && !isSSR}
      onValueChange={onChange}
      size="lg"
      color="primary"
      startContent={<SunFilledIcon size={18} />}
      endContent={<MoonFilledIcon size={18} />}
      className={clsx("", className)}
      aria-label={`Switch to ${theme === "dark" || isSSR ? "light" : "dark"} mode`}
    />
  );
};
