import { Table } from "../../ui/Table";
import { Modal } from "../../ui/Modal";
import { Menus } from "../../ui/Menus";
import { Link } from "react-router-dom";
import { Badge } from "../../ui/Badge";
import { Icon } from "../../ui/Icon";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { formatBookingDate } from "../../utils/helpers";
import type { BookingRowDetailsProps } from "../../types/types";

export default function BookingRowMobile({ booking, mutate, isPending }: BookingRowDetailsProps) {
  const {
    id: bookingId,
    totalPrice,
    numNights,
    status,
    startDate,
    endDate,
    cabins: { name: cabinName, image: cabinImage },
    guests: { fullName: guestName, email: guestEmail },
  } = booking;

  return (
    <Table.Row className="xl:hidden grid grid-cols-[1fr_min-content] px-4 py-3 md:pb-3 gap-y-2 gap-x-4 md:grid-cols-[2fr_2fr_1fr_1fr] md:grid-rows-1  items-center ">
      <Table.Cell className="">
        <div className="flex items-center gap-3">
          <div
            className="size-12 md:size-16  rounded-lg bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${cabinImage})` }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {guestName}
            </span>
            <span className="text-xs text-slate-500">{guestEmail}</span>
            {/* Badge stays with guest info on mobile */}
            <div className="mt-1 xl:hidden">
              <Badge status={status} />
            </div>
          </div>
        </div>
      </Table.Cell>

      {/* 2. TOP RIGHT: Actions Menu (Always top right) */}
      <Table.Cell className="text-right flex justify-end items-start md:items-center md:order-last">
        <Modal>
       
            <Menus.Toggle id={String(bookingId)} />
            <Menus.List id={String(bookingId)}>
              <Menus.Action icon="visibility">
                <Link to={`/bookings/${bookingId}`}>
                  View Details
                </Link>
              </Menus.Action>
              <Modal.Open opens="delete-booking">
                <li className="flex items-center justify-start gap-3 px-4 py-2.5 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Icon name="delete" size={18} className="text-slate-400 " />
                  <button
                    className="w-full text-sm font-semibold p-0 text-slate-700 dark:text-slate-400 text-left"
                    
                  >
                    Delete
                  </button>
                </li>
              </Modal.Open>
            </Menus.List>
            <Modal.Window name="delete-booking">
              {/* This is the child that receives 'onCloseModal' via cloneElement */}
              <div>
                <ConfirmDelete
                  resourceName={"cabin"}
                  onConfirm={() => mutate(bookingId)}
                  disabled={isPending}
                />
              </div>
            </Modal.Window>
       
        </Modal>
      </Table.Cell>

      {/* 3. BOTTOM LEFT: Cabin ID & Dates */}
      <Table.Cell className=" ">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-slate-400 uppercase md:hidden">
            {bookingId}
          </span>
          <span className="text-sm font-medium md:text-sm">
            {formatBookingDate(startDate)} — {formatBookingDate(endDate)}
          </span>
          <span className="hidden md:block text-[10px] text-slate-400 uppercase font-bold">
            {numNights} nights
          </span>
        </div>
      </Table.Cell>

      {/* 4. BOTTOM RIGHT: Amount */}
      <Table.Cell className="text-right md:text-left">
        <div className="flex flex-col items-end md:items-start">
          <span className="text-[11px] font-semibold text-slate-400 uppercase md:hidden">
            Amount
          </span>
          <span className="text-sm md:text-sm font-bold text-blue-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
