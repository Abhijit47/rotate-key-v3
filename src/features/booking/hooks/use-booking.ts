import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

/**
 * Hook for create a booking
 */
export function useCreateBooking() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.booking.createBooking.mutationOptions({
      onSuccess: async (vars) => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.property.getPublicProperties.queryOptions(),
          ),
          queryClient.invalidateQueries(
            trpc.property.getPropertyDetails.queryOptions({
              id: vars.propertyId,
            }),
          ),
        ]);
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for user bookings
 */
export function useGetBookings() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.booking.getBookings.queryOptions());
}

/**
 * Hook for user booking details
 */
export function useGetBooking(bookingId: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.booking.getBooking.queryOptions({
      bookingId,
    }),
  );
}

/**
 * Hook for update a booking status
 */
export function useUpdateBookingStatus() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.booking.updateBookingStatus.mutationOptions({
      onSuccess: async (vars) => {
        await Promise.all([
          await queryClient.invalidateQueries(
            trpc.booking.getBookings.queryOptions(),
          ),
          await queryClient.invalidateQueries(
            trpc.booking.getBooking.queryOptions({
              bookingId: vars.id,
            }),
          ),
          await queryClient.invalidateQueries(
            trpc.property.getPublicProperties.queryOptions(),
          ),
        ]);
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for delete a booking
 */
export function useDeleteBooking() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.booking.deleteBooking.mutationOptions({
      onSuccess: async (vars) => {
        await queryClient.invalidateQueries(
          trpc.booking.getBookings.queryOptions(),
        );
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}
