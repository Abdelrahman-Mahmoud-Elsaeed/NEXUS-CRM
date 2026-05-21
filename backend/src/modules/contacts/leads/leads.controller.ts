import { Request, Response } from "express";
import { LeadService } from "./leads.service";
import { GetLeadsApiResponse, CreateLeadApiResponse } from "./leads.dto";

const leadService = new LeadService();

export class LeadController {
  async getLeads(req: Request, res: Response): Promise<Response<GetLeadsApiResponse>> {
    const orgId = req.organizationId!;
    const search = req.query.search as string | undefined;

    const result = await leadService.getLeads(orgId, search);
    
    // Explicitly handle failure mapping from the service layer
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        reason: "DATABASE_ERROR" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: { leads: result.data } 
    });
  }

  async createLead(req: Request, res: Response): Promise<Response<CreateLeadApiResponse>> {
    const orgId = req.organizationId!;
    const result = await leadService.createLead(orgId, req.body);

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        reason: "INTERNAL_SERVER_ERROR" 
      });
    }

    return res.status(201).json({ 
      success: true, 
      data: result.data 
    });
  }
}