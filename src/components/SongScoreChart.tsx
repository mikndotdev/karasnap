"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import { useMemo } from "react";

interface ChartDataPoint {
  date: string;
  score: number;
  manufacturer: string;
}

interface SongScoreChartProps {
  data: ChartDataPoint[];
}

export default function SongScoreChart({ data }: SongScoreChartProps) {
  const chartOptions: AgChartOptions = useMemo(
    () => ({
      data: data,
      series: [
        {
          type: "bar",
          xKey: "date",
          yKey: "score",
          fill: "#ff9900",
          stroke: "#ff7700",
          strokeWidth: 2,
          tooltip: {
            renderer: ({ datum }) => ({
              title: datum.date,
              content: `${datum.score.toFixed(3)}点 (${datum.manufacturer})`,
            }),
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: "日付",
            color: "#fafafa",
          },
          label: {
            color: "#fafafa",
          },
          line: {
            stroke: "#ff9900",
          },
          gridLine: {
            enabled: false,
          },
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "スコア",
            color: "#fafafa",
          },
          label: {
            color: "#fafafa",
          },
          line: {
            stroke: "#ff9900",
          },
          gridLine: {
            style: [
              {
                stroke: "#663d00",
                lineDash: [4, 4],
              },
            ],
          },
          min: Math.max(0, Math.min(...data.map((d) => d.score)) - 5),
        },
      ],
      background: {
        fill: "transparent",
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    }),
    [data],
  );

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle>スコア推移</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[350px] w-full min-w-0">
          <AgCharts options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
