import * as React from "react";
import { Mail } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import type { ChannelType } from "../types/company.types";

type IconProps = React.ComponentPropsWithoutRef<"svg">;

const CHANNEL_CONFIG: Record<
  ChannelType,
  { icon: React.ComponentType<IconProps>; colorClass: string; title: string }
> = {
  mail: {
    icon: Mail,
    colorClass: "hover:text-primary",
    title: "Email",
  },
  linkedin: {
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    colorClass: "text-[#0077b5] hover:text-[#005585]",
    title: "LinkedIn",
  },
  whatsapp: {
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z" />
      </svg>
    ),
    colorClass: "hover:text-[#25D366]",
    title: "WhatsApp",
  },
  instagram: {
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    colorClass: "hover:text-[#E1306C]",
    title: "Instagram",
  },
  twitter: {
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2h3.308l-7.227 8.26L22.82 22h-6.64l-5.205-6.807L4.98 22H1.67l7.73-8.832L1.18 2h6.807l4.71 6.231L18.244 2Zm-1.165 18h1.833L7.03 3.915H5.063L17.08 20Z" />
      </svg>
    ),
    colorClass: "hover:text-black",
    title: "Twitter / X",
  },
};

export function CompanyChannels({ channels = [] }: { channels?: ChannelType[] }) {
  if (!channels || channels.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-on-surface-variant">
      {channels.map((channel) => {
        const config = CHANNEL_CONFIG[channel];
        if (!config) return null;

        const IconComponent = config.icon;

        return (
          <IconComponent
            key={channel}
            className={cn(
              "w-4 h-4 cursor-pointer transition-colors",
              config.colorClass,
            )}
          />
        );
      })}
    </div>
  );
}
