import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "@/components/ui/table";
import { flexRender, Header } from "@tanstack/react-table";
import { Token } from "@/types";

type DraggableHeaderProps = {
  header: Header<Token, unknown>;
  index: number;
};

const DraggableHeader = ({ header, index }: DraggableHeaderProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: header.column.id,
    });

  const style = {
    paddingLeft: index === 0 ? "1.5rem" : 0,
    textAlign: "left" as const,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={() => {
        if (header.column.getCanSort()) {
          header.column.toggleSorting();
        }
      }}
      {...listeners}>
      {flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: " 🔼",
        desc: " 🔽",
      }[header.column.getIsSorted() as string] ?? null}
    </TableHead>
  );
};

export default DraggableHeader;
