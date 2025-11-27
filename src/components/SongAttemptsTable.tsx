"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRatingSystemText } from "@/lib/rating-system-text";
import type { RatingSystem } from "@/generated/prisma/enums";

type Manufacturer = "DAM" | "JOYSOUND" | "OTHER";

interface AttemptRow {
  id: string;
  score: number;
  bonus: number | null;
  manufacturer: Manufacturer;
  ratingSystem: RatingSystem;
  createdAt: Date;
}

interface SongAttemptsTableProps {
  attempts: AttemptRow[];
}

export default function SongAttemptsTable({
  attempts,
}: SongAttemptsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const manufacturerLabels = {
    DAM: "DAM",
    JOYSOUND: "JOYSOUND",
    OTHER: "その他",
  } as const;

  const columns = useMemo<ColumnDef<AttemptRow>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              日付
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return new Date(row.getValue("createdAt")).toLocaleDateString(
            "ja-JP",
          );
        },
        sortingFn: "datetime",
      },
      {
        accessorKey: "score",
        header: "スコア",
        cell: ({ row }) => {
          const score = parseFloat(row.getValue("score"));
          return `${score.toFixed(3)}点`;
        },
      },
      {
        accessorKey: "bonus",
        header: "ボーナス",
        cell: ({ row }) => {
          const bonus = row.getValue("bonus") as number | null;
          return bonus ? `${bonus.toFixed(3)}点` : "-";
        },
      },
      {
        accessorKey: "manufacturer",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              機種
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const manufacturer = row.getValue("manufacturer") as Manufacturer;
          return manufacturerLabels[manufacturer];
        },
        filterFn: (row, id, value) => {
          return value === "all" || row.getValue(id) === value;
        },
      },
      {
        accessorKey: "ratingSystem",
        header: "採点システム",
        cell: ({ row }) => {
          const ratingSystem = row.getValue("ratingSystem") as RatingSystem;
          return getRatingSystemText(ratingSystem).name;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: attempts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle>記録一覧</CardTitle>
        <div className="flex gap-4 mt-4">
          <Select
            value={
              (table.getColumn("manufacturer")?.getFilterValue() as string) ||
              "all"
            }
            onValueChange={(value) =>
              table.getColumn("manufacturer")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="機種で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="DAM">DAM</SelectItem>
              <SelectItem value="JOYSOUND">JOYSOUND</SelectItem>
              <SelectItem value="OTHER">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    window.location.href = `/dashboard/attempts/${row.original.id}`;
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  記録がありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
