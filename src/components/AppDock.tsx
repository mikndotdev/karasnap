"use client";
import {
  MenuDock,
  type MenuDockItem,
} from "@/components/ui/shadcn-io/menu-dock";
import { Plus, Clock, Mic2, User, Home, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export const AppDock = () => {
  const router = useRouter();

  const items: MenuDockItem[] = [
    {
      label: "曲を追加",
      icon: Plus,
      onClick: () => router.push("/dashboard/add"),
    },
    {
      label: "ホーム",
      icon: Home,
      onClick: () => router.push("/dashboard"),
    },
    {
      label: "履歴",
      icon: Clock,
      onClick: () => router.push("/dashboard/history"),
    },
    {
      label: "歌った曲",
      icon: Mic2,
      onClick: () => router.push("/dashboard/songs"),
    },
    {
      label: "設定",
      icon: Settings,
      onClick: () => router.push("/dashboard/settings"),
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <MenuDock
        items={items}
        variant="default"
        orientation="horizontal"
        showLabels
        animated
        forcedActiveIndex={0}
      />
    </div>
  );
};
