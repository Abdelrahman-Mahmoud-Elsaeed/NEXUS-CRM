import { ChevronLeft, ChevronRight, Download, Info, Loader2, Mail, RotateCw, Search, SlidersHorizontal, Trash2, UserX, AlertCircle, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/utils/utils";
import { useInvitationsView } from "@/modules/organization/hooks/useInvitationsView";

export default function InvitationsView() {
  const {
    organizationId,
    invitations,
    filteredInvitationsCount,
    totalInvitationsCount,
    isLoadingInvitations,
    invitationsError,
    inviteSubmissionError,
    isInviting,
    searchQuery,
    setSearchQuery,
    inviteRoleOptions,
    register,
    handleSubmit,
    formState,
    onSubmitInvite,
  } = useInvitationsView();

  return (
    <main className="bg-surface-bright text-on-surface font-sans">
      <div className="mx-auto space-y-6">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <section className="col-span-12 lg:col-span-4 order-last lg:order-first space-y-4">
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-on-surface mb-1">Invite New Member</h3>
              <p className="text-body-sm text-on-surface-variant mb-6">
                Send an invitation link to join this workspace.
              </p>

              <form onSubmit={handleSubmit(onSubmitInvite)} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
                    Email Address
                  </label>
                  <Input
                    className="w-full bg-surface border border-outline-variant rounded-lg py-2.5 px-4 text-body-base focus-visible:ring-2 focus-visible:ring-primary/20 shadow-none h-auto transition-all outline-none disabled:opacity-60"
                    placeholder="colleague@acme.com"
                    type="email"
                    disabled={isInviting || !organizationId}
                    {...register("email")}
                  />
                  {formState.errors.email && (
                    <p className="text-sm text-error mt-1">{formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
                    Assign Role
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-surface border border-outline-variant rounded-lg py-2.5 px-4 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none outline-none cursor-pointer text-on-surface disabled:opacity-60"
                      disabled={isInviting || !organizationId}
                      {...register("role")}
                    >
                      {inviteRoleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-outline">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isInviting || !organizationId}
                  className="w-full py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-label-md rounded-xl transition-all shadow-none flex items-center justify-center gap-2 h-auto disabled:opacity-50"
                >
                  {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>{isInviting ? "Sending Link..." : "Send Invitation"}</span>
                </Button>
              </form>
              {inviteSubmissionError && (
                <div className="rounded-xl border border-error/10 bg-error-container/10 p-4 text-error text-sm mt-4">
                  {inviteSubmissionError}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-primary-container/10 border border-primary/10 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-primary">Security Notice:</span> Generated organization token parameters automatically expire 48 hours after baseline generation.
              </p>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
                  <Input
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface focus-visible:ring-2 focus-visible:ring-primary/20 text-body-sm h-auto shadow-none"
                    placeholder="Search by email..."
                    type="text"
                    value={searchQuery}
                    disabled={isLoadingInvitations || !!invitationsError}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button
                    variant="outline"
                    className="px-4 py-2 text-body-sm font-medium border border-outline-variant rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2 h-auto shadow-none"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-on-surface-variant" />
                    <span>Filter</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="px-4 py-2 text-body-sm font-medium border border-outline-variant rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2 h-auto shadow-none"
                  >
                    <Download className="h-4 w-4 text-on-surface-variant" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Email</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Invited Role</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Sent Date</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Expiry</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {invitationsError && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-error font-medium">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <AlertCircle className="h-6 w-6" />
                            <span>{invitationsError}</span>
                          </div>
                        </td>
                      </tr>
                    )}

                    {isLoadingInvitations && !invitationsError && (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                            <p className="text-body-sm">Syncing system authorization queues...</p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {!isLoadingInvitations && !invitationsError && invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-table-data text-on-surface font-medium">{inv.email}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-body-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant/10">
                            {inv.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-body-sm text-on-surface-variant">{inv.sentDateLabel}</td>
                        <td className={cn(
                          "px-6 py-4 whitespace-nowrap text-body-sm",
                          inv.statusSeverity === "expired" ? "text-error font-medium" : "text-on-surface-variant"
                        )}>
                          {inv.expiryLabel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide",
                            inv.statusSeverity === "pending" && "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/10",
                            inv.statusSeverity === "expired" && "bg-error-container text-on-error-container border border-error/10",
                            inv.statusSeverity === "accepted" && "bg-secondary-container text-on-secondary-container border border-secondary/10"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              inv.statusSeverity === "pending" && "bg-tertiary animate-pulse",
                              inv.statusSeverity === "expired" && "bg-error",
                              inv.statusSeverity === "accepted" && "bg-secondary"
                            )} />
                            {inv.statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={inv.statusLabel === "ACCEPTED"}
                              className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-20"
                              title="Resend Invitation Link"
                            >
                              <RotateCw className="h-4 w-4" />
                            </Button>

                            {inv.statusLabel === "EXPIRED" ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-error hover:bg-error/10 rounded-lg transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={inv.statusLabel === "ACCEPTED"}
                                className="h-8 w-8 text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-20"
                                title="Revoke Access Invitation"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoadingInvitations && !invitationsError && invitations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-on-surface-variant font-body-base">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Mail className="h-8 w-8 opacity-30" />
                            <p className="text-body-base font-medium">No pending workspace token invitations found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between">
                <p className="text-body-sm text-on-surface-variant">
                  Showing {filteredInvitationsCount} of {totalInvitationsCount} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 shadow-none"
                    disabled
                  >
                    <ChevronLeft className="h-4 w-4 text-on-surface" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors shadow-none"
                    disabled={filteredInvitationsCount === 0}
                  >
                    <ChevronRight className="h-4 w-4 text-on-surface" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
