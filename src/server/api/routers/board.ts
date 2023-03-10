import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const getAllBoardsSchema = z.object({teamId: z.string()})
export const getOneBoardSchema = z.object({id: z.string()})
export const createBoardSchema = z.object({name: z.string(), teamId: z.string()})

export type CreateBoardType = z.infer<typeof createBoardSchema>

export const boardRouter = createTRPCRouter({
  // QUERIES:
  getAll: protectedProcedure.input(getAllBoardsSchema).query(({ctx, input}) => ctx.prisma.board.findMany({
    where: {
      ...input,
    }
  })),

  getOne: protectedProcedure.input(getOneBoardSchema).query(({ctx, input}) => ctx.prisma.board.findFirst({
    where: {
      ...input,
    }
  })),

  // MUTATIONS:
  create: protectedProcedure.input(createBoardSchema).mutation( async ({ctx, input}) => {
    try {
      await ctx.prisma.board.create({
        data: {
          ...input,
          columns: {
            create: [
              {name: 'Backlog'},
              {name: 'Todo'},
              {name: 'In Progress'},
              {name: 'Done'},
            ]
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }),

  delete: protectedProcedure.input(getOneBoardSchema).mutation(async ({ctx, input}) => {
    try {
      await ctx.prisma.board.delete({
        where: {
          ...input,
        }
      })
    } catch (error) {
      console.error(error)  
    }
  })
})