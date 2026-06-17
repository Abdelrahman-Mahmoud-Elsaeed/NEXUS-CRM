/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { 
  Mail, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Loader2, 
  LayoutGrid 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { useAcceptInvitationAuth } from "../hooks/useAcceptInvitationAuth";

// Shadcn UI Primitive Component Imports

export const AcceptInvitationAuth: React.FC = () => {
  const { invitation, isProcessing, actionStatus, feedbackMessage, handleDecision } = useAcceptInvitationAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcf8ff] p-4 font-sans relative overflow-hidden select-none">
      
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(at_0%_0%,rgba(53,37,205,0.03)_0px,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(at_100%_100%,rgba(53,37,205,0.03)_0px,transparent_50%)]" />
      </div>

      <div className="max-w-120 w-full flex flex-col items-center animate-[slideUp_0.6s_ease-out_forwards]">
        
        {/* Brand Header Section */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#3525cd] flex items-center justify-center rounded-lg shadow-lg">
              <LayoutGrid className="text-white h-5 w-5" />
            </div>
            <h2 className="text-[24px] leading-8 font-bold text-[#1b1b24] tracking-tight">Enterprise CRM</h2>
          </div>
          <p className="text-[12px] leading-4 font-medium text-[#464555] uppercase tracking-widest">
            Secure Invitation Portal
          </p>
        </div>

        {/* Main Shadcn Card Interface */}
        <Card className="w-full bg-white border-[#c7c4d8] rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="p-0 text-center mb-8">
            <div className="inline-flex m-auto items-center justify-center w-16 h-16 bg-[#eae6f4] rounded-full mb-4">
              {actionStatus === "accepted" && <CheckCircle2 className="text-[#3525cd] h-8 w-8" />}
              {actionStatus === "declined" && <XCircle className="text-[#3525cd] h-8 w-8" />}
              {actionStatus === "pending" && <Mail className="text-[#3525cd] h-8 w-8" />}
            </div>
            
            <CardTitle className="text-[24px] leading-8 font-bold text-[#1b1b24] mb-2">
              {actionStatus === "accepted" ? "Welcome Aboard!" : actionStatus === "declined" ? "Invitation Declined" : "Invitation Received"}
            </CardTitle>
            
            {actionStatus === "pending" && (
              <p className="text-[14px] leading-5 text-[#464555]">
                <span className="font-semibold text-[#1b1b24]">{invitation?.inviterName}</span> has invited you to join{" "}
                <span className="font-semibold text-[#1b1b24]">{invitation?.targetCompany}</span>.
              </p>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {/* Feedback & Alert Display Channel */}
            {feedbackMessage && (
              <div className={`mb-6 p-4 rounded-lg text-[13px] font-medium border text-center ${
                actionStatus === "accepted" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : actionStatus === "declined"
                  ? "bg-[#f5f2ff] text-[#58579b] border-[#c7c4d8]"
                  : "bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20"
              }`}>
                {feedbackMessage}
              </div>
            )}

            {actionStatus === "pending" && (
              <>
                {/* Contextual Info Grid */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  
                  {/* Role Allocation Row */}
                  <div className="bg-[#f0ecf9] p-4 border-l-4 border-[#3525cd] rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[12px] leading-4 text-[#464555] mb-1">Assigned Role</p>
                      <p className="text-[14px] leading-5 text-[#1b1b24] font-bold">{invitation?.assignedRole}</p>
                    </div>
                    <ShieldCheck className="text-[#3525cd] h-5 w-5" />
                  </div>

                  {/* Secure Profile Credentials Hook */}
                  <div className="bg-[#f5f2ff] p-4 rounded-lg border border-[#c7c4d8] flex items-center gap-4">
                    <Avatar className="w-10 h-10 border border-[#c7c4d8]">
                      <AvatarImage src={invitation?.userAvatar} alt="Identity Avatar" className="object-cover" />
                      <AvatarFallback className="text-xs">JR</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-3 text-[#464555] mb-1">Logged in as</p>
                      <p className="text-[13px] text-[#1b1b24] font-medium truncate">{invitation?.userEmail}</p>
                    </div>

                    <Badge className="bg-[#e2dfff] text-[#413f82] hover:bg-[#e2dfff] text-[10px] uppercase font-bold tracking-tighter rounded border-none">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Interaction Action Group */}
                <div className="flex flex-col gap-3">
                  <Button 
                    disabled={isProcessing}
                    onClick={() => handleDecision("accept")}
                    className="w-full bg-[#3525cd] text-white text-[14px] font-medium py-6 rounded-lg transition-all duration-200 hover:bg-[#4f46e5] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Handshake...
                      </>
                    ) : (
                      <>
                        Accept & Join Team
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="outline"
                    disabled={isProcessing}
                    onClick={() => handleDecision("decline")}
                    className="w-full bg-transparent border-[#777587] text-[#464555] text-[14px] font-medium py-6 rounded-lg transition-all duration-200 hover:bg-[#eae6f4] hover:text-[#1b1b24] active:scale-[0.98] disabled:opacity-50"
                  >
                    Decline Invitation
                  </Button>
                </div>
              </>
            )}

            {/* Encrypted Base Footer Boundary */}
            <footer className="mt-8 pt-6 border-t border-[#c7c4d8] flex items-center justify-center gap-2 text-[#464555] opacity-60">
              <Lock className="h-3.5 w-3.5" />
              <span className="text-[11px] uppercase tracking-widest font-medium">
                End-to-End Encrypted Transfer
              </span>
            </footer>
          </CardContent>
        </Card>

        {/* Outer Help Context Hyperlink */}
        <p className="mt-8 text-[12px] leading-4 text-[#464555] text-center max-w-[320px]">
          If you weren't expecting this invitation, you can safely ignore this prompt or{" "}
          <a className="text-[#3525cd] font-medium hover:underline" href="#contact-support">
            contact support
          </a>.
        </p>
      </div>

      {/* Slide Entry Animators */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};