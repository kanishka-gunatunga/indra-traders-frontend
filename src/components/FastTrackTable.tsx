"use client";
import { useState } from "react";

export interface FastTrack {
  vehicleMake: string;
  model: string;
  year: number;
  transmission: string;
  price: string;
}

interface TableProps {
  fastTrackData: FastTrack[];
  rowsPerPage?: number;
  handleClick: (item: FastTrack) => void;
}

export default function FastTrackTable({
  fastTrackData,
  rowsPerPage = 10,
  handleClick
}: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(fastTrackData.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentData = fastTrackData.slice(startIdx, endIdx);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Improved pagination logic
  const getPagination = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 6) {
      // Show all if few pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show second page if currentPage is still near the start
      if (currentPage <= 3) {
        pages.push(2, 3);
        pages.push("...");
      }
      // Middle range
      else if (currentPage < totalPages - 2) {
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
      }
      // Near the end
      else {
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1);
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full">
      <div className="h-[400px] overflow-x-auto overflow-y-hidden">
        <div className="min-w-[1000px]">
          {/* Table header */}
          <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
            <div className="w-1/5 px-3 py-2">Vehicle Make</div>
            <div className="w-1/5 px-3 py-2">Vehicle Model</div>
            <div className="w-1/5 px-3 py-2">Manufacture Year</div>
            <div className="w-1/5 px-3 py-2">Transmission</div>
            <div className="w-1/5 px-3 py-2">Price</div>
          </div>

          {/* Table body */}
          <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
            {currentData.map((item, idx) => (
              <div
                key={idx}
                className="flex text-lg mt-2 text-black hover:bg-gray-50 transition"
                onClick={()=>{handleClick(item)}}
              >
                <div className="w-1/5 px-3 py-2">{item.vehicleMake}</div>
                <div className="w-1/5 px-3 py-2">{item.model}</div>
                <div className="w-1/5 px-3 py-2">{item.year}</div>
                <div className="w-1/5 px-3 py-2">{item.transmission}</div>
                <div className="w-1/5 px-3 py-2">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 gap-2">
        {/* Prev button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {/* Page numbers */}
        {getPagination().map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-3 py-1">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => handlePageChange(p as number)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === p
                  ? "bg-[#DB2727] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
