import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  updateBookingPayment,
  updateCheckinWithCalc,
} from "../service/apiBookings"; // Adjust path
import { type Database } from "../types/supabase"; // Adjust path

// Define the arguments for the mutation function
interface CheckinArgs {
  bookingId: number;
  breakfastData?: {
    hasBreakfast: boolean;
  };
}

// Get the Row type for a booking so onSuccess knows what 'data' is
type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending: isCheckingIn } = useMutation<
    BookingRow, // The type of 'data' returned by onSuccess
    Error, // The type of error
    CheckinArgs // The type of variables passed to mutate()
  >({
    mutationFn: ({ bookingId, breakfastData }) => {
      if (breakfastData?.hasBreakfast === true) {
        const hasBreakfast = breakfastData.hasBreakfast;

        const isPaid = true;
        return updateCheckinWithCalc(bookingId, hasBreakfast, isPaid);
      } else {
        const status = "checked-in";
        const isPaid = true;
        return updateBookingPayment(bookingId, status, isPaid);
      }
    },

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ type: "active" });
      // navigate("/");
    },

    onError: () => toast.error("There was an error while checking in"),
  });

  return { checkin, isCheckingIn };
}
