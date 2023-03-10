import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// TODO: avatar.z.refine() > condition for size.
export const CreateTeamSchema = z.object({name: z.string(), domain: z.string(), avatar: z.any()})
export type CreateTeamType = z.infer<typeof CreateTeamSchema>

export const teamRouter = createTRPCRouter({
  // QUERIES:
  getAll: protectedProcedure.query(({ctx}) => ctx.prisma.team.findMany()),

  // MUTATIONS:
  create: protectedProcedure.input(CreateTeamSchema).mutation(async ({ctx, input}) => {
    try {
      await ctx.prisma.team.create({
        data: {
          ...input,

          boards: {
            create: {
              name: 'Test',
              columns: {
                create: [
                  {name: 'Backlog'},
                  {name: 'Todo'},
                  {name: 'In Progress'},
                  {name: 'Done'},
                ]
              }
            }
          }
        },
        include: {
          boards: {
            include: {
              columns: true,
            }
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }),

  delete: protectedProcedure.input(z.object({id: z.string()})).mutation(async({ctx, input}) => {
    try {
      await ctx.prisma.team.delete({
        where: {
          ...input,
        }
      })
    } catch (error) {
      console.error(error);
    }
  })
});
