import type { CompaniesResponseDto } from "../types/Companies.types";
import { CompaniesRow } from "./CompaniesRow";

interface CompaniessTableProps {
  contacts: CompaniesResponseDto[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export function CompaniessTable({ contacts = [], selectedIds, onToggleSelect, onToggleSelectAll }: CompaniessTableProps) {
  const safeCompaniess = Array.isArray(contacts) ? contacts : [];
  const allSelected = safeCompaniess.length > 0 && selectedIds.size === safeCompaniess.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <th className="px-6 py-3 font-medium w-12 text-center">
              <input 
                type="checkbox" 
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface" 
              />
            </th>
            <th className="px-6 py-3 font-medium text-left">Name</th>
            {/* ✅ Centered Headers to match row structural alignment */}
            <th className="px-6 py-3 font-medium text-center">Company</th>
            <th className="px-6 py-3 font-medium text-center">Omnichannel</th>
            <th className="px-6 py-3 font-medium text-center">Status</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/50 bg-surface font-table-data text-table-data text-on-background">
          {safeCompaniess.map((Companies) => {
            if (!Companies || !Companies.id) return null;

            return (
              <CompaniesRow 
                key={Companies.id} 
                Companies={Companies} 
                isSelected={selectedIds.has(Companies.id)}
                onToggleSelect={onToggleSelect}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


