/* eslint-disable @typescript-eslint/no-explicit-any */
import { MoreVertical, Pencil, Send, ChevronsDown } from "lucide-react";
import { CompaniesChannels } from "./CompaniesChannels"; 

interface CompaniessGridProps {
  contacts: any[];
  visibleLimit: number;
  totalRecords: number;
  onLoadMore: () => void;
}

export function CompaniessGrid({ contacts, visibleLimit, totalRecords, onLoadMore }: CompaniessGridProps) {
  const visibleCompaniess = contacts.slice(0, visibleLimit);

  const getStatusClasses = (status: string = "") => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-primary/10 text-primary border-primary";
      case "prospect":
        return "bg-secondary-container/30 text-secondary border-secondary";
      default:
        return "bg-surface-container-highest text-on-surface-variant border-outline";
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {visibleCompaniess.map((Companies) => {
          const currentStatus = Companies.status?.toLowerCase() || "prospect";
          const displayName = Companies.name || "Unknown Companies";
          const dicebearFallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
          
          // Check if channels exist and have elements to render safely
          const hasChannels = Companies.channels && Companies.channels.length > 0;

          return (
            <div 
              key={Companies.id}
              className="group bg-surface border border-outline-variant rounded-xl p-5 hover:border-primary/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${
                currentStatus === 'active' ? 'bg-primary' : 
                currentStatus === 'prospect' ? 'bg-secondary' : 'bg-outline'
              }`} />

              <div className="flex justify-between items-start mb-6">
                <div className="relative flex-shrink-0">
                  <img 
                    className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-surface bg-surface-container-high" 
                    src={Companies.avatarUrl || dicebearFallbackUrl} 
                    alt={`${displayName} profile`}
                  />
                  
                  {currentStatus === "active" && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-surface rounded-full"></span>
                  )}
                  {currentStatus === "prospect" && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-400 border-4 border-surface rounded-full"></span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider mb-2 ${getStatusClasses(Companies.status)}`}>
                    {Companies.status || "PROSPECT"}
                  </span>
                  <button className="text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container transition-colors flex items-center justify-center">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-h3 text-[18px] text-on-surface group-hover:text-primary transition-colors">
                  {displayName}
                </h3>
                <p className="text-body-sm text-outline">{Companies.role || "Companies"}</p>
                <a className="text-label-sm text-primary font-bold hover:underline mt-1 inline-block" href="#">
                  {Companies.company ? `${Companies.company} Systems Inc.` : "Independent Vendor"}
                </a>
              </div>

              {/* ✅ Conditional wrapper: only renders if channels exist, preserving visual space consistency */}
              <div className="mb-6 min-h-[32px] flex items-center">
                {hasChannels && (
                  <div className="px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 inline-block">
                    <CompaniesChannels channels={Companies.channels} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-outline font-bold">Last Active</span>
                  <span className="text-body-sm text-on-surface">{Companies.lastActive || "Just now"}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center">
                    <Pencil size={20} />
                  </button>
                  <button className="p-2 bg-primary/5 text-primary hover:bg-primary hover:text-on-primary rounded-lg transition-all flex items-center justify-center">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleLimit < contacts.length && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <button 
            onClick={onLoadMore}
            className="px-8 py-3 bg-surface-container-low border border-outline-variant text-on-surface font-label-md rounded-xl hover:bg-surface-container transition-all flex items-center group shadow-sm gap-2"
          >
            Load More Companiess
            <ChevronsDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
          <p className="text-[12px] text-outline mt-4">
            Showing {visibleCompaniess.length} of {totalRecords} premium contacts
          </p>
        </div>
      )}
    </div>
  );
}


