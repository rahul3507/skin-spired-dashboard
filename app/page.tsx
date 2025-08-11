"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import icons from "@/public/icon/user.png";
import ear from "@/public/icon/earning.png";
import EarningChart from "@/components/EarningChart";
import {
  useGetStatisticsQuery,
  useGetTransactionsQuery,
} from "@/redux/feature/dashboardAPI";
import Loading from "@/components/Loading";
import UserDetailsModal from "@/components/user-details-modal";

export default function DashboardContent() {
  const { data, isLoading } = useGetStatisticsQuery();

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <main className="bg-background2 w-full p-4 md:p-6">
      <section className="mb-8">
        <div>
          <div className="flex items-center gap-14 flex-wrap">
            <StatCard
              title="Total User"
              value={data?.data?.totalUsers}
              icon={icons as any}
            />
            <StatCard
              title="Total Earnings"
              value={`$${data?.data?.totalAmount}`}
              icon={ear as any}
            />
          </div>
        </div>
      </section>

      <div>
        <EarningChart />
      </div>

      <section>
        <TransactionTable />
      </section>
    </main>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="overflow-hidden bg-background w-full md:max-w-[380px] h-[161px] flex items-center">
      <CardContent className="flex items-center gap-10 p-6 ml-5">
        <div className="">
          <Image
            className="object-contain rounded-2xl"
            src={icon}
            alt="icon"
            width={80}
            height={80}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="mb-2 text-[#2d3034]">{title}</h3>
          <p className="text-[32px] font-semibold text-[#3a3737]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data, isLoading } = useGetTransactionsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Map API data to the expected structure
  const transactions =
    data?.data?.result?.map((item: any) => ({
      id: item.id || item.transactionId, // Adjust based on actual API field names
      name: item.user?.name || "Unknown User", // Adjust based on actual API field names
      status: item.status || "Unknown", // Adjust based on actual API field names
      date: item.createdAt || item.date, // Adjust based on actual API field names, format if needed
      amount: `$${item.amount || 0}`, // Adjust based on actual API field names
    })) || [];

  // Use meta.total for pagination
  const totalPages = Math.ceil((data?.data?.meta?.total || 0) / itemsPerPage);
  const currentTransactions = transactions.slice(0, itemsPerPage); // Already paginated by API, but slice for safety

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
      <div className="overflow-hidden bg-[#FFFFFF] rounded-md pb-3">
        <h2 className="text-[32px] font-medium text-[#101010] p-6">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-white py-8">
              <TableRow className="py-8">
                <TableHead className="text-[#FFFFFF] text-lg text-center">
                  #Tr.ID
                </TableHead>
                <TableHead className="text-[#FFFFFF] text-lg text-center">
                  User Name
                </TableHead>
                <TableHead className="text-[#FFFFFF] text-lg text-center">
                  Status
                </TableHead>
                <TableHead className="text-[#FFFFFF] text-lg text-center">
                  Date
                </TableHead>
                <TableHead className="text-[#FFFFFF] text-lg text-center">
                  Amount
                </TableHead>
                <TableHead className="text-[#FFFFFF] text-lg text-center">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentTransactions?.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium text-lg text-[#4B5563] text-center">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="text-lg text-[#4B5563] text-center">
                    {transaction.name}
                  </TableCell>
                  <TableCell className="text-lg text-[#4B5563] text-center">
                    {transaction.status}
                  </TableCell>
                  <TableCell className="text-lg text-[#4B5563] text-center">
                    {transaction.date.slice(0, 10)}
                  </TableCell>
                  <TableCell className="text-lg text-[#4B5563] text-center">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-lg text-[#4B5563] text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openUserModal(transaction)}
                    >
                      <Info className="h-6 w-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
      </div>

      {isModalOpen && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
