import { MemberService } from "./member.service";

import { SessionService } from "@modules/session/session.service";
import { Request, Response } from "express";
import { GetOrgMembersApiResponse } from "./member.dto";

const memberService = new MemberService();
const sessionService = new SessionService();

export class MemberController {


  async getOrganizationMembers(
    req: Request,
    res: Response,
  ): Promise<Response<GetOrgMembersApiResponse>> {
    const userId = req.user?.userId;
    const targetOrgId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await memberService.getOrganizationMembers(
      userId,
      targetOrgId,
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

    return res.status(result.statusCode).json({
      success: true,
      data: { members: result.data },
    });
  }
}
