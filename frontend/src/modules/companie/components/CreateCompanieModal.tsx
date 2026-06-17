import React from "react";
import {
  X,
  User,
  Camera,
  Phone,
  Globe,
  Tag,
  Share2,
  FileText,
  Save,
  AlertCircle,
} from "lucide-react";
import type { ChannelType, FinalSubmissionPayload } from "../types/Companies.types";
import { useCreateCompaniesModalForm } from "../hooks/useCreateCompaniesModalForm";

interface CreateCompaniesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FinalSubmissionPayload) => Promise<{ success: boolean; msg?: string } | void> | void;
}

const baseInputStyles = "w-full px-4 py-2.5 bg-white border rounded-lg text-body-base outline-none transition-all focus:ring-1 text-[14px]";
const errorInputStyles = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const regularInputStyles = "border-outline-variant focus:border-primary focus:ring-primary/20";

export const CreateCompaniesModal: React.FC<CreateCompaniesModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { state, actions } = useCreateCompaniesModalForm({ onClose, onSubmit });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-60 transition-opacity" onClick={actions.handleClose} />

      {/* Flyout Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-150 bg-white shadow-lg z-70 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        <header className="h-16 px-6 border-b border-outline-variant flex items-center justify-between bg-white shrink-0">
          <h2 className="text-[18px] font-bold text-on-surface">Create New Companies</h2>
          <button
            type="button"
            onClick={actions.handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={actions.handleSubmit}
          className="space-y-6 flex-1 overflow-y-auto p-6"
          id="create-Companies-form"
        >
          {/* Global API / Submission Error Alert */}
          {state.apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-red-800">Failed to Create Companies</h4>
                <p className="text-[13px] text-red-700 leading-relaxed">{state.apiError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
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
                  <Camera size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase group-hover:text-primary text-center px-2">Upload Avatar</p>
                </div>
                <input aria-label="Upload Companies photo" className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
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
                Email <span className="text-red-500">*</span>
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
                {state.errors.phone && (
                  <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={14} /> {state.errors.phone.message}
                  </p>
                )}
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
                {state.errors.website && (
                  <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={14} /> {state.errors.website.message}
                  </p>
                )}
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
                {state.errors.jobTitle && (
                  <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={14} /> {state.errors.jobTitle.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[12px] text-gray-600 block">Company Name</label>
                <input 
                  className={`${baseInputStyles} ${state.errors.companyName ? errorInputStyles : regularInputStyles}`} 
                  placeholder="e.g. Acme Corp" 
                  type="text" 
                  {...actions.register("companyName")} 
                />
                {state.errors.companyName && (
                  <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={14} /> {state.errors.companyName.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Companies Metadata */}
          <section className="bg-white border border-outline-variant rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
                <Tag size={18} />
              </div>
              <h3 className="text-[16px] font-bold text-on-surface">Companies Metadata</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] text-gray-600 block">Status</label>
                <select
                  {...actions.register("status")}
                  className={`${baseInputStyles} ${state.errors.status ? errorInputStyles : regularInputStyles} pr-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px_12px] bg-position-[right_16px_center] bg-no-repeat`}
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
                  className={`${baseInputStyles} ${state.errors.priority ? errorInputStyles : regularInputStyles} pr-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px_12px] bg-position-[right_16px_center] bg-no-repeat`}
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

          {/* Section 3: Communication Channels */}
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
                const isChecked = state.channels?.includes(channel.id as ChannelType) ?? false;
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
                      onChange={() => actions.handleChannelToggle(channel.id as ChannelType)}
                    />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-on-surface">{channel.label}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{channel.sub}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Dynamic Social Sub-Inputs Handles */}
            <div className="space-y-4 empty:hidden transition-all duration-300">
              {state.channels?.includes("whatsapp") && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-[12px] font-medium text-gray-600">WhatsApp Handle</label>
                  <div className={`flex rounded-lg shadow-sm border bg-white focus-within:ring-1 overflow-hidden ${state.errors.whatsappHandle ? "border-red-500 focus-within:ring-red-500/20" : "border-outline-variant focus-within:border-primary focus-within:ring-primary/20"}`}>
                    <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">wa.me/</span>
                    <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="15550000000" {...actions.register("whatsappHandle")} />
                  </div>
                  {state.errors.whatsappHandle && (
                    <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {state.errors.whatsappHandle.message}
                    </p>
                  )}
                </div>
              )}

              {state.channels?.includes("linkedin") && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-[12px] font-medium text-gray-600">LinkedIn Profile URL</label>
                  <div className={`flex rounded-lg shadow-sm border bg-white focus-within:ring-1 overflow-hidden ${state.errors.linkedinHandle ? "border-red-500 focus-within:ring-red-500/20" : "border-outline-variant focus-within:border-primary focus-within:ring-primary/20"}`}>
                    <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">in/</span>
                    <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="username" {...actions.register("linkedinHandle")} />
                  </div>
                  {state.errors.linkedinHandle && (
                    <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {state.errors.linkedinHandle.message}
                    </p>
                  )}
                </div>
              )}

              {state.channels?.includes("instagram") && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-[12px] font-medium text-gray-600">Instagram Handle</label>
                  <div className={`flex rounded-lg shadow-sm border bg-white focus-within:ring-1 overflow-hidden ${state.errors.instagramHandle ? "border-red-500 focus-within:ring-red-500/20" : "border-outline-variant focus-within:border-primary focus-within:ring-primary/20"}`}>
                    <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">@</span>
                    <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="username" {...actions.register("instagramHandle")} />
                  </div>
                  {state.errors.instagramHandle && (
                    <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {state.errors.instagramHandle.message}
                    </p>
                  )}
                </div>
              )}

              {state.channels?.includes("twitter") && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-[12px] font-medium text-gray-600">Twitter / X Handle</label>
                  <div className={`flex rounded-lg shadow-sm border bg-white focus-within:ring-1 overflow-hidden ${state.errors.twitterHandle ? "border-red-500 focus-within:ring-red-500/20" : "border-outline-variant focus-within:border-primary focus-within:ring-primary/20"}`}>
                    <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">@</span>
                    <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="username" {...actions.register("twitterHandle")} />
                  </div>
                  {state.errors.twitterHandle && (
                    <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {state.errors.twitterHandle.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Additional Notes */}
          <section className="bg-white border border-outline-variant rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="text-[16px] font-bold text-on-surface">Additional Notes</h3>
            </div>
            <div className="space-y-2">
              <textarea
                className={`${baseInputStyles} min-h-[100px] resize-none`}
                placeholder="Write important custom metadata or baseline updates on this account..."
                {...actions.register("notes")}
              />
            </div>
          </section>
        </form>

        {/* Dynamic Action Footer Panel */}
        <footer className="h-20 px-6 border-t border-outline-variant flex items-center justify-end gap-3 bg-white shrink-0">
          <button
            type="button"
            disabled={state.isSubmitting}
            onClick={actions.handleClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-[14px] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-Companies-form"
            disabled={state.isSubmitting}
            className="px-5 py-2.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white font-medium rounded-lg text-[14px] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {state.isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Companies
              </>
            )}
          </button>
        </footer>
      </div>
    </>
  );
};


