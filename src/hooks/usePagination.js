import { useMemo } from "react";

const range = (start, end) => {
  let length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  currentPage,
  totalCount,
  siblingCount,
  pageSize,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // determined by sibling count + (first page + last page + current page + ... + ...)(5)
    const totalPageNumbers = siblingCount + 5;

    // if number of pages is less than the page numbers we want to show in the component, return range [1...totalPageCount]
    if (totalPageNumbers >= totalPageCount) return range(1, totalPageCount);

    // determine how many pages are between the start and left-most index
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    // determine how many pages are between the end and right-most index
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    // if there is only one position left between the left/right index and the start/end of the pagination, do not show the dots
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPageCount - 2;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "dots", totalPageCount];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [1, "dots", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, "dots", ...middleRange, "dots", totalPageCount];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
