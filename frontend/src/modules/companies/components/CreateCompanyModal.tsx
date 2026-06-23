/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Building2,
  Camera,
  Phone,
  Tag,
  Share2,
  FileText,
  AlertCircle,
  Briefcase,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";
import type { FinalCompanySubmissionPayload } from "../types/company.types";
import { useCreateCompanyModalForm } from "../hooks/useCreateCompanyModalForm";
import { ResourceCreateSheet } from "@/shared/ui/resource/resource-createSheet";
import { URL_FIELD_PREFIXES } from "@/shared/utils/urlFieldUtils";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FinalCompanySubmissionPayload & { logoFile?: File | null }) => Promise<{ success: boolean; msg?: string } | void> | void;
}

const baseInputStyles = "w-full px-4 py-2.5 bg-white border rounded-lg text-body-base outline-none transition-all focus:ring-1 text-[14px]";
const errorInputStyles = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const regularInputStyles = "border-outline-variant focus:border-primary focus:ring-primary/20";

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { state, actions } = useCreateCompanyModalForm({ onClose, onSubmit });

  return (
    <ResourceCreateSheet
      isOpen={isOpen}
      onClose={actions.handleClose}
      title="Create New Company"
      formId="create-company-form"
      onSubmit={actions.handleSubmit}
      isSubmitting={state.isSubmitting}
      apiError={state.apiError}
    >
      <>
        <section className="bg-white border border-outline-variant rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">Basic Information</h3>
          </div>

          <div className="flex items-start gap-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                {state.previewUrl ? (
                  <img 
                    src={state.previewUrl} 
                    alt="Logo Preview" 
                    className="w-full h-full object-cover animate-in fade-in duration-200"
                  />
                ) : (
                  <>
                    <Camera size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase group-hover:text-primary text-center px-2">Upload Logo</p>
                  </>
                )}
              </div>
              <input 
                aria-label="Upload company logo" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                type="file" 
                accept="image/*"
                onChange={actions.handleFileChange}
              />
            </div>
            
            <div className="space-y-2 flex-1">
              <label className="text-[12px] text-gray-600 block">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input 
                className={`${baseInputStyles} ${state.errors.name ? errorInputStyles : regularInputStyles}`} 
                placeholder="e.g. Acme Corporation" 
                type="text" 
                {...actions.register("name")} 
              />
              {state.errors.name && (
                <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={14} /> {state.errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[12px] text-gray-600 block">Domain</label>
              <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">
                  {URL_FIELD_PREFIXES.domain}
                </span>
                <input
                  className={`flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px] ${state.errors.domain ? "text-red-600" : ""}`}
                  placeholder="acme.com"
                  type="text"
                  {...actions.register("domain")}
                />
              </div>
              {state.errors.domain && (
                <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={14} /> {state.errors.domain.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[12px] text-gray-600 block">Industry</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className={`${baseInputStyles} pl-10 ${state.errors.industry ? errorInputStyles : regularInputStyles}`} 
                  placeholder="e.g. Technology" 
                  type="text" 
                  {...actions.register("industry")} 
                />
              </div>
            </div>
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
              <label className="text-[12px] text-gray-600 block">Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className={`${baseInputStyles} pl-10 ${state.errors.address ? errorInputStyles : regularInputStyles}`} 
                  placeholder="e.g. 123 Science Park, San Jose, CA" 
                  type="text" 
                  {...actions.register("address")} 
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-outline-variant rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
              <Tag size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">Company Metadata</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-[12px] text-gray-600 block">Status</label>
              <select
                {...actions.register("status")}
                className={`${baseInputStyles} pr-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px_12px] bg-position-[right_16px_center] bg-no-repeat`}
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Customer">Customer</option>
                <option value="Inactive">Inactive</option>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[12px] text-gray-600 block">Employee Count</label>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className={`${baseInputStyles} pl-10 ${state.errors.employeeCount ? errorInputStyles : regularInputStyles}`} 
                  placeholder="e.g. 150" 
                  type="text" 
                  {...actions.register("employeeCount")} 
                />
              </div>
              {state.errors.employeeCount && (
                <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={14} /> {state.errors.employeeCount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[12px] text-gray-600 block">Annual Revenue ($)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className={`${baseInputStyles} pl-10 ${state.errors.annualRevenue ? errorInputStyles : regularInputStyles}`} 
                  placeholder="e.g. 5000000" 
                  type="text" 
                  {...actions.register("annualRevenue")} 
                />
              </div>
              {state.errors.annualRevenue && (
                <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={14} /> {state.errors.annualRevenue.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white border border-outline-variant rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">Social Profiles</h3>
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
                <label className="text-[12px] font-medium text-gray-600">Email Address</label>
                <input
                  className={`${baseInputStyles} ${state.errors.emailHandle ? errorInputStyles : regularInputStyles}`}
                  type="email"
                  placeholder="contact@company.com"
                  {...actions.register("emailHandle")}
                />
                {state.errors.emailHandle && (
                  <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={14} /> {state.errors.emailHandle.message}
                  </p>
                )}
              </div>
            )}
            {state.channels?.includes("whatsapp" ) && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-600">WhatsApp</label>
                <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                  <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">{URL_FIELD_PREFIXES.whatsapp}</span>
                  <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="15550000000" {...actions.register("whatsappHandle")} />
                </div>
              </div>
            )}
            {state.channels?.includes("linkedin" as any) && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-600">LinkedIn Company Page</label>
                <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                  <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">{URL_FIELD_PREFIXES.linkedinCompany}</span>
                  <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="acme" {...actions.register("linkedinHandle")} />
                </div>
              </div>
            )}
            {state.channels?.includes("twitter" as any) && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-600">Twitter / X Profile</label>
                <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                  <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">{URL_FIELD_PREFIXES.twitter}</span>
                  <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="acme" {...actions.register("twitterHandle")} />
                </div>
              </div>
            )}
            {state.channels?.includes("instagram" as any) && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-600">Instagram Handle</label>
                <div className="flex rounded-lg shadow-sm border bg-white overflow-hidden border-outline-variant">
                  <span className="bg-gray-50 px-3 py-2 text-[14px] text-gray-400 border-r border-outline-variant select-none">{URL_FIELD_PREFIXES.instagram}</span>
                  <input className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]" type="text" placeholder="acme" {...actions.register("instagramHandle")} />
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
              placeholder="Write important company details or baseline updates..."
              {...actions.register("notes")}
            />
          </div>
        </section>
      </>
    </ResourceCreateSheet>
  );
};
