import { Table } from "../../ui/Table";
import { Menus } from "../../ui/Menus";
import CabinRow from "./CabinRow";
import type { Cabin, CabinApiType, CabinProps } from "../../types/types";
import { Spinner } from "../../ui/Spinner";
import { Button } from "../../ui/Button";
import { Icon } from "../../ui/Icon";
import { Modal } from "../../ui/Modal";
import { AddCabinForm } from "./AddCabin";
import ErrorFallback from "../../ui/ErrorFallback";
import { PAGE_SIZE } from "../../utils/constants";
import UseCabins from "./UseCabins";
import {  useSearchParams } from "react-router-dom";

export function CabinsTable() {
  const { isPending, cabins, count, error } = UseCabins();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage: number = Number(searchParams.get("page")) || 1;


  const pageCount = Math.ceil((count || 0) / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, count || 0);

  const handlePrevious = () => {
    const prev = currentPage > 1 ? currentPage - 1 : currentPage;
    searchParams.set("page", prev.toString());
    setSearchParams(searchParams); // This is usually enough if done right
  };

  const handleNext = () => {
    const next = currentPage < pageCount ? currentPage + 1 : currentPage;
    // CRITICAL: Always create a NEW URLSearchParams object to ensure a state update
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", next.toString());
    setSearchParams(newParams);
  };

  if (isPending) return <Spinner />;
  if (error) return <ErrorFallback apiError={String(error)} />;
  return (
    <>
      <Modal>
        <div className="mb-5 mt-2 md:mt-4 gap-8 flex items-center justify-between">
          <h1 className="hidden xl:block text-3xl font-bold text-slate-900 dark:text-white">
            {""}
          </h1>

          <div className="xl:hidden ml-2">
            <h1 className=" text-slate-900 dark:text-white mb-2">All cabins</h1>
            <p className=" text-slate-600 dark:text-slate-400 mb-0 flex-wrap">
              Manage and create cabin in one place.
            </p>
          </div>
          <Modal.Open opens="new-cabin">
            <Button icon={<Icon name="add" size={18} />}>New</Button>
          </Modal.Open>

          <Modal.Window name="new-cabin">
            <AddCabinForm />
          </Modal.Window>
        </div>
      </Modal>

      {/*desktop */}
      <div className="hidden xl:block">
        <Table>
          {/* Filter Bar */}
          <Table.FilterBar>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-white border rounded-md">
                All (12)
              </span>
              <span className="px-3 py-1 cursor-pointer hover:bg-slate-100 rounded-md">
                Available (8)
              </span>
            </div>
            <input
              placeholder="Search cabins..."
              className="px-3 py-1.5 text-sm"
            />
          </Table.FilterBar>

          {/* Table */}

          <Table.Body>
            <Table.Header>
              <Table.Column>Image</Table.Column>
              <Table.Column>Cabin name</Table.Column>
              <Table.Column>Capacity</Table.Column>
              <Table.Column>Price</Table.Column>
              <Table.Column>Discount</Table.Column>
            </Table.Header>

            <Table.Rows>
              {cabins?.map((cabin: CabinProps) => (
                <CabinRow cabin={cabin} key={cabin.id} />
              ))}
            </Table.Rows>
          </Table.Body>

          {/* Pagination */}
          <Table.Pagination
            startIndex={startIndex}
            endIndex={endIndex}
            totalCount={count || 0}
          
       
            onPrevious={handlePrevious}
            onNext={handleNext}
                     disableNext={currentPage >= pageCount}
              disablePrevious={currentPage <= 1}
          ></Table.Pagination>
        </Table>
      </div>

      {/*mobile */}
      <div className="xl:hidden">
        <Menus>
          <Table>
            <Table.FilterBar>
              {/* desktop */}
              <div className="hidden md:flex justify-between md:w-full">
                {/* <Filter filterField={"status"} options={filterOptions} />
                          <div className="flex gap-4">
                            <SortBy options={sortOptions} /> */}
                <input
                  placeholder="Search cabin..."
                  className="px-3 py-1.5 text-sm border rounded-lg border-b-blue-400"
                />
             
              </div>
              {/* mobile */}
              <div className=" md:hidden">
                {/* used as extra block for flwex*/}
              </div>
              <input
                placeholder="Search cabin..."
                className="w-1/3 md:hidden px-1 py-1.5 text-sm border rounded-sm border-b-blue-400"
              />
            </Table.FilterBar>

            <Table.Body>
              <Table.Rows>
                {cabins?.map((cabin: CabinProps) => (
                  <CabinRow cabin={cabin} key={cabin.id} />
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
    </>
  );
}
