import { ResourceTable } from "@/shared/ui/resource/resource-table";
import { ResourcePagination } from "@/shared/ui/resource/resource-pagination";
import { createCompanyColumns } from "./CompanyColumns";
import type { CompanyData } from "../types/company.types";
import { Role } from "@/modules/auth/types/auth.types";

interface CompaniesListViewProps {
  companies: CompanyData[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  role: Role;
  handleMenuDispatch: (actionType: string, companyId: string) => void;
}

export function CompaniesListView({
  companies,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  page,
  totalPages,
  onPageChange,
  role,
  handleMenuDispatch,
}: CompaniesListViewProps) {
  const columns = createCompanyColumns({
    role,
    handleMenuDispatch,
  });

  return (
    <>
      <ResourceTable
        data={companies}
        columns={columns}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
        onToggleSelectAll={onToggleSelectAll}
      />
      <ResourcePagination
        page={page}
        totalPages={totalPages}
        selectedCount={selectedIds.size}
        onPageChange={onPageChange}
      />
    </>
  );
}
