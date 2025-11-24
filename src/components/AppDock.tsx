"use client";
import Dock from "@/components/Dock";
import { Home, Search, Plus, User } from "lucide-react";

export const AppDock = () => {
  const items = [
    {
      icon: <Plus size={"18"} />,
      label: "Home",
      href: "/dashboard/add",
      className: "bg-primary",
    },
  ];
  return <Dock items={items} panelHeight={25} />;
};
