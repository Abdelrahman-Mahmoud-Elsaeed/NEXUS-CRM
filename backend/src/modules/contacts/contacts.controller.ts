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

  async getAssignedContacts(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const userId = req.params.userId as string;
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await contactService.getAssignedContacts(
      orgId,
      userId,
      search,
      page,
      limit,
    );

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

  async getContact(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const contactId = req.params.id as string;
    const userId = req.user.userId as string;
    const userRole = req.organizationRole as string;

    const result = await contactService.getContact(orgId, contactId,userId,userRole);

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

  async updateContact(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const currentUserId = req.user?.userId!;
    const organizationRole = req.organizationRole;
    const contactId = req.params.id as string;

    const result = await contactService.updateContact(
      orgId,
      contactId,
      currentUserId,
      organizationRole,
      req.body,
    );

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
