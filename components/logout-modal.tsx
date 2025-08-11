"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex justify-center text-teal-800'>
          <h2 className='flex items-center text-2xl font-semibold'>
            <LogOut className='mr-2 h-6 w-6' /> Sign Out
          </h2>
        </div>

        <div className='mb-6 flex flex-col items-center'>
          <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100'>
            <LogOut className='h-8 w-8 text-teal-800' />
          </div>
          <h3 className='mb-2 text-xl font-semibold'>
            Are you sure you want to sign out?
          </h3>
          <p className='text-center text-gray-600'>
            You will need to sign in again to access your account.
          </p>
        </div>

        <div className='flex justify-center gap-4'>
          <Button variant='outline' onClick={onClose} className='w-32'>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className='w-32 bg-teal-800 hover:bg-teal-700'
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
