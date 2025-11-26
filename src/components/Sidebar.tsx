"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { type IdTokenClaims } from "@logto/js";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Plan } from "@/generated/prisma/enums";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/animate-ui/components/radix/sidebar";
import { Plus, LogOut, Clock, Mic2, User, Home, Settings } from "lucide-react";

import SidebarIcon from "@/assets/img/mikan-mic-piece.png";

interface SidebarProps {
  user?: IdTokenClaims;
  plan?: Plan;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  {
    title: "曲を追加",
    url: "/dashboard/add",
    icon: Plus,
  },
  {
    title: "ホーム",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "履歴",
    url: "/dashboard/history",
    icon: Clock,
  },
  {
    title: "歌った曲",
    url: "/dashboard/songs",
    icon: Mic2,
  },
  {
    title: "プロフィール",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "設定",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export const AppSidebar = (props: SidebarProps) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/">
          <div className="flex flex-row justify-center items-center space-x-2">
            <Image
              src={SidebarIcon}
              alt="KaraSnap Logo"
              width={80}
              height={40}
              className="size-8"
            />
            <span className="truncate font-semibold text-2xl text-center group-data-[collapsible=icon]:hidden">
              KaraSnap
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className={"items-center mt-5"}>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.title} className={"w-full px-2 mb-2"}>
              <SidebarMenuButton
                asChild
                size={"default"}
                className="transition-all"
              >
                <Link href={item.url}>
                  <item.icon />
                  <span className={"font-bold"}>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="">
        <SidebarMenu>
          {props.user && (
            <SidebarMenuItem
              className={"w-full mb-2 group-data-[collapsible=icon]:hidden"}
            >
              <Card className="w-full bg-muted">
                <CardContent className="flex flex-row items-center justify-center p-1 space-x-2">
                  <img
                    className={"w-8 h-8 rounded-full"}
                    src={props.user.picture || ""}
                    alt="User Avatar"
                  />
                  <div className={"flex flex-col space-x-2 justify-left"}>
                    <div className="font-semibold">{props.user.name}</div>
                    <div className="text-xs">UID {props.user.sub}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={"/dashboard/settings"} className={"w-full"}>
                    <Badge className="w-full justify-center">
                      {props.plan === Plan.FREE
                        ? "無料プラン"
                        : "プレミアムプラン"}
                    </Badge>
                  </Link>
                </CardFooter>
              </Card>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem className={"w-full"}>
            <SidebarMenuButton
              asChild
              size={"default"}
              className="transition-all"
              type={"submit"}
              onClick={() => {
                props.onSignOut();
              }}
            >
              <LogOut />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
