import { formatISO, subDays, addDays } from "date-fns";
import supabase from "../service/supabase";

const countries = [
  { name: "Nigeria", code: "NG", flag: "https://flagcdn.com/ng.svg" },
  { name: "United States", code: "US", flag: "https://flagcdn.com/us.svg" },
  { name: "United Kingdom", code: "GB", flag: "https://flagcdn.com/gb.svg" },
  { name: "Germany", code: "DE", flag: "https://flagcdn.com/de.svg" },
];

const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Emma",
  "Robert",
  "Olivia",
];
const lastNames = [
  "Edwin",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
];

// 1. GENERATE GUESTS
const guests = Array.from({ length: 30 }).map(() => {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    fullName: `${fName} ${lName}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
    nationality: country.name,
    countryFlag: country.flag,
    nationalID: `${country.code}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
  };
});

export async function seedDatabase() {
  try {
    // A. Clear current bookings (to avoid FK errors)
    await supabase.from("bookings").delete().gt("id", 0);

    // B. Insert Guests and get their IDs
    const { data: createdGuests, error: gError } = await supabase
      .from("guests")
      .insert(guests)
      .select();
    if (gError) throw gError;

    // C. Get existing Cabins (Assuming you already have cabins, or insert them here)
    const [cabinsPromise, settingsPromise] = [
      supabase.from("cabins").select("id, regularPrice, discount"),
      supabase.from("settings").select("breakfastPrice").single(),
    ];

    const [{ data: cabins, error: cError }, { data: settings, error: sError }] =
      await Promise.all([cabinsPromise, settingsPromise]);

    // Handle errors immediately
    if (cError) {
      console.error(cError);
      throw new Error("Cabins could not be loaded");
    }

    if (sError) {
      console.error(sError);
      throw new Error("Settings could not be loaded");
    }

    // D. GENERATE BOOKINGS
    const bookings = createdGuests.map((guest, i) => {
      const cabin = cabins[Math.floor(Math.random() * cabins.length)];
      const numNights = Math.floor(Math.random() * 10) + 1;
      const date = subDays(new Date(), Math.floor(Math.random() * 30)); // Last 30 days

      const cabinPrice = (cabin?.regularPrice ?? 0) - (cabin?.discount ?? 0);
      // const extraPrice = settings.breakfastPrice * numNights; // Random breakfast

      return {
        created_at: formatISO(date),
        startDate: formatISO(addDays(date, 1)),
        endDate: formatISO(addDays(date, 1 + numNights)),
        cabinId: cabin.id,
        guestId: guest.id,
        numNights,
        numGuests: Math.floor(Math.random() * 3) + 1,
        cabinPrice,
        // extraPrice,
        // totalPrice: cabinPrice + extraPrice,
        totalPrice: cabinPrice,
        status: Math.random() > 0.5 ? "checked-in" : "unconfirmed",
        hasBreakfast: false,
        isPaid: Math.random() > 0.3,
      };
    });

    const { error: bError } = await supabase.from("bookings").insert(bookings);

    if (bError) throw bError;
    console.log("Database seeded successfully! 🚀");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  }
}
