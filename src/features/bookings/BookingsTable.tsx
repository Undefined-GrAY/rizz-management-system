import { BookingRow } from "./BookingRow";
import { Icon } from "../../ui/Icon";
import { Button } from "../../ui/Button";
import { Menus } from "../../ui/Menus";
import { Table } from "../../ui/Table";
import type { SelectOption } from "../../types/types";
import { SortBy } from "../../ui/SortBy";
import { Filter } from "../../ui/Filter";
import { Spinner } from "../../ui/Spinner";
import ErrorFallback from "../../ui/ErrorFallback";
import { useBookings } from "./UseBookings";
import SubMain from "../../ui/SubMain";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

const tableHeaders = [
  { label: "Cabin", sortable: true },
  { label: "Guest", sortable: true },
  { label: "Dates", sortable: true },
  { label: "Status", sortable: true },
  { label: "Amount", sortable: true },
  { label: "", sortable: false },
];

//header 2
const filterOptions = [
  { value: "all", label: "All bookings" },
  { value: "checked-out", label: "Checked Out" },
  { value: "checked-in", label: "checked in" },
  { value: "unconfirmed", label: "Unconfirmed" },
];

const sortOptions: SelectOption[] = [
  {
    value: "totalPrice-desc",
    label: "Amount (High-Low)",
  },
  {
    value: "totalPrice-asc",
    label: "Amount (Low-High)",
  },
  {
    value: "startDate-desc",
    label: "Newest first",
  },
  {
    value: "startDate-asc",
    label: "Oldest first",
  },
];

export const BookingsTable = () => {
  const { isLoading, bookings, count, error } = useBookings();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage: number = Number(searchParams.get("page")) || 1;

  const pageCount = Math.ceil((count || 0) / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, count || 0);

  const handlePrevious = () => {
    const prev = Math.max(currentPage - 1, 1);
    searchParams.set("page", prev.toString());
    setSearchParams(searchParams);
  };

  const handleNext = () => {
    const next = Math.min(currentPage + 1, pageCount);
    searchParams.set("page", next.toString());
    setSearchParams(searchParams);
  };
 

  if (isLoading) return <Spinner />;
  if (error) return <ErrorFallback apiError={String(error)} />;
  return (
    <SubMain>
      <div className="mb-5 mt-2 md:mt-4 md:ml-5  flex gap-8 items-end justify-between">
        <h1 className="hidden xl:block text-3xl font-bold text-slate-900 dark:text-white">
          {""}
        </h1>

        <div className="xl:hidden ml-2">
          <h1 className=" text-slate-900 dark:text-white mb-2">All bookings</h1>
          <p className=" text-slate-600 dark:text-slate-400 mb-0 flex-wrap">
            Manage all guest stays and reservations in one place.
          </p>
        </div>

        <Button
          className="align-bottom text-nowrap  "
          icon={<Icon name="add" size={18} />}
        >
          New
        </Button>
      </div>

      {/*desktop */}
      <div className="hidden xl:block">
        <Menus>
          <Table>
            {/* Filter Bar */}
            <Table.FilterBar>
              <Filter filterField={"status"} options={filterOptions} />
              <div className="flex items-center gap-2 text-sm">
                <SortBy options={sortOptions} />
                <input
                  placeholder="Search guest..."
                  className="px-3 py-1.5 text-sm order border rounded-sm  dark:border-white/80 dark:border-b-blue-400 border-b-blue-400"
                />
              </div>
            </Table.FilterBar>

            <Table.Body>
              <Table.Header variant={"booking"}>
                {tableHeaders.map((header) => (
                  <Table.Column key={header.label}>
                    {header.sortable ? (
                      <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">
                        {header.label}
                        <Icon name="swap_vert" size={14} />
                      </div>
                    ) : (
                      header.label
                    )}
                  </Table.Column>
                ))}
                {/* Add an empty column header for the Actions menu */}
              </Table.Header>
              <Table.Rows>
                {bookings?.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </Table.Rows>
            </Table.Body>
            <Table.Pagination
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={count || 0}
             
            
              onPrevious={handlePrevious}
              onNext={handleNext}
                   disableNext={currentPage >= pageCount}
              disablePrevious={currentPage <= 1}
            />
          </Table>
        </Menus>
      </div>

      {/*mobile */}
      <div className="xl:hidden">
        <Menus>
          <Table>
            <Table.FilterBar>
              {/* desktop */}
              <div className="hidden md:flex justify-between md:w-full">
                <Filter filterField={"status"} options={filterOptions} />
                <div className="flex gap-4">
                  <SortBy options={sortOptions} />
                  <input
                    placeholder="Search guest..."
                    className="px-3 py-1.5 text-sm border rounded-lg border-b-blue-400"
                  />
                </div>
              </div>
              {/* mobile */}
              <div className=" md:hidden">
                <SortBy options={sortOptions} />
              </div>
              <input
                placeholder="Search guest..."
                className="w-1/3 md:hidden px-3 py-1.5 text-sm border rounded-sm border-b-blue-400"
              />
            </Table.FilterBar>

            <Table.Body>
              <Table.Rows>
                {bookings?.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </Table.Rows>
            </Table.Body>
            <Table.Pagination
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={count || 0}
             
           
              onPrevious={handlePrevious}
              onNext={handleNext}
                      disableNext={currentPage >= pageCount}
              disablePrevious={currentPage <= 1}
            />
          </Table>
        </Menus>
      </div>
    </SubMain>
  );
};

{
  /*mobile */
}
