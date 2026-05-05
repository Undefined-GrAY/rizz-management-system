import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";
import type {
  Booking,
  BookingpageType,
  BookingWithDetails,
  GetbookingsFilter,
  NumericValue,
  recentBooking,
  TodaysActivity,
  UpdateBooking,
} from "../types/types";

interface BookingsResponse {
  data: BookingWithDetails[]; // This array is what was missing
  count: number | null;
}

export async function getBookings({
  filter,
  sortBy,
  page,
}: GetbookingsFilter): Promise<BookingsResponse> {
  //const { data: cabins, error }
  let query = supabase.from("bookings").select(
    `id, 
      startDate, 
      endDate, 
      numNights, 
      numGuests, 
      cabins(name, image),
      extraPrice, 
      totalPrice, 
      status, 
      hasBreakfast, 
      isPaid, 
      observations, 
      guests(fullName, email)
    `,
    { count: "exact" },
  );

  // const method = filter.method || "eq";
  // FILTER
  if (filter) query = query["eq"](filter.field, filter.value);

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error(error);
    throw new Error("bookings could not be loaded");
  }

  return { data, count } as BookingsResponse;
}

export async function deleteBooking(id: NumericValue): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("cabin could not be deleted");
  }
  return data as Booking;
}

// 1. Ensure you use the interface we built

// 2. Use a standard 'number' type for the ID.
// If it's coming from useParams, wrap it in Number() before calling this.
export async function getBooking(id: number): Promise<BookingpageType> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      created_at,
      id, 
      startDate, 
      endDate, 
      numNights, 
      numGuests, 
      extraPrice,
      cabinPrice, 
      totalPrice, 
      status, 
      hasBreakfast, 
      isPaid, 
      observations, 
      cabins(name, image, regularPrice, discount),
      guests(fullName, email, nationality, nationalID, image)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  // Explicitly return the data
  return data as BookingpageType;
}

export async function updateBookingPayment(
  id: number,
  status: string = "unconfirmed",
  isPaid: boolean,
): Promise<Booking> {
  console.log("booking id:", id, "status:", status, "isPaid:", isPaid );
  // We call the SQL function we created in Supabase
  const { data, error } = await supabase.rpc("update_booking_payment", {
    p_booking_id: id,
    p_is_paid: isPaid,
    p_status: status,
  });

  if (error) {
    console.error(error.message);
    throw new Error("Booking payment and totals could not be updated");
  }

  return data as Booking;
}

export async function updateBooking(
  id: number,
  obj: UpdateBooking,
): Promise<Booking> {
  
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data as Booking;
}

export async function updateCheckinWithCalc(
  bookingId: number,
  hasBreakfast: boolean,
   isPaid: boolean,
): Promise<Booking> {
  // .rpc() is the Supabase method to call your PostgreSQL functions
  console.log("booking id:", bookingId, "hasBreakfast:", hasBreakfast);
  const { data, error } = await supabase.rpc("checkin_and_recalculate", {
    p_booking_id: bookingId,
    p_has_breakfast: hasBreakfast,
     p_is_paid: isPaid,
  });

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data as Booking;
}

export async function getTodaysActivity(): Promise<TodaysActivity[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, status, hasBreakfast, guests(fullName, nationality, countryFlag), numNights",
    )
    .or(`status.eq.unconfirmed,status.eq.checked-in`)
    // Logical Filter: Today's check-ins or Today's check-outs
    // Note: You might need to add .filter logic for the specific date
    .order("created_at", { ascending: false })
    .limit(4); // <--- Engineering Efficiency: Only transfer 4 rows over the network

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data as TodaysActivity[];
}

// type rececntBooking {
//   id: number;
//   created: string;
//   startDate: string;
//   endDate: string;
//   totalPrice: number;
// }

export async function getRecentBookings(
  startDate: string,
): Promise<recentBooking> {
  const { data, error, count } = await supabase
    .from("bookings")
    .select(
      `id, 
      created_at,
      startDate, 
      numNights,
      endDate, 
      status,
      cabinPrice,
      extraPrice, 
      totalPrice
    `,
      { count: "exact" },
    )
    .gte("startDate", startDate)
    .lte("startDate", new Date().toISOString());

  if (error) {
    console.error(error);
    throw new Error("bookings could not be loaded");
  }

  return data as recentBooking;
}
