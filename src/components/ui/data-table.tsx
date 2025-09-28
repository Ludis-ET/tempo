import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, CheckSquare, Square } from "lucide-react";

export type ColumnDef<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  cell?: (row: T) => React.ReactNode;
  width?: string;
};

export type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  caption?: string;
  onSelectionChange?: (selected: T[]) => void;
};

export function DataTable<T extends { id: string | number }>({ columns, data, pageSizeOptions = [5, 10, 20], initialPageSize = 10, caption, onSelectionChange, }: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selected, setSelected] = useState<Set<T["id"]>>(new Set());

  const sorted = useMemo(() => {
    if (!sort) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      if (va == null) return -1;
      if (vb == null) return 1;
      if (typeof va === "number" && typeof vb === "number") {
        return sort.dir === "asc" ? va - vb : vb - va;
      }
      return sort.dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return arr;
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageData = useMemo(() => {
    const start = (current - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, current, pageSize]);

  const toggleSort = (key: keyof T) => {
    setPage(1);
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: "asc" };
      return s.dir === "asc" ? { key, dir: "desc" } : null;
    });
  };

  const allVisibleIds = pageData.map((r) => r.id);
  const allVisibleSelected = allVisibleIds.every((id) => selected.has(id));

  const toggleAllVisible = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      allVisibleIds.forEach((id) => next.delete(id));
    } else {
      allVisibleIds.forEach((id) => next.add(id));
    }
    setSelected(next);
    onSelectionChange?.(data.filter((d) => next.has(d.id)));
  };

  const toggleRow = (id: T["id"]) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onSelectionChange?.(data.filter((d) => next.has(d.id)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">Rows per page:
          <select className="ml-2 rounded-md border bg-background px-2 py-1 text-sm" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
            {pageSizeOptions.map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        </div>
        <div className="text-sm text-muted-foreground">{sorted.length} records</div>
      </div>
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <button className="flex items-center" onClick={toggleAllVisible} aria-label={allVisibleSelected ? "Deselect all" : "Select all"}>
                {allVisibleSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </button>
            </TableHead>
            {columns.map((c) => (
              <TableHead key={String(c.key)} style={{ width: c.width }}>
                <button
                  className="inline-flex items-center gap-1 hover:text-foreground"
                  onClick={() => c.sortable && toggleSort(c.key)}
                >
                  <span>{c.header}</span>
                  {c.sortable && <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((row) => (
            <TableRow key={String(row.id)} data-state={selected.has(row.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => toggleRow(row.id)}>
              <TableCell className="w-10">
                {selected.has(row.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </TableCell>
              {columns.map((c) => (
                <TableCell key={String(c.key)}>{c.cell ? c.cell(row) : String(row[c.key] ?? "")}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page {current} of {totalPages}</div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => { setPage(1); }} disabled={current === 1}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={current === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={current === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={current === totalPages}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
