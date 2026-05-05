import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../service/apiBookings";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface BookingResponse {
  id: number;
  // status: string;
  // [key: string]: any; // Catch-all for other booking properties
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation<
    BookingResponse, // Type of the data returned on success
    Error, // Type of the error
   number // Type of the variable passed to checkout()
  >({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ type: 'active' });
      navigate("/");
    },

    onError: () => toast.error("There was an error while checking out"),
  });

  return { checkout, isCheckingOut };
}
