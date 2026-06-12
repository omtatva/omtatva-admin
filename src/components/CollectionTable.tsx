"use client";

import { Fragment, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { cn } from "@/lib/utils";

export type TableColumn<T> = {
  id: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  cell: (item: T, rowIndex: number, globalIndex: number) => React.ReactNode;
};

function TablePagination({
  page,
  pageSize,
  total,
  totalPages,
  rangeStart,
  rangeEnd,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
      <p>
        {total === 0 ? (
          "No items"
        ) : (
          <>
            Showing <span className="text-zinc-200">{rangeStart}</span>–
            <span className="text-zinc-200">{rangeEnd}</span> of{" "}
            <span className="text-zinc-200">{total}</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="min-w-[4rem] text-center text-xs">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function TableThumb({ src }: { src?: string }) {
  return (
    <div className="h-10 w-14 shrink-0 overflow-hidden rounded border border-zinc-700 bg-zinc-800">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-[10px] text-zinc-600">—</div>
      )}
    </div>
  );
}

export function EditPanel({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function TruncateCell({
  text,
  maxWidth = "max-w-[220px]",
}: {
  text: string;
  maxWidth?: string;
}) {
  return (
    <span className={cn("block truncate text-zinc-200", maxWidth)} title={text}>
      {text || "—"}
    </span>
  );
}

export function CollectionTable<T extends { id: string }>({
  title,
  items,
  columns,
  renderEdit,
  onAdd,
  onRemove,
  pageSize = 10,
  emptyMessage = "No items yet. Click “Add row” to create one.",
}: {
  title: string;
  items: T[];
  columns: TableColumn<T>[];
  renderEdit: (item: T) => React.ReactNode;
  onAdd: () => void;
  onRemove: (id: string) => void;
  pageSize?: number;
  emptyMessage?: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const {
    page,
    setPage,
    pageSize: size,
    total,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
  } = usePagination(items, pageSize);

  const colCount = columns.length + 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-white">{title}</p>
        <button
          type="button"
          onClick={onAdd}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
        >
          + Add row
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
              <th className="w-28 px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-zinc-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, rowIndex) => {
                const globalIndex = (page - 1) * size + rowIndex;
                const isExpanded = expandedId === item.id;

                return (
                  <Fragment key={item.id}>
                    <tr
                      className={cn(
                        "transition-colors hover:bg-zinc-900/40",
                        isExpanded && "bg-zinc-900/30"
                      )}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={cn("px-3 py-2.5 align-middle", col.cellClassName)}
                        >
                          {col.cell(item, rowIndex, globalIndex)}
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-right align-middle">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : item.id)
                            }
                            className="text-xs font-medium text-blue-400 hover:text-blue-300"
                          >
                            {isExpanded ? "Close" : "Edit"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (expandedId === item.id) setExpandedId(null);
                              onRemove(item.id);
                            }}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-zinc-950/80">
                        <td colSpan={colCount} className="border-t border-zinc-800/80 px-4 py-4">
                          {renderEdit(item)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        pageSize={size}
        total={total}
        totalPages={totalPages}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onPageChange={setPage}
      />
    </div>
  );
}
