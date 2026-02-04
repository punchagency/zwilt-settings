"use client";
import React, { useMemo, useState } from "react";

import {
  Column,
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const Table = ({
  columns,
  Tdata,
  statusType,
}: {
  columns: any;
  Tdata: any;
  statusType: string;
}) => {
  // const [TData, setTData] = useState(Tdata);
  const data = useMemo(() => Tdata, [Tdata]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="w-full">
      <thead className="w-full relative">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="w-full relative border-b w-full border-[#e0e0e9]"
          >
            {headerGroup.headers.map((header, index) => (
              <th
                key={header.id}
                className={`pb-[1.56vw] text-[0.94vw] capitalize font-semibold text-[#282833] w-[30%] ${index === 0 ? "text-left" : "text-center"
                  }`}
                style={{
                  width:
                    index === 0 // First column "Assign to"
                      ? "21%"
                      : index === headerGroup.headers.length - 1 // ActionCell
                        ? "21%"
                        : "21%", // Distribute remaining space equally among other columns
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="w-full">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="w-full">
            {row.getVisibleCells().map((cell, index) => (
              <td
                key={cell.id}
                className="pt-[1.04vw] pt-[1.56vw] text-[0.83vw] text-center font-medium leading-[1vw] text-[#282833]"
                style={{
                  width:
                    index === 0 // First column "Assign to"
                      ? "21%"
                      : index === row.getVisibleCells().length - 1 // ActionCell
                        ? "21%"
                        : "21%", // Distribute remaining space for other columns
                }}
              >
                {/* <td key={cell.id} className="px-4 py-2 text-[#282833] text-sm"> */}
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
