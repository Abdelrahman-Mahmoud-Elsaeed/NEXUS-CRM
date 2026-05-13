export const userWithOrganizationsInclude = {
  organizations: {
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const;
