/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResourceTable } from "@/shared/ui/resource/resource-table";
import { getContactColumns } from "./ContactColumns";
import { ResourcePagination } from "@/shared/ui/resource/resource-pagination";
import type { Role } from "@/modules/auth/types/auth.types";

interface ContactsListViewProps {
  contacts: any[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  role: Role ;
  handleMenuDispatch: (actionType: string, contactId: string) => void;
}

export function ContactsListView({
  contacts,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  page,
  totalPages,
  onPageChange,
  role,
  handleMenuDispatch,
}: ContactsListViewProps) {

  const columns = getContactColumns({ role, handleMenuDispatch });

  return (
    <>
      <ResourceTable
        data={contacts}
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