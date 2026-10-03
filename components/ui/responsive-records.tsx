import type { ReactNode } from "react";

export function ResponsiveRecords({
  headers,
  rows,
  cards,
}: {
  headers: string[];
  rows: ReactNode;
  cards: ReactNode;
}) {
  return (
    <>
      <div className="hidden lg:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-y bg-muted/40 text-xs text-muted-foreground">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">{rows}</tbody>
        </table>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">{cards}</div>
    </>
  );
}
