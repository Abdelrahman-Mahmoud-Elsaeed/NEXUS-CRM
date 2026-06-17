import { Request, Response } from "express";
import { contactService } from "./contacts.service";

export class ContactController {
  async getContacts(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await contactService.getContacts(orgId, search, page, limit);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: result.data,
    });
  }

  async createContact(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    console.log(req.body)
    
    const result = await contactService.createContact(orgId, req.body);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: result.data,
    });
  }
}

export const contactController = new ContactController();