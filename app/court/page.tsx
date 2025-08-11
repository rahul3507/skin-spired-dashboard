"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useDeleteCourtMutation,
  useGetAllCourtQuery,
} from "@/redux/feature/courtAPI";
import { useState } from "react";
import Loading from "@/components/Loading";
import { toast } from "sonner";

export default function CourtPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch courts data using the query hook
  const { data, isLoading, isError } = useGetAllCourtQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteCourt] = useDeleteCourtMutation();

  // Calculate total pages based on the API response
  const totalItems = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Extract courts from the API response (fallback to empty array if undefined)
  const courts = data?.data?.result || [];

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteCourt = async (courtId: string) => {
    const res = await deleteCourt(courtId).unwrap();

    if (res?.success === true) {
      toast.success("Court deleted successfully!");
    }
  };

  return (
    <div>
      {/* Create Court Button */}
      <div className="flex justify-end items-center space-x-4 mb-8 mr-5">
        <Link href="/createCourt">
          <button
            type="button"
            className="px-8 py-2 font-semibold rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white shadow-lg hover:from-blue-700 hover:via-blue-600 hover:to-teal-500 transition-all duration-300"
          >
            Create
          </button>
        </Link>
      </div>

      {/* Courts Grid */}
      <div className="w-full max-w-8xl mx-auto p-4">
        {isLoading && <Loading />}
        {isError && (
          <p className="text-red-700">
            Error fetching courts. Please try again.
          </p>
        )}
        {!isLoading && !isError && courts.length === 0 && (
          <p className="text-red-700">No courts available.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts?.map((court: any) => (
            <div
              key={court._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-48">
                <Image
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + court.image}
                  alt={`Image of ${court.name}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {court.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      ${court.price}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Address: {court.address}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Slot Duration: {court.slotTime}
                    </p>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                      Status:{" "}
                      {court.isDeleted ? (
                        <span className="text-red-600">Deleted</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </p>
                    {/* Available Slots Mapping */}
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold">Available Slots:</p>
                      {court.availableSlots &&
                      court.availableSlots.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {court.availableSlots.map((slot: any) => (
                            <li key={slot._id}>
                              <span className="font-medium">{slot.date}: </span>
                              {slot.slots
                                .filter((s: any) => s.isAvailable)
                                .map((s: any) => s.time)
                                .join(", ") || "No available times"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No available slots.</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 h-auto font-medium"
                    >
                      <Link href={`/court/${court._id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteCourt(court._id)}
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 h-auto font-medium"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-sm mx-auto rounded-lg flex items-center justify-between border-t bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black px-4 py-3 mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
              <span className="text-sm text-[#E6E6E6]">Previous</span>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      page === currentPage ? "bg-teal-800 text-white" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#E6E6E6]">Next</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
