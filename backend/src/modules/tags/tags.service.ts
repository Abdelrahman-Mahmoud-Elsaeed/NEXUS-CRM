import { prisma } from "@/shared/config/db/prisma";
import { TagDto, TagServiceResult } from "./tags.dto";

export class TagService {
  async getTags(organizationId: string): Promise<TagServiceResult<TagDto[]>> {
    const tags = await prisma.tag.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
    
    return { success: true, data: tags };
  }

  async createTag(organizationId: string, name: string, colorHex: string): Promise<TagServiceResult<TagDto>> {
    const normalizedName = name.trim();
    
    const existingTag = await prisma.tag.findFirst({
      where: {
        organizationId,
        name: { equals: normalizedName, mode: "insensitive" }
      }
    });

    if (existingTag) {
      return { success: false, reason: "TAG_ALREADY_EXISTS" };
    }

    const newTag = await prisma.tag.create({
      data: { organizationId, name: normalizedName, colorHex },
    });

    return { success: true, data: newTag };
  }
}