/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Search,
  SlidersHorizontal,
  UserCog,
  UserMinus,
  MailPlus,
  Loader2,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useMembersView } from "../hooks/useMembersView";

export default function MembersView() {
  const {
    filteredMembers,
    isLoadingMembers,
    membersError,
    inviteSubmissionError,
    isInviting,
    searchQuery,
    setSearchQuery,
    roleOptions,
    register,
    handleSubmit,
    formState: { errors },
    organizationId,
    onSubmitInvite,
    formKey, // 1. Consume formKey here
  } = useMembersView();

  return (
    <div className="space-y-6">
      <section className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Invite new members</h3>

        {/* 2. key={formKey} tears down and remounts the form clean on success */}
        <form
          key={formKey} 
          onSubmit={handleSubmit(onSubmitInvite)}
          noValidate
          className="flex flex-col md:flex-row gap-4 items-start"
        >
          <div className="flex-1 space-y-1.5 w-full relative pb-5">
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-medium">
              Email Address
            </label>
            <Input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 px-4 text-body-base shadow-none h-10 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60"
              placeholder="colleague@acmecorp.com"
              type="email"
              disabled={isInviting || !organizationId}
              {...register("email")}
            />

            {errors.email?.message && (
              <p className="text-error text-sm absolute bottom-0 left-0 leading-none">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="w-full md:w-48 space-y-1.5 pb-5">
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-medium">
              Assign Role
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-4 pr-10 text-body-base appearance-none outline-none cursor-pointer h-10 border-box disabled:opacity-60 text-on-surface"
                disabled={isInviting || !organizationId}
                {...register("role")}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-outline">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isInviting || !organizationId}
            className="w-full md:w-auto bg-primary text-on-primary h-10 px-6 rounded-xl font-label-md flex items-center justify-center gap-2 shadow-none disabled:opacity-50 md:mt-7"
          >
            {isInviting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MailPlus className="h-4 w-4" />
            )}
            <span>{isInviting ? "Sending..." : "Send invitation"}</span>
          </Button>
        </form>

        {inviteSubmissionError && (
          <p className="text-error text-sm mt-3">{inviteSubmissionError}</p>
        )}
      </section>

      {/* Directory Toolbar & Table Block Ledger */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
            <Input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-1.5 pl-9 pr-4 text-body-sm shadow-none h-auto focus-visible:ring-2 focus-visible:ring-primary/20"
              placeholder="Filter members..."
              type="text"
              value={searchQuery}
              disabled={isLoadingMembers || !!membersError}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 border border-outline-variant rounded-lg text-on-surface font-label-md hover:bg-surface-container-high shadow-none h-auto py-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
              <tr>
                <th className="px-6 py-3 text-left font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Member
                </th>
                <th className="px-6 py-3 text-left font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Role
                </th>
                <th className="px-6 py-3 text-left font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {membersError && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-error font-medium"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-6 w-6" />
                      <span>{membersError}</span>
                    </div>
                  </td>
                </tr>
              )}

              {isLoadingMembers && !membersError && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-on-surface-variant"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <p className="text-body-sm">
                        Loading workspace directory details...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoadingMembers &&
                !membersError &&
                filteredMembers.map((member: any) => {
                  const fallbackInitials = member.name
                    ? member.name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : member.email.slice(0, 2).toUpperCase();

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {member.user?.avatarUrl ? (
                            <img
                              alt={member.name || "Workspace User"}
                              className="w-9 h-9 rounded-full border border-outline-variant object-cover"
                              src={member.user.avatarUrl}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm tracking-tight border border-outline-variant">
                              {fallbackInitials}
                            </div>
                          )}
                          <div>
                            <div className="font-body-base text-body-base font-semibold text-on-surface leading-snug">
                              {member.name || "Pending Registration"}
                            </div>
                            <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-body-base text-on-surface-variant">
                        {member.email}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                            member.role === "Owner"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-surface-container-highest text-on-surface-variant border border-outline-variant"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="text-body-base text-on-surface font-medium">
                            Active
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={member.role === "Owner"}
                            className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-30"
                            title="Change role"
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={member.role === "Owner"}
                            className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all disabled:opacity-30"
                            title="Remove member"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isLoadingMembers &&
                !membersError &&
                filteredMembers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-on-surface-variant"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Inbox className="h-8 w-8 opacity-40" />
                        <p className="text-body-base font-medium">
                          No matching workspace members found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}