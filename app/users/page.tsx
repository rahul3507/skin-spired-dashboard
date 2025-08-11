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
import { useGetAllUsersQuery } from "@/redux/feature/userAPI";
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

  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const transactions = data?.data?.result;

  const totalPages = Math.ceil(transactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions?.slice(startIndex, endIndex);

  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="overflow-hidden bg-white rounded-md">
        <h2 className="text-[32px] font-medium text-primary py-6 px-3">
          User List
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black  py-8">
              <TableRow>
                <TableHead className="text-[#FFF] text-lg text-center">
                  User Image
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  User Name
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Phone Number
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Email
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Join Date
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentTransactions?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center text-black text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src={
                          user?.image &&
                          `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.image}`
                        }
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    {user.phone}
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    {user.createdAt.slice(0, 10)}
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openUserModal(user)}
                    >
                      <Info className="h-6 w-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="max-w-sm mx-auto flex items-center justify-between border-t border-gray-200 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black  px-4 py-3 mt-6">
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
            {selectedUser?.image && (
              <div className="flex justify-center mb-4">
                <img
                  src={
                    selectedUser?.image &&
                    `${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedUser?.image}`
                  }
                  alt={selectedUser.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            )}

            {/* Heading */}
            <h2 className="mb-6 text-center text-[30px] font-semibold text-[#E6E6E6]">
              User Details
            </h2>

            {/* User Details */}
            <div className="space-y-6">
              <DetailRow label="User Name" value={selectedUser?.name} />
              <DetailRow label="Phone Number" value={selectedUser?.phone} />
              <DetailRow
                label="Join Date"
                value={selectedUser?.createdAt.slice(0, 10)}
              />
              <DetailRow label="Email" value={selectedUser?.email} />
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
