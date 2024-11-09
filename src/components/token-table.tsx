import dynamic from "next/dynamic";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useAtom } from "jotai";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DraggableHeader from "./draggable-header";
import CustomizeViewModal, { savedViewsAtom } from "./customize-modal";
import { Settings } from "lucide-react";
import { SavedView, Token } from "@/types";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((mod) => mod.ResponsiveLine),
  { ssr: false }
);

const DEFAULT_COLUMNS = [
  "s/n",
  "name",
  "price",
  "price_change_1h",
  "price_change_24h",
  "price_change_7d",
  "volume_24h",
  "market_cap",
  "sparkline",
];

const TokenTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState(DEFAULT_COLUMNS);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [activeView, setActiveView] = useState("trending");

  const [savedViews] = useAtom<SavedView[]>(savedViewsAtom);

  const { data: tokens, isLoading } = useQuery<Token[]>({
    queryKey: ["tokens"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );
      return response.json();
    },
  });

  const columns: ColumnDef<Token>[] = [
    {
      id: "s/n",
      header: "#",
      accessorFn: (row, i) => i,
      enableSorting: false,
      cell: ({ row }) => <span className="pl-6">{row.index + 1}</span>,
    },
    {
      id: "name",
      header: "Coin",
      accessorFn: (row) => row.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-6 h-6"
          />
          <div className="flex flex-col items-start md:flex-row md:items-center">
            <div className="font-semibold text-sm text-gray-700">
              {row.original.name}{" "}
              <span className="text-gray-500 font-medium text-xs block md:inline">
                {row.original.symbol.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessorFn: (row) => row.current_price,
      cell: ({ row }) => (
        <span className="font-medium text-sm text-gray-900">
          ${row.original.current_price.toLocaleString()}
        </span>
      ),
    },
    {
      id: "price_change_1h",
      header: "1h",
      accessorFn: (row) => row.price_change_percentage_1h_in_currency,
      cell: ({ row }) => (
        <span
          className={`font-medium text-sm ${
            row.original.price_change_percentage_1h_in_currency > 0
              ? "text-green-500"
              : "text-red-500"
          }`}>
          {Math.abs(
            parseFloat(
              row.original.price_change_percentage_1h_in_currency?.toFixed(2)
            )
          )}
          %
        </span>
      ),
    },
    {
      id: "price_change_24h",
      header: "24h",
      accessorFn: (row) => row.price_change_percentage_24h_in_currency,
      cell: ({ row }) => (
        <span
          className={`font-medium text-sm ${
            row.original.price_change_percentage_24h_in_currency > 0
              ? "text-green-500"
              : "text-red-500"
          }`}>
          {Math.abs(
            parseFloat(
              row.original.price_change_percentage_24h_in_currency?.toFixed(2)
            )
          )}
          %
        </span>
      ),
    },
    {
      id: "price_change_7d",
      header: "7d",
      accessorFn: (row) => row.price_change_percentage_7d_in_currency,
      cell: ({ row }) => (
        <span
          className={`font-medium text-sm ${
            row.original.price_change_percentage_7d_in_currency > 0
              ? "text-green-500"
              : "text-red-500"
          }`}>
          {Math.abs(
            parseFloat(
              row.original.price_change_percentage_7d_in_currency?.toFixed(2)
            )
          )}
          %
        </span>
      ),
    },
    {
      id: "volume_24h",
      header: "24h Volume",
      accessorFn: (row) => row.total_volume,
      cell: ({ row }) => (
        <span className="font-medium text-sm text-gray-900">
          ${row.original.total_volume.toLocaleString()}
        </span>
      ),
    },
    {
      id: "market_cap",
      header: "Market Cap",
      accessorFn: (row) => row.market_cap,
      cell: ({ row }) => (
        <span className="font-medium text-sm text-gray-900">
          ${row.original.market_cap.toLocaleString()}
        </span>
      ),
    },
    {
      id: "sparkline",
      header: "Last 7 Days",
      enableSorting: false,
      cell: ({ row }) => {
        const sparklineData = {
          id: row.original.symbol,
          data: row.original.sparkline_in_7d.price.map((price, i) => ({
            x: i,
            y: price,
          })),
        };

        return (
          <div className="h-16 w-36 translate-y-8">
            <ResponsiveLine
              data={[sparklineData]}
              enablePoints={false}
              enableGridX={false}
              enableGridY={false}
              axisTop={null}
              axisRight={null}
              axisBottom={null}
              axisLeft={null}
              curve="monotoneX"
              colors={
                row.original.price_change_percentage_7d_in_currency > 0
                  ? ["#22c55e"]
                  : ["#ef4444"]
              }
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tokens || [],
    columns,
    state: {
      sorting,
      columnOrder,
      columnVisibility: Object.fromEntries(
        columns.map((col) => [col.id, columnOrder.includes(col.id as string)])
      ),
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
    if (viewId === "trending") {
      setColumnOrder(DEFAULT_COLUMNS);
    } else {
      const view = savedViews.find((v) => v.id.toString() === viewId);
      if (view) {
        setColumnOrder(view.columns);
      }
    }
  };

  const handleSaveView = (newView: {
    id: number;
    name: string;
    columns: string[];
  }) => {
    handleViewChange(newView.id.toString());
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="w-10/12 mx-auto">
        <div className="flex items-center justify-between">
          <Tabs
            value={activeView}
            onValueChange={handleViewChange}
            className="grow">
            <TabsList className="bg-transparent w-full justify-start">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              {savedViews.map((view) => (
                <TabsTrigger key={view.id} value={view.id.toString()}>
                  {view.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCustomizeOpen(true)}>
            <Settings className="w-4 h-4" />
            Customize
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id) {
            const oldIndex = columnOrder.indexOf(active.id as string);
            const newIndex = columnOrder.indexOf(over.id as string);
            const newColumnOrder = [...columnOrder];
            newColumnOrder.splice(oldIndex, 1);
            newColumnOrder.splice(newIndex, 0, active.id as string);
            setColumnOrder(newColumnOrder);
          }
        }}>
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-white border-b">
            <TableRow>
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}>
                {table
                  .getHeaderGroups()
                  .map((headerGroup) =>
                    headerGroup.headers.map((header, ind) => (
                      <DraggableHeader
                        key={header.id}
                        header={header}
                        index={ind}
                      />
                    ))
                  )}
              </SortableContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DndContext>

      <CustomizeViewModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        currentColumns={columnOrder}
        onSave={handleSaveView}
      />
    </div>
  );
};

export default TokenTable;
