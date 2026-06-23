/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, X, Search, Check } from "lucide-react";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchContacts,
  updateExistingContact,
} from "../store/contacts.actions";
import { cn } from "@/shared/utils/utils";
import { fetchOrganizationMembers } from "@/modules/team/store/members.actions";

interface AttachMemberDialogProps {
  contactId: string | null;
  orgId: string | null;
  onClose: () => void;
}

export function AttachMemberDialog({
  contactId,
  orgId,
  onClose,
}: AttachMemberDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = !!contactId;


  const { items: membersList,  isLoadingMembers } = useSelector(
    (state: RootState) => state.members 
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && orgId) {
      dispatch(fetchOrganizationMembers(orgId));
    }
  }, [isOpen, orgId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || !selectedMemberId) return;

    setIsSubmitting(true);
    try {
      // Updates the target key property layout: assignedToId
      await dispatch(
        updateExistingContact({
          id: contactId,
          data: { assignedToId: selectedMemberId } as any,
        })
      ).unwrap();

      // Refresh cached listings directly at the data grid layer view hook context
      dispatch(fetchContacts({ page: 1, limit: 10 }));
      onClose();
    } catch (err) {
      console.error("Failed to reassign layout instance container context:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe internal list filter processing layer logic
  const filteredMembers = (Array.isArray(membersList) ? membersList : []).filter((member: any) => {
    const fullName = member.name.toLowerCase();
    const search = searchQuery.toLowerCase();
    return (
      fullName.includes(search) ||
      member?.role?.toLowerCase().includes(search) ||
      member?.email?.toLowerCase().includes(search)
    );
  });

  // Generates display letter badges when user images are omitted or missing
  const getInitials = (member: any) => {
    const f = member?.firstName?.[0] || "";
    const l = member?.lastName?.[0] || "";
    return `${f}${l}`.toUpperCase() || "ME";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 modal-blur-bg flex items-center justify-center p-4">
      {/* Modal Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest w-full max-w-[520px] rounded-xl shadow-2xl overflow-hidden border border-outline-variant transition-all transform animate-in fade-in zoom-in duration-300"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant">
          <h2 className="font-h3 text-h3 text-on-surface text-xl font-semibold">Assign Member</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Search Section */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-surface border border-outline-variant rounded-lg text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50"
              placeholder="Search team members..."
            />
            {isLoadingMembers && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
            )}
          </div>

          {/* Suggested List */}
          <div className="space-y-3">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
              Recent & Suggested
            </h3>
            <div className="space-y-1 max-h-[320px] overflow-y-auto custom-scrollbar pr-1 text-left">
              {filteredMembers.length === 0 && !isLoadingMembers ? (
                <p className="text-sm text-on-surface-variant/70 italic p-4 text-center">
                  No team members match your query
                </p>
              ) : (
                filteredMembers.map((member: any) => {
                  const isSelected = selectedMemberId === member.id;
                  const displayName = member.name.trim() || "Unknown Member";
                  
                  return (
                    <div
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all group",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-surface-container-high"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-outline-variant flex-shrink-0">
                          {member?.avatarUrl || member?.profilePicture || member?.logoUrl ? (
                            <img
                              className="w-full h-full object-cover"
                              src={member?.avatarUrl || member?.profilePicture || member?.logoUrl}
                              alt={displayName}
                            />
                          ) : (
                            <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-sm">
                              {getInitials(member)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-body-base font-semibold text-on-surface text-sm">
                            {displayName}
                          </p>
                          <p className="text-label-sm text-on-surface-variant text-xs">
                            {member?.role || member?.title || "Team Member"}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <div className="absolute inset-0 border-2 border-primary rounded-full"></div>
                          <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-outline-variant rounded-full group-hover:border-outline transition-colors flex-shrink-0"></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-5 bg-surface-container-low border-t border-outline-variant flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all active:scale-95 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedMemberId}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-label-md text-label-md shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? "Assigning..." : "Assign Member"}
          </button>
        </div>
      </form>
    </div>
  );
}