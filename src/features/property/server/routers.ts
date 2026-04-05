import { and, eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { property } from '@/drizzle/schema';
import {
  deletePropertySchema,
  propertyIdSchema,
  propertySchema,
  updatePropertySchema,
} from '@/lib/validators/property-schema';
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';
import { TRPCError } from '@trpc/server';

export const propertyRouter = createTRPCRouter({
  createProperty: protectedProcedure
    .input(propertySchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      try {
        const [newProperty] = await db
          .insert(property)
          .values({
            ...input,
            id: crypto.randomUUID(), // TODO: later remove after new migration with defaultRandom is applied
            images: JSON.parse(JSON.stringify(input.images)),
            amenities: JSON.parse(JSON.stringify(input.amenities)),
            authorId: user.id,
          })
          .returning();

        return newProperty;
      } catch (error) {
        console.error('Error creating property:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating the property.',
        });
      }
    }),

  updateProperty: protectedProcedure
    .input(updatePropertySchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      try {
        // update property that associated with the user
        const { id, ...updateData } = input;

        const existingProperty = await db.query.property.findFirst({
          where: and(eq(property.id, id), eq(property.authorId, user.id)),
        });

        if (!existingProperty) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found',
          });
        }

        const [updatedProperty] = await db
          .update(property)
          .set({
            ...updateData,
            images: updateData.images
              ? updateData.images
              : existingProperty.images,
            amenities: updateData.amenities
              ? updateData.amenities
              : existingProperty.amenities,
          })
          .where(and(eq(property.id, id), eq(property.authorId, user.id)))
          .returning();
        return updatedProperty;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error updating property:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the property.',
        });
      }
    }),

  deleteProperty: protectedProcedure
    .input(deletePropertySchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      try {
        // delete property that associated with the user
        const { id } = input;

        const existingProperty = await db.query.property.findFirst({
          where: and(eq(property.id, id), eq(property.authorId, user.id)),
        });

        if (!existingProperty) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found',
          });
        }

        const deleted = await db
          .delete(property)
          .where(and(eq(property.id, id), eq(property.authorId, user.id)))
          .returning();
        return deleted;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting property:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the property.',
        });
      }
    }),

  getPrivateProperties: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;

    // get properties that associated with the user
    const properties = await db.query.property.findMany({
      where: eq(property.authorId, user.id),
      orderBy: (property, { desc }) => desc(property.createdAt),
    });

    if (properties.length === 0) {
      return [];
    }

    return properties;
  }),

  // Every card in the public listings page links here, but this route prefetches and renders getUserProperty semantics. Even after the server starts honoring id, non-owners still will not be able to open someone else’s listing from the feed. This page needs a listing-by-id query; keep getUserProperty for owner-only edit flows.

  getUserProperty: protectedProcedure
    .input(propertyIdSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const { id } = input;

      // get properties that associated with the user or not within the user
      const removeProperty = await db.query.property.findFirst({
        where: and(eq(property.id, id), eq(property.authorId, user.id)),
      });

      if (!removeProperty) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Property not found',
        });
      }

      return removeProperty;
    }),

  getPublicProperties: baseProcedure.query(async () => {
    // get all properties
    const properties = await db.query.property.findMany({
      orderBy: (property, { desc }) => desc(property.createdAt),
    });

    if (!properties) {
      return [];
    }

    return properties;
  }),
});
