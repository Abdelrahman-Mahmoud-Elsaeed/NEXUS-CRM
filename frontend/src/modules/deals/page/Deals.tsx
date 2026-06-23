import { KanbanBoard } from "../components/KanbanBoard";
import { CreateDealModal } from "../components/CreateDealModal";
import { useDeals } from "../hooks/useDeals";
import type { PipelineStageData } from "../types/deal.types";

export function Deals() {
  const {
    deals,
    isLoading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    moveDeal,
    addDeal,
  } = useDeals();

  // For now, we'll use mock stages since we don't have a pipeline loaded
  // In a real implementation, you would load the pipeline from the backend
  const mockStages: PipelineStageData[] = [
    {
      id: "lead",
      name: "Lead",
      order: 0,
      pipelineId: "default",
      dealsCount: deals.filter((d) => d.stage?.name === "Lead").length,
      contactsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "meeting",
      name: "Meeting",
      order: 1,
      pipelineId: "default",
      dealsCount: deals.filter((d) => d.stage?.name === "Meeting").length,
      contactsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "proposal",
      name: "Proposal",
      order: 2,
      pipelineId: "default",
      dealsCount: deals.filter((d) => d.stage?.name === "Proposal").length,
      contactsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "negotiation",
      name: "Negotiation",
      order: 3,
      pipelineId: "default",
      dealsCount: deals.filter((d) => d.stage?.name === "Negotiation").length,
      contactsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const handleMoveDeal = async (dealId: string, stageId: string) => {
    const result = await moveDeal(dealId, { stageId });
    return result;
  };

  const handleDealClick = (dealId: string) => {
    // Navigate to deal details
    window.location.href = `/deals/${dealId}`;
  };

  return (
    <main className="mt-header-height bg-background overflow-hidden flex flex-col p-container-padding h-full p-5">
      <KanbanBoard
        stages={mockStages}
        deals={deals}
        onMoveDeal={handleMoveDeal}
        onDealClick={handleDealClick}
        isLoading={isLoading}
      />

      <CreateDealModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={addDeal}
      />
    </main>
  );
}
