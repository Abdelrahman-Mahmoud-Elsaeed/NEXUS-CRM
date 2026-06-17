import { Request, Response } from "express";
import { OrganizationService } from "./organization.service";
import {
  GetUserOrganizationsResponse,
  UpdateOrgNameApiResponse,
} from "./organization.dto";

const organizationService = new OrganizationService();

export class OrganizationController {
  async getUserOrganizations(
    req: Request,
    res: Response,
  ): Promise<Response<GetUserOrganizationsResponse>> {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.getUserOrganizations(userId);

    return res.status(result.statusCode).json({
      success: true,
      data: { organizations: result.data },
    });
  }



  async updateOrganizationName(
    req: Request,
    res: Response,
  ): Promise<Response<UpdateOrgNameApiResponse>> {
    const userId = req.user?.userId;
    const targetOrgId = req.params.id as string;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.updateOrganizationName(
      userId,
      targetOrgId,
      { name },
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason:
          result.reason === "NOT_A_MEMBER"
            ? "FORBIDDEN_ORGANIZATION_ACCESS"
            : "UNAUTHORIZED",
        msg: result.msg,
      });
    }

    return res
      .status(result.statusCode)
      .json({ success: true, data: result.data });
  }

}
