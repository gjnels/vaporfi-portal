import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePagination } from "../../hooks/usePagination";

/*
  source: https://github.com/mayankshubham/react-pagination.git
*/

export const Pagination = ({
  totalCount,
  siblingCount = 1,
  pageSize = 10,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (pageSize >= totalCount) {
    return null;
  }

  const lastPage = paginationRange[paginationRange.length - 1];
  const firstPageIndex = (currentPage - 1) * pageSize;
  const lastPageIndex = firstPageIndex + pageSize;

  return (
    <div
      className={twMerge(
        "flex items-center justify-between gap-2 self-center p-2",
        className
      )}
    >
      <button
        className={twMerge(
          "mr-2 inline-flex h-[2em] w-[2em] items-center justify-center rounded-md border border-gray-300 disabled:border-gray-500 disabled:text-gray-500",
          currentPage !== 1 && "hover:bg-gray-700"
        )}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        <ChevronLeftIcon className="h-[1.5em]" />
      </button>
      {paginationRange.map((pageNumber, index) =>
        pageNumber === "dots" ? (
          <div className="inline-flex h-[2em] w-[2em] items-center justify-center">
            <EllipsisHorizontalIcon className="h-[1.5em]" />
          </div>
        ) : (
          <button
            className={`${
              pageNumber === currentPage ? "bg-gray-600" : "hover:bg-gray-700"
            } inline-flex h-[2em] w-[2em] items-center justify-center rounded-md border border-gray-300 transition`}
            key={index}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      )}
      <button
        className={twMerge(
          "ml-2 inline-flex h-[2em] w-[2em] items-center justify-center rounded-md border border-gray-300 disabled:border-gray-500 disabled:text-gray-500",
          currentPage !== lastPage && "hover:bg-gray-700"
        )}
        disabled={currentPage === lastPage}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        <ChevronRightIcon className="h-[1.5em]" />
      </button>
    </div>
  );
};
