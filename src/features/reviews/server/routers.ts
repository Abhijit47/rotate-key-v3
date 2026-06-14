import { TRPCError } from "@trpc/server";
import z from "zod";

import { db } from "@/drizzle/db";
import { ReviewTable } from "@/drizzle/schema";
import { reviewFormSchema } from "@/lib/validators/reviews-schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

export const reviewRouter = createTRPCRouter({
  createReview: protectedProcedure
    .input(reviewFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      try {
        // TODO: Later will enable this check
        // const existingReviewWithinSameUser =
        //   await db.query.ReviewTable.findFirst({
        //     where(fields, { and, eq }) {
        //       return eq(fields.userId, user.id);
        //     },
        //   });

        // TODO: Later will enable this check
        // if (existingReviewWithinSameUser) {
        //   throw new TRPCError({
        //     code: 'BAD_REQUEST',
        //     message: 'User already has a review',
        //   });
        // }

        const review = {
          fullName: user.name,
          email: user.email,
          propertyCondition: input.propertyCondition,
          communicationWithOwner: input.communicationWithOwner,
          locationAccessibility: input.locationAccessibility,
          amenitiesFacilities: input.amenitiesFacilities,
          overallExperience: input.overallExperience,
          reason: input.reason,
          userId: user.id,
          isPublic: false,
        };

        const [newReview] = await db
          .insert(ReviewTable)
          .values(review)
          .returning();

        if (!newReview) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Review not created",
          });
        }

        return newReview;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating review",
        });
      }
    }),

  getReviews: baseProcedure.input(z.void()).query(async () => {
    const reviews = await db.query.ReviewTable.findMany({
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
      limit: 20,
      columns: {
        id: true,
        reason: true,
        isPublic: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
      },

      extras: (fields, { sql }) => ({
        // loweredName: sql`lower(${fields.fullName})`.as("lowered_name"),
        // totalReviews: sql<number>`(select count(*) from ${ReviewTable})`.as(
        //   "totalReviews",
        // ),
        averageRating:
          sql<number>`(select avg(x) from unnest(array[${fields.propertyCondition}, ${fields.communicationWithOwner}, ${fields.locationAccessibility}, ${fields.amenitiesFacilities}, ${fields.overallExperience}]) as x)`.as(
            "averageRating",
          ),
      }),
    });
    return reviews;
  }),
});
