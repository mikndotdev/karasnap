import ImageRotatingIcons from "@/components/ImageRotatingIcons";
import { HeroMarquee } from "@/components/HeroMarquee";
import { Button } from "@/components/animate-ui/components/buttons/button";
import PricingTable from "@/components/PricingTable";
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";

import { Share2, Clock, Music, CameraIcon, BarChart, User } from "lucide-react";
import PricingCard from "@/components/PricingCard";

export default function Home() {
  return (
    <>
      <div
        className={
          "relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 md:py-0"
        }
      >
        <div
          className={
            "flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-6 md:px-10 relative z-20 gap-8 md:gap-0"
          }
        >
          <ImageRotatingIcons />
          <div className={"flex flex-col text-center md:text-left w-full"}>
            <h1
              className={
                "text-3xl md:text-5xl font-bold mt-12 md:mt-0 mb-3 md:mb-4"
              }
            >
              <span className={"text-primary"}>写真一枚で</span>色々分かる
            </h1>
            <h1 className={"text-2xl md:text-4xl font-bold mb-3 md:mb-4"}>
              カラオケ記録アプリ。
            </h1>
            <Link href={"/dashboard"} className="mx-auto md:mx-0">
              <Button size={"lg"} className={"mt-2 md:mt-4 w-40"}>
                今すぐ無料で始める！
              </Button>
            </Link>
          </div>
        </div>
        <HeroMarquee />
      </div>
      <div className={"flex flex-col justify-center items-center mt-20 mb-40"}>
        <h1 className={"text-4xl font-bold mb-4"}>使い方は簡単！</h1>
        <p
          className={
            "text-md md:text-lg text-muted-foreground mb-15 max-w-11/12 text-center"
          }
        >
          カラオケの採点画面を写真をアップロードするだけで、
          <br />
          自動で点数や機種などを解析して保存します。
          <br />
          あとはあなたのカラオケ記録を振り返ったり、友達と共有したりするだけ！
        </p>
        <h1 className={"text-4xl font-bold mb-6"}>便利機能が充実！</h1>
        <div
          className={"grid grid-cols-1 md:grid-cols-2 gap-8 max-w-11/12 mt-2"}
        >
          <FeatureCard
            title={"簡単アップロード"}
            description={
              "写真をアップロードするだけで、点数や機種などの情報を自動で解析して保存します。"
            }
            icon={CameraIcon}
          />
          <FeatureCard
            title={"記録の振り返り"}
            description={
              "過去のカラオケ記録を簡単に振り返ることができ、自己ベストや成長を確認できます。"
            }
            icon={Clock}
          />
          <FeatureCard
            title={"友達と共有"}
            description={
              "お気に入りのカラオケ記録を友達と共有して、みんなで楽しむことができます。"
            }
            icon={Share2}
          />
          <FeatureCard
            title={"豊富な対応機種"}
            description={
              "JOYSOUND、DAMなど、主要なカラオケ機種に対応しています。"
            }
            icon={Music}
          />
          <FeatureCard
            title={"詳細な分析"}
            description={
              "点数の推移やランキングなど、詳細な分析機能で自分のパフォーマンスを把握できます。"
            }
            icon={BarChart}
          />
          <FeatureCard
            title={"ユーザープロフィール"}
            description={
              "自分のカラオケ履歴や統計情報をまとめたプロフィールページを公開できます。"
            }
            icon={User}
          />
        </div>
        <h1 className={"text-4xl font-bold mt-10 mb-2"}>お手頃な価格！</h1>
        <p
          className={"text-lg text-muted-foreground mb-5 max-w-2xl text-center"}
        >
          まずは無料プランでお試しください！
        </p>
        <div className={"max-w-11/12 w-full"}>
          <div className={"flex flex-col md:flex-row gap-4 w-full py-4"}>
            <PricingCard
              title={"無料プラン"}
              price={"永年無料"}
              buttonText={"使ってみる！"}
              href={"/dashboard"}
            />
            <PricingCard
              title={"プレミアムプラン"}
              price={"月額350円"}
              buttonText={"設定からアップグレード"}
              href={"/dashboard/settings"}
            />
            <PricingCard
              title={"プレミアムプラン（年額）"}
              price={"年額3500円"}
              buttonText={"設定からアップグレード"}
              href={"/dashboard/settings"}
            />
          </div>
          <PricingTable />
        </div>
        <h1 className={"text-4xl font-bold mt-10 mb-2"}>
          さあ、始めましょう！
        </h1>
        <p
          className={"text-lg text-muted-foreground mb-5 max-w-2xl text-center"}
        >
          今すぐ無料でアカウントを作成して、
          <br />
          あなたのカラオケ記録を管理しましょう！
        </p>
        <Link href={"/dashboard"}>
          <Button size={"lg"} className={"mt-4 w-40"}>
            今すぐ無料で始める！
          </Button>
        </Link>
      </div>
    </>
  );
}
