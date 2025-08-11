"use client";

import { useState } from "react";
import Image from "next/image";
import { Youtube } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PoolCardProps {
  title: string;
  icon: string;
}

export default function RichCard({ title, icon }: PoolCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) {
    return null;
  }

  const handleDelete = () => {
    setShowDeleteDialog(false);
    setIsDeleted(true);
  };

  return (
    <div className='bg-[#333333] rounded-lg overflow-hidden flex flex-col'>
      <div className='p-4 text-center'>
        <h3 className='text-white font-bold text-lg mb-6'>{title}</h3>
        <div className='flex justify-center mb-6'>
          <div className='w-16 h-16 relative'>
            <Image
              src={icon || "/placeholder.svg"}
              alt={title}
              width={64}
              height={64}
              className='object-contain'
            />
          </div>
        </div>
        <p className='text-[#E6E6E6] text-xs leading-loose mb-4'>
          Getting Your Swimming Pool Ready At The Start Of The Season Involves A
          Few Key Steps To Ensure It's Clean, Safe, And Ready For Swimming.
        </p>
        <div className='flex justify-center gap-2 mb-4'>
          <a
            href='#'
            className='flex items-center gap-1 bg-[#8A8A8A] hover:bg-zinc-600 text-white rounded px-2 py-1 text-xs transition-colors'
          >
            <Youtube size={16} />
          </a>
          <a
            href='https://www.Bing.com'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 bg-transparent hover:bg-zinc-600 text-white border border-[#5CE1E6] rounded px-2 py-1 text-xs transition-colors'
          >
            <span>https://www.Bing.com</span>
            {/* <ExternalLink size={12} /> */}
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.00003 12.6666L12.6667 3.99997M12.6667 3.99997V12.32M12.6667 3.99997H4.3467'
                stroke='#5CE1E6'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </a>
        </div>
      </div>
      <div className='mt-auto p-4 flex gap-2'>
        <Link
          href='/issues/123'
          className='flex-1 bg-[#5CE1E6] hover:bg-[#4de5eb] text-[#275F61] text-center rounded py-2 text-sm transition-colors'
        >
          Edit
        </Link>
        <button
          className='flex-1 bg-transparent hover:bg-zinc-600 text-[#5CE1E6] border border-[#5CE1E6] rounded py-2 text-sm transition-colors'
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete
        </button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className='bg-zinc-800 text-white border-zinc-700'>
          <DialogHeader>
            <DialogTitle>Delete {title}</DialogTitle>
            <DialogDescription className='text-gray-400'>
              Are you sure you want to delete this card? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex gap-2 sm:justify-end'>
            <Button
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
              className='bg-transparent border-zinc-600 text-white hover:bg-zinc-700 hover:text-white'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
