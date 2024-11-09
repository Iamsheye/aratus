import React, { SetStateAction, useState } from "react";
import { useAtom } from "jotai";
import { atom } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type CustomizeViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentColumns: string[];
  setColumnOrder: (value: SetStateAction<string[]>) => void;
  onSave: (view: { id: number; name: string; columns: string[] }) => void;
};

export const savedViewsAtom = atom(getSavedViews());

function getSavedViews() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("tokenTableViews");
  return saved ? JSON.parse(saved) : [];
}

const AVAILABLE_COLUMNS = [
  { id: "s/n", label: "S/N" },
  { id: "name", label: "Coin" },
  { id: "price", label: "Price" },
  { id: "price_change_1h", label: "1h" },
  { id: "price_change_24h", label: "24h" },
  { id: "price_change_7d", label: "7d" },
  { id: "volume_24h", label: "24h Volume" },
  { id: "market_cap", label: "Market Cap" },
  { id: "sparkline", label: "Last 7 Days" },
];

const CustomizeViewModal = ({
  isOpen,
  onClose,
  currentColumns,
  onSave,
  setColumnOrder,
}: CustomizeViewModalProps) => {
  const [selectedColumns, setSelectedColumns] = useState(currentColumns);
  const [viewName, setViewName] = useState("");
  const [savedViews, setSavedViews] = useAtom(savedViewsAtom);

  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  const handleSave = () => {
    if (!viewName.trim()) {
      alert("Please enter a view name");
      return;
    }

    const newView = {
      id: Date.now(),
      name: viewName.trim(),
      columns: selectedColumns,
    };

    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
    setColumnOrder(selectedColumns);
    localStorage.setItem("tokenTableViews", JSON.stringify(updatedViews));

    onSave(newView);
    onClose();

    setSelectedColumns(currentColumns);
    setViewName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Table View</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="viewName">View Name</Label>
            <Input
              id="viewName"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="Enter view name"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Columns</Label>
            <div className="space-y-2">
              {AVAILABLE_COLUMNS.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    disabled={column.id === "s/n"}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => handleToggleColumn(column.id)}
                  />
                  <Label htmlFor={column.id}>{column.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!viewName.trim() || selectedColumns.length === 0}>
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeViewModal;
