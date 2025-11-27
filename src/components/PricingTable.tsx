import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { CheckIcon, XIcon } from "lucide-react";

interface FeatureRow {
  feature: string;
  basic: boolean | string;
  pro: boolean | string;
}

const features: FeatureRow[] = [
  { feature: "写真一枚で簡単記録", basic: true, pro: true },
  { feature: "歌った曲の履歴閲覧", basic: true, pro: true },
  { feature: "プロフィール共有", basic: true, pro: true },
  { feature: "機種の自動登録", basic: true, pro: true },
  { feature: "曲の追加数", basic: "毎月25曲まで", pro: "無制限" },
  { feature: "履歴の保存数", basic: "過去50曲", pro: "無制限" },
  { feature: "曲情報読み取り精度", basic: "普通", pro: "高精度" },
  { feature: "採点システムの自動登録", basic: false, pro: true },
];

export default function PricingTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead className={"font-bold"}>無料プラン</TableHead>
          <TableHead className={"font-bold"}>プレミアムプラン</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((row, index) => (
          <TableRow key={index}>
            <TableCell className={"font-bold"}>{row.feature}</TableCell>
            <TableCell className="">
              {typeof row.basic === "boolean" ? (
                row.basic ? (
                  <CheckIcon className="inline-block w-5 h-5 text-green-500" />
                ) : (
                  <XIcon className="inline-block w-5 h-5 text-red-500" />
                )
              ) : (
                row.basic
              )}
            </TableCell>
            <TableCell className="">
              {typeof row.pro === "boolean" ? (
                row.pro ? (
                  <CheckIcon className="inline-block w-5 h-5 text-green-500" />
                ) : (
                  <XIcon className="inline-block w-5 h-5 text-red-500" />
                )
              ) : (
                row.pro
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
