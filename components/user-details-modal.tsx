"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserDetailsModalProps {
  user: {
    id: number;
    name: string;
    status: string;
    date: string;
    amount: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  if (!isOpen) return null;

  // Generate a random user ID with # prefix and 6 digits
  const userId = `#${Math.floor(Math.random() * 900000) + 100000}`;

  // Format current date as MM-DD-YYYY
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(currentDate.getDate()).padStart(
    2,
    "0"
  )}-${currentDate.getFullYear()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-md bg-[#000000] px-6 py-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <h2 className="mb-6 py-5 text-center text-[30px] font-semibold text-[#E6E6E6]">
          User Details
        </h2>

        <div className="space-y-6">
          <DetailRow label="User ID:" value={userId} />
          <DetailRow label="Date" value={formattedDate} />
          <DetailRow label="User Name" value={user.name} />
          <DetailRow label="Transaction Amount" value={user.amount} />
          <DetailRow label="Payment Status" value={user.status} />
        </div>

        <Button className="mt-6 w-full bg-[#5CE1E6] hover:bg-[#5ce1e6b7]">
          Okay
        </Button>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between border-b border-[#D1D5DB] py-2">
      <span className="text-[#E6E6E6]">{label}</span>
      <span className="font-medium text-[#E6E6E6]">{value}</span>
    </div>
  );
}
