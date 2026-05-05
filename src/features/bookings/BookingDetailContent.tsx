import { useState } from "react";
import { Icon } from "../../ui/Icon";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { Modal } from "../../ui/Modal";
import type { BookingDetailHeroProps } from "../../types/types";
import { breakString, formatBookingDate } from "../../utils/helpers";
import { CountryFlag } from "../../data/getCountryFlag";
import { useCheckin } from "../../check-in-out/useCheckin";
import useDeleteBooking from "./useDeleteBooking";
import { useCheckout } from "../../check-in-out/useCheckout";
import UseSettings from "../settings/UseSettings";
import { SpinnerSimple } from "../../ui/Spinner";

export default function BookingDetailContent({
  booking,
  onCancel,
}: BookingDetailHeroProps) {
  const {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    extraPrice,
    cabinPrice,
    status,
    isPaid,
    hasBreakfast: breakfast,
    observations,
    cabins: { name: cabinName, image: cabinImage, regularPrice, discount },
    guests: {
      fullName: guestName,
      email,
      nationality,
      nationalID,
      image: guestImage,
    },
  } = booking;

  //Custom hooks - this 3 recives the booking id freom the oclick buttons
  const { isPending: isDeleting, mutate: deleteBooking } = useDeleteBooking();
  const { checkin, isCheckingIn } = useCheckin(); //use to check in
  const { checkout, isCheckingOut } = useCheckout(); //use to check in
  const { settings, isLoading: isLoadingSettings } = UseSettings();
  const [hasBreakfast, setHasBreakfast] = useState(breakfast ?? false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(isPaid || false);

  const isCheckedIn = booking.status === "checked-in";
  const isCheckedOut = booking.status === "checked-out";

  const breakfastPrice = settings?.breakfastPrice || 0;
  const stayPrice = cabinPrice * numNights; //no discount needed since we already added discount in the seeded data

  // breakfast
  const breakfastTotal = hasBreakfast
    ? breakfastPrice * numGuests * numNights
    : 0;

  const totalAmount = stayPrice + breakfastTotal;

  console.log({
    bookingid: bookingId,
    cabinprice: cabinPrice,
    extraPrice: extraPrice,
    totalprice: totalPrice,
    stayprice: stayPrice,
    totalamount: totalAmount,
    guest: numGuests,
  });

  const handleCheckIn = () => {
    if (!paymentConfirmed) {
      alert("Please confirm payment before checking in");
      return;
    }
    const breakfastData = { hasBreakfast };
    checkin({ bookingId, breakfastData });
  };

  //  if (true) return <SpinnerMiniCustom />;
  return (
    <div className="bg-white dark:bg-slate-800/55 lg:rounded-t-xl lg:rounded-b-xl ">
      {/* Hero Section - Cabin Image with Overlays */}
      <div className="relative h-96 lg:rounded-t-xl  overflow-hidden shadow-lg">
        {/* Background Image */}
        {/* <!-- Background Image --> */}
        <div className="absolute inset-0">
          <img
            src={cabinImage}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Resort"
          />
          {/* <!-- Top shadow for badge legibility --> */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent"></div>
        </div>

        {/* Status Badge - Top Left */}
        <div className="absolute top-6 right-6  md:top-6 md:right-6 lg:top-6 lg:left-6">
          <Badge status={status} />
        </div>

        <div className="absolute bottom-0 z-10   px-4 py-12 md:px-10 md:py-6 lg:px-14  lg:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap:10">
            <div className="hidden md:block lg:hidden md:order-2"></div>
            {/* <!-- Col 1: Hero Info --> */}
            <div className="lg:col-span-1 order-2 md:order-3 lg:order-0">
              <h2 className="text-white mb-3 md:mb-4 leading-tight text-shadow-strong capitalize">
                {breakString(cabinName)}
              </h2>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">
                    calendar_today
                  </span>
                  <span className="text-sm font-medium">
                    {formatBookingDate(startDate)} —{" "}
                    {formatBookingDate(endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">
                    group
                  </span>
                  <span className="text-sm font-medium">2 Guests</span>
                </div>
              </div>
            </div>

            {/* <!-- Col 2: Primary Guest --> */}
            <div className="flex flex-col justify-end border-l border-white/10 pl-4 md:pl-6 lg:pl-8">
              <p className="text-white/40 md:text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                Primary Resident
              </p>
              <h3 className="text-white md:text-white/85 lg:text-white mb-1 ">
                {guestName}
              </h3>
              <p className="text-slate-300 font-medium text-sm">{email}</p>
            </div>

            {/* <!-- Col 3: Details --> */}
            <div className="flex flex-col justify-end border-l border-white/10 pl-4 md:pl-6 lg:pl-8 md:order-6 lg:order-0">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                Identification
              </p>
              <h4 className="text-white lg:text-xl font-mono mb-1 tracking-wider">
                {nationalID}
              </h4>
              <div className="flex items-center gap-2 text-slate-400">
                <CountryFlag country={nationality} />
                <span className="text-sm font-medium">{nationality}</span>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- THE FEATHERED LAYER --> */}
        <div className="hidden md:flex absolute top-0 bottom-0 left-0  w-full md:relative mt-auto min-h-60 md:min-h-96  flex-col justify-end feather-mask-vertical"></div>
        {/* <!-- BLUR VERTICAL --> */}
        <div className="hidden md:block absolute w-full top-50 bottom-0 left-0 overlay-blur-vertical "></div>

        <div className="absolute top-0 bottom-0 left-0 feather-mask-horizontal md:hidden w-full md:relative mt-auto min-h-60 md:min-h-96 flex flex-col justify-end md:feather-mask-vertical"></div>
        {/* <!-- BLUR hORIZONTAL--> */}
        <div className=" md:hidden absolute w-full top-0 bottom-0 right-50 overlay-blur-horizontal "></div>
      </div>

      {/* Content Cards */}
      <div className="max-w-3xl mx-auto space-y-3 md:space-y-4 lg:space-y-6 ">
        <div className="p-4 md:p-8 space-y-8">
          {/* Booking Options Section - Only show if not checked out */}
          {!isCheckedOut && (
            <div className="mt-3">
              <h2 className="text-slate-900 dark:text-white mb-4">
                Booking Options
              </h2>

              <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon
                      name="restaurant"
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Breakfast included
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ${breakfastPrice} per person per night
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hasBreakfast}
                    onChange={(e) => setHasBreakfast(e.target.checked)}
                    disabled={isCheckedIn || isCheckedOut}
                    className="peer sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      hasBreakfast
                        ? "bg-primary"
                        : "bg-slate-300 dark:bg-slate-600"
                    } ${(isCheckedIn || isCheckedOut) && "opacity-50"}`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow-md transition-transform ${
                        hasBreakfast ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Divider */}
          {!isCheckedOut && (
            <div className="border-t border-slate-200 dark:border-slate-800" />
          )}

          {/* Payment Summary Section */}
          {status !== "unconfirmed" ? (
            // <SpinnerSimple />

            <div>
              <div className="price-summary">
                <h3 className="text-slate-900 dark:text-white mb-5">
                  Payment Summary
                </h3>
                <div className="space-y-2 mb-5 mx-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600   dark:text-slate-400">
                      <p className="font-semibold">Cabin-discount / Night</p>
                      <p className="text-sm">
                        ( {booking.cabins.regularPrice}
                        {discount && ` - ${discount}`} ) × {booking.numNights}
                      </p>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {(cabinPrice * numNights).toFixed(2)}
                    </span>
                  </div>
                  {extraPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold  dark:text-slate-400">
                        <p className="font-semibold">Extras:</p>
                        <p className="text-sm">
                          ( {booking.numGuests} × {booking.numNights} )
                        </p>
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {extraPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10 rounded-lg p-5 mb-4 md:mb-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-slate-900 dark:text-white">Total:</h4>
                    <span className="text-xl md:text-3xl font-bold text-primary">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-slate-900 dark:text-white mb-5">
                Payment Summary
              </h3>

              {isLoadingSettings ? (
                <SpinnerSimple />
              ) : (
                <div>
                  <div className="space-y-3 mb-5 mx-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">
                        <p className="font-semibold  ">
                          Cabin-discount / Night
                        </p>

                        <p className="text-sm">
                          ( {booking.cabins.regularPrice}
                          {discount && ` - ${discount}`} ) × {booking.numNights}
                        </p>
                      </span>

                      <span className="font-semibold  text-slate-900 dark:text-white">
                        ${stayPrice.toFixed(2)}
                      </span>
                    </div>

                    {hasBreakfast && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">
                          <p className="font-semibold ">Breakfast / Night</p>
                          <p className="text-sm">
                            ( {booking.numGuests} × {booking.numNights} )
                          </p>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ${breakfastTotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total Amount - Prominent */}
                  <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10 rounded-lg p-5 mb-4 md:mb-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-slate-900 dark:text-white">
                        Total Amount
                      </h4>
                      <span className="text-xl md:text-3xl font-bold text-primary">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Confirmation - Only show if not checked in/out */}
                  {!isCheckedIn && !isCheckedOut && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={paymentConfirmed}
                            onChange={(e) =>
                              setPaymentConfirmed(e.target.checked)
                            }
                            className="peer sr-only"
                          />
                          <div
                            className={`size-5 rounded border-2 transition-all ${
                              paymentConfirmed
                                ? "bg-primary border-primary"
                                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {paymentConfirmed && (
                              <Icon
                                name="check"
                                size={14}
                                className="text-white"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            Confirm payment received
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            I confirm that{" "}
                            <span className="font-medium text-slate-900 dark:text-white">
                              {booking.guests.fullName}
                            </span>{" "}
                            has paid the total amount of{" "}
                            <span className="font-medium text-primary">
                              ${totalAmount.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2  p-6 md:p-8 ">
          {/* Left - Delete Button */}
          <Modal>
            <Modal.Open opens="delete-booking">
              <Button
                variant="danger"
                size="md"
                className="text"
                icon={<Icon name="delete" size={18} />}
                disabled={isDeleting}
              >
                <span>Delete</span>
              </Button>
            </Modal.Open>

            <Modal.Window name="delete-booking">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Icon
                      name="warning"
                      size={24}
                      className="text-red-600 dark:text-red-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Delete Booking
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to delete booking{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    #{bookingId}
                  </span>{" "}
                  for{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {booking.guests.fullName}
                  </span>
                  ? All booking data will be permanently removed.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <Modal.Open opens="">
                    <Button variant="secondary" size="lg">
                      Cancel
                    </Button>
                  </Modal.Open>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => deleteBooking(bookingId)}
                    disabled={isDeleting}
                    icon={
                      isDeleting ? (
                        <Icon
                          name="refresh"
                          className="animate-spin"
                          size={18}
                        />
                      ) : (
                        <Icon name="delete" size={18} />
                      )
                    }
                  >
                    {isDeleting ? "Deleting..." : "Delete Booking"}
                  </Button>
                </div>
              </div>
            </Modal.Window>
          </Modal>

          {/* Right - Check In/Out or Back Button */}
          <div className="flex items-center gap-3">
            {!isCheckedIn && !isCheckedOut && (
              <>
                <Button
                  onClick={() => handleCheckIn()}
                  disabled={
                    !paymentConfirmed || isCheckingIn || isLoadingSettings
                  }
                  size="md"
                  icon={
                    isCheckingIn ? (
                      <Icon name="refresh" className="animate-spin" size={18} />
                    ) : (
                      <Icon name="login" size={18} />
                    )
                  }
                >
                  {isCheckingIn ? "Checking In..." : <span>Check in</span>}
                </Button>
              </>
            )}

            {isCheckedIn && (
              <>
                <Button
                  onClick={() => checkout(bookingId)}
                  disabled={isCheckingOut}
                  size="md"
                  icon={
                    isCheckingOut ? (
                      <Icon name="refresh" className="animate-spin" size={18} />
                    ) : (
                      <Icon name="logout" size={18} />
                    )
                  }
                >
                  {isCheckingOut ? "Checking Out..." : <span>Check out</span>}
                </Button>
              </>
            )}

            {isCheckedOut && (
              <Button variant="secondary" onClick={onCancel} size="lg">
                Back to Bookings
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
