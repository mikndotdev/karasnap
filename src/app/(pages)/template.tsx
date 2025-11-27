"use client";
import { ReactNode } from "react";

import { Footer } from "@/components/mikn/Footer";
import { Header } from "@/components/mikn/Header";

import { Github } from "lucide-react";

import MikanCat from "@/assets/img/mikan-cat.png";
import KaraSnapIcon from "@/assets/img/mikan-mic-piece.png";

import Image from "next/image";

const social = [
  {
    name: "GitHub",
    href: "https://github.com/mikndotdev",
    color: "hover:text-github hover:bg-github",
    icon: Github,
  },
];

const links = [
  {
    name: "各種情報",
    children: [
      {
        name: "アカウントセンター",
        href: "https://account.mikandev.com/",
      },
      {
        name: "製品一覧",
        href: "https:/mikn.dev/solutions",
      },
    ],
  },
  {
    name: "サポート",
    children: [
      {
        name: "お問い合わせ",
        href: "https://mikn.dev/contact",
      },
    ],
  },
  {
    name: "法的情報",
    children: [
      {
        name: "利用規約",
        href: "https://docs.mikn.dev/legal/terms",
      },
      {
        name: "プライバシーポリシー",
        href: "https://docs.mikn.dev/legal/privacy",
      },
      {
        name: "特定商取引法に基づく表記",
        href: "https://docs.mikn.dev/legal/jp-payments",
      },
    ],
  },
];

export default function MainTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <Header
        brand={{
          name: "KaraSnap",
          href: "/",
          logo: KaraSnapIcon.src,
          showTitle: true,
        }}
        buttons={[{ title: "今すぐ使ってみる", href: "/dashboard" }]}
      />
      <div className={"mt-24"}>{children}</div>
      <p className={"text-center text-sm text-muted-foreground py-4"}>
        JOYSOUNDは株式会社エクシングの登録商標です。
        <br />
        DAMは第一興商株式会社の登録商標です。
        <br />
        その他記載されている会社名、製品名は各社の商標または登録商標です。
        <br />
        KaraSnapは上記団体とは一切関係ありません。
      </p>
      <Footer
        social={social}
        links={links}
        copyright={`2020-${new Date().getFullYear()} MikanDev`}
        className="text-white font-bold bg-secondary"
      >
        <div className="flex items-center self-end">
          <Image
            src={MikanCat.src}
            width={200}
            height={100}
            alt=":3"
            className="ml-2 mb-0"
          />
        </div>
      </Footer>
    </>
  );
}
