/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  User,
  Camera,
  Phone,
  Globe,
  Tag,
  Share2,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { FinalSubmissionPayload } from "../types/contact.types";
import { useCreateContactModalForm } from "../hooks/useCreateContactModalForm";
import { ResourceCreateSheet } from "@/shared/ui/resource/resource-createSheet";

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Adjusted typing payload schema to inherit file tracking references safely
  onSubmit: (data: FinalSubmissionPayload & { avatarFile?: File | null }) => Promise<{ success: boolean; msg?: string } | void> | void;
}

const baseInputStyles = "w-full px-4 py-2.5 bg-white border rounded-lg text-body-base outline-none transition-all focus:ring-1 text-[14px]";
const errorInputStyles = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const regularInputStyles = "border-outline-variant focus:border-primary focus:ring-primary/20";

export const CreateContactModal: React.FC<CreateContactModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { state, actions } = useCreateContactModalForm({ onClose, onSubmit });

  return (
    <ResourceCreateSheet
      isOpen={isOpen}
      onClose={actions.handleClose}
      title="Create New Contact"
      formId="create-contact-form"
      onSubmit={actions.handleSubmit}
      isSubmitting={state.isSubmitting}
      apiError={state.apiError}
    >
      <section className="bg-white border border-outline-variant rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <h3 className="text-[16px] font-bold text-on-surface">Basic Information</h3>
        </div>

        <div className="flex items-start gap-6">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary">
              {state.previewUrl ? (
                <img 
                  src={state.previewUrl} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover animate-in fade-in duration-200"
                />
              ) : (
                <>
                  <Camera size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase group-hover:text-primary text-center px-2">Upload Avatar</p>
                </>
              )}
            </div>
            <input 
              aria-label="Upload contact photo" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              type="file" 
              accept="image/*"
              onChange={actions.handleFileChange}
            />
          </div>
          
          <div className="space-y-2 flex-1">
            <label className="text-[12px] text-gray-600 block">Initials (max 3)</label>
            <input
              className={`${baseInputStyles} ${state.errors.initials ? errorInputStyles : regularInputStyles} w-24`}
              maxLength={3}
              placeholder="JSD"
              type="text"
              {...actions.register("initials")}
            />
            {state.errors.initials ? (
              <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                <AlertCircle size={14} /> {state.errors.initials.message}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400">Auto-generated if left blank</p>
            )}
          </div>
        </div>

        {/* ... Rest of the form markup inputs unchanged ... */}
        <div className="space-y-2">
          <label className="text-[12px] text-gray-600 block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input 
            className={`${baseInputStyles} ${state.errors.name ? errorInputStyles : regularInputStyles}`} 
            placeholder="e.g. Jane Smith" 
            type="text" 
            {...actions.register("name")} 
          />
          {state.errors.name && (
            <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {state.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[12px] text-gray-600 block">
            Primary Email <span className="text-red-500">*</span>
          </label>
          <input 
            className={`${baseInputStyles} ${state.errors.email ? errorInputStyles : regularInputStyles}`} 
            placeholder="jane@company.com" 
            type="email" 
            {...actions.register("email")} 
          />
          {state.errors.email && (
            <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {state.errors.email.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[12px] text-gray-600 block">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                className={`${baseInputStyles} pl-10 ${state.errors.phone ? errorInputStyles : regularInputStyles}`} 
                placeholder="+1 (555) 000-0000" 
                type="tel" 
                {...actions.register("phone")} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[12px] text-gray-600 block">Website</label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                className={`${baseInputStyles} pl-10 ${state.errors.website ? errorInputStyles : regularInputStyles}`} 
                placeholder="https://example.com" 
                type="url" 
                {...actions.register("website")} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[12px] text-gray-600 block">Job Title</label>
            <input 
              className={`${baseInputStyles} ${state.errors.jobTitle ? errorInputStyles : regularInputStyles}`} 
              placeholder="e.g. Sales Executive" 
              type="text" 
              {...actions.register("jobTitle")} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] text-gray-600 block">Company Name</label>
            <input 
              className={`${baseInputStyles} ${state.errors.companyName ? errorInputStyles : regularInputStyles}`} 
              placeholder="e.g. Acme Corp" 
              type="text" 
              {...actions.register("companyName")} 
            />
          </div>
        </div>
      </section>

      {/* Metadata, Channels, and Notes sections remain unchanged */}
      <section className="bg-white border border-outline-variant rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
            <Tag size={18} />
          </div>
          <h3 className="text-[16px] font-bold text-on-surface">Contact Metadata</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[12px] text-gray-600 block">Status</label>
            <select
              {...actions.register("status")}
              className={`${baseInputStyles} pr-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px_12px] bg-position-[right_16px_center] bg-no-repeat`}
            >
              <option value="Prospect">Prospect</option>
              <option value="Active">Active</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] text-gray-600 block">Priority</label>
            <select
              {...actions.register("priority")}
              className={`${baseInputStyles} pr-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px_12px] bg-position-[right_16px_center] bg-no-repeat`}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] text-gray-600 block">Source</label>
            <input 
              className="w-full px-4 py-2.5 bg-gray-50 border border-outline-variant rounded-lg text-gray-500 cursor-not-allowed outline-none text-[14px]" 
              readOnly 
              type="text" 
              {...actions.register("source")} 
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-outline-variant rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <Share2 size={18} />
          </div>
          <h3 className="text-[16px] font-bold text-on-surface">Communication Channels</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { id: "mail", label: "Email", sub: "Work" },
            { id: "linkedin", label: "LinkedIn", sub: "Social" },
            { id: "whatsapp", label: "WhatsApp", sub: "Direct" },
            { id: "instagram", label: "Instagram", sub: "Social" },
            { id: "twitter", label: "Twitter / X", sub: "Social" },
          ].map((channel) => {
            const isChecked = state.channels?.includes(channel.id as any) ?? false;
            return (
              <label
                key={channel.id}
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                  isChecked ? "border-purple-600 bg-purple-50/30" : "border-outline-variant hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  checked={isChecked}
                  onChange={() => actions.handleChannelToggle(channel.id as any)}
                />
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-on-surface">{channel.label}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{channel.sub}</span>
                </div>
              </label>
            );
          })}
        </div>

        <div className="space-y-4 empty:hidden transition-all duration-300">
          {state.channels?.includes("mail" ) && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-600">Secondary Email Address</label>
              <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">@</span>
                <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="alternative@domain.com" {...actions.register("emailHandle")} />
              </div>
            </div>
          )}
          {state.channels?.includes("whatsapp" ) && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-600">WhatsApp Handle</label>
              <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">wa.me/</span>
                <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="15550000000" {...actions.register("whatsappHandle")} />
              </div>
            </div>
          )}
          {state.channels?.includes("linkedin" as any) && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-600">LinkedIn Profile URL</label>
              <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">in/</span>
                <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="username" {...actions.register("linkedinHandle")} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border border-outline-variant rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
            <FileText size={18} />
          </div>
          <h3 className="text-[16px] font-bold text-on-surface">Additional Notes</h3>
        </div>
        <div className="space-y-2">
          <textarea
            className={`${baseInputStyles} min-h-[100px] resize-none border-outline-variant`}
            placeholder="Write important custom metadata or baseline updates on this account..."
            {...actions.register("notes")}
          />
        </div>
      </section>
    </ResourceCreateSheet>
  );
};