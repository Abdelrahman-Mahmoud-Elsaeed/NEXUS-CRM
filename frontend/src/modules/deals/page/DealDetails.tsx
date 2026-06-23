import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeal } from "../store/deals.actions";
import type { RootState, AppDispatch } from "@/app/store";
import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

export function DealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { dealDetail, isLoadingDetail, error } = useSelector((state: RootState) => state.deals);

  useEffect(() => {
    if (id) {
      dispatch(fetchDeal(id));
    }
  }, [id, dispatch]);

  const formatCurrency = (value: string | null, currency: string = "USD") => {
    if (!value) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoadingDetail) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error || !dealDetail) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="font-body-sm text-body-sm text-error mb-2">Failed to load deal</p>
          <Button onClick={() => navigate("/deals")} variant="outline">
            Back to Deals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="mt-header-height p-6 md:ml-sidebar-width overflow-y-auto bg-background p-container-padding">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/deals")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Deals
        </Button>

        <div className="bg-surface border border-outline-variant rounded-xl shadow-sm">
          <div className="p-6 border-b border-outline-variant">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-h2 text-h2 text-on-surface mb-2">{dealDetail.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="font-h3 text-h3 text-primary font-bold">
                    {formatCurrency(dealDetail.value, dealDetail.currency)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    dealDetail.status === "Won" ? "bg-green-100 text-green-800" :
                    dealDetail.status === "Lost" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {dealDetail.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                Deal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Expected Close Date</p>
                  <p className="font-body-base text-body-base text-on-surface">{formatDate(dealDetail.expectedCloseDate)}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Actual Close Date</p>
                  <p className="font-body-base text-body-base text-on-surface">{formatDate(dealDetail.actualCloseDate)}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Currency</p>
                  <p className="font-body-base text-body-base text-on-surface">{dealDetail.currency}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                Pipeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Pipeline</p>
                  <p className="font-body-base text-body-base text-on-surface">{dealDetail.pipeline?.name || "-"}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Stage</p>
                  <p className="font-body-base text-body-base text-on-surface">{dealDetail.stage?.name || "-"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                Related Entities
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Company</p>
                  <p className="font-body-base text-body-base text-on-surface">{dealDetail.company?.name || "-"}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Primary Contact</p>
                  <p className="font-body-base text-body-base text-on-surface">{dealDetail.primaryContact?.name || "-"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                Assignment
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Assigned To</p>
                  <p className="font-body-base text-body-base text-on-surface">{dealDetail.assignee?.name || "-"}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Created By</p>
                  <p className="font-body-base text-body-base text-on-surface">{dealDetail.creator?.name || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {dealDetail.notes && (
            <div className="p-6 border-t border-outline-variant">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                Notes
              </h3>
              <p className="font-body-base text-body-base text-on-surface whitespace-pre-wrap">{dealDetail.notes}</p>
            </div>
          )}

          <div className="p-6 border-t border-outline-variant">
            <div className="flex justify-between items-center text-sm text-on-surface-variant">
              <p>Created: {formatDate(dealDetail.createdAt)}</p>
              <p>Last Updated: {formatDate(dealDetail.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
