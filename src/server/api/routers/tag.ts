import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const createTagScheme = z.object({name: z.string(), boardId: z.string() })

export type CreateTagType = z.infer<typeof createTagScheme>

export const tagRouter = createTRPCRouter({
  // QUERIES:
  getAll: protectedProcedure.input(z.object({boardId: z.string()})).query(({ctx,input}) => ctx.prisma.tag.findMany({
    where: {
      ...input,
    },
  })),

  // MUTATIONS:
  create: protectedProcedure.input(createTagScheme).mutation(async ({ctx, input}) => {
    try {
      await ctx.prisma.tag.create({
        data: {
          ...input,
        }
      })
    } catch (error) {
      console.error(error)
    }
  }),

  delete: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input}) => {
    try {
      await ctx.prisma.tag.delete({
        where: {
          ...input,
        }
      })
    } catch (error) {
      console.error(error)
    }
  }),
})