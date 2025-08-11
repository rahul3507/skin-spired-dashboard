"use client";

import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import DetailRow from "@/components/DetailRow";
import { useGetAllBookingsQuery } from "@/redux/feature/bookingListAPI";
import Loading from "@/components/Loading";

export default function DashboardContent() {
  return (
    <main className="bg-background2 w-full p-4 md:p-6">
      <section>
        <TransactionTable />
      </section>
    </main>
  );
}

function TransactionTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data, isLoading } = useGetAllBookingsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const bookings = data?.data?.result;

  const totalPages = Math.ceil(bookings?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, bookings?.length);
  const currentTransactions = bookings?.slice(startIndex, endIndex);

  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-white rounded-md">
        <h2 className="text-[32px] font-medium text-primary py-6 px-3">
          Booking List
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black py-8">
              <TableRow>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Court Image
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Court Name
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Price
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Address
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Date
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Time
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Status
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  User Details
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentTransactions?.length > 0 ? (
                currentTransactions?.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell className="text-center text-black text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <img
                          src={
                            process.env.NEXT_PUBLIC_IMAGE_URL +
                            booking?.court?.image
                          }
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-black text-lg">
                      {booking?.court?.name}
                    </TableCell>
                    <TableCell className="text-center text-black text-lg">
                      {booking?.court?.price}
                    </TableCell>
                    <TableCell className="text-center text-black text-lg">
                      {booking?.court?.address}
                    </TableCell>
                    <TableCell className="text-center text-black text-lg">
                      {booking.date}
                    </TableCell>
                    <TableCell className="text-center text-black text-lg">
                      {booking.time}
                    </TableCell>

                    <TableCell className="text-center text-black text-lg">
                      {booking.pending ? "⏳ Pending" : "✅ Confirmed"}
                    </TableCell>

                    <TableCell className="text-center text-black text-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openUserModal(booking.user)}
                      >
                        <Info className="h-6 w-6" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-black text-lg"
                  >
                    No bookings available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-sm mx-auto flex items-center justify-between border-t border-gray-200 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black px-4 py-3 mt-6">
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

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md rounded-md bg-[#000000] px-6 py-6 shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            {/* User Image */}
            {selectedUser && (
              <div className="flex justify-center mb-4">
                <img
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + selectedUser.image}
                  alt={selectedUser?.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            )}

            {/* Heading */}
            <h2 className="mb-6 text-center text-[30px] font-semibold text-[#E6E6E6]">
              User Details
            </h2>

            {/* User Details */}
            <div className="space-y-6">
              <DetailRow
                label="User Name"
                value={selectedUser?.name || "N/A"}
              />
              <DetailRow
                label="Phone Number"
                value={selectedUser?.phone || "N/A"}
              />
              <DetailRow
                label="Join Date"
                value={selectedUser?.email || "N/A"}
              />
            </div>

            {/* Okay Button */}
            <Button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full bg-[#45b1b4] hover:bg-[#5ce1e6b7]"
            >
              Okay
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
