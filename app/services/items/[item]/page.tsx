"use client";

import { Plus } from "lucide-react";

import { use, useState } from "react";
import Image from "next/image";
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
import {
  useDeleteServiceMutation,
  useViewAllItemsQuery,
} from "@/redux/feature/servicesAPI";
import { useParams } from "next/navigation";

interface ServicesCardProps {
  item_id: string;
  image: string;
  title: string;
  short_description: string;
  type: string;
}

export default function IssuesFrequent() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const params = useParams();

  console.log("params", params);

  const {
    data: items,
    isLoading,
    refetch,
  } = useViewAllItemsQuery(params?.item, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteService] = useDeleteServiceMutation();

  if (isDeleted) {
    return null;
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteService(id).unwrap();
      await refetch();

      if (res.success) {
        await refetch();
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    }

    setShowDeleteDialog(false);
  };

  return (
    <div className='min-h-screen bg-black p-4 md:p-6'>
      <div className='w-full mx-auto '>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-[32px] font-medium text-primary'>
            Items of {items?.service_title || "Service"}
          </h2>
          <Link
            href='/services/item-create'
            className='flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-[#E6E6E6] rounded-full px-4 py-2 transition-colors'
          >
            <Plus size={20} className='text-[#E6E6E6]' />
            <span>Add Item</span>
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {items?.items?.map((item: ServicesCardProps) => (
            <div
              key={item?.item_id}
              className='bg-[#333333] rounded-lg overflow-hidden flex flex-col'
            >
              <div className='p-4 text-center'>
                <h3 className='text-white font-bold text-lg mb-6'>
                  {item?.title}
                </h3>
                <div className='flex justify-center mb-2'>
                  <div className='w-36 h-36 relative'>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item?.image}`}
                      alt={item?.title}
                      width={164}
                      height={164}
                      className='object-contain'
                    />
                  </div>
                </div>
                <p className='text-[#E6E6E6] text-xs leading-loose mb-4'>
                  {item?.short_description}
                </p>
              </div>
              <div className='mt-auto p-4 flex gap-2'>
                <Link
                  href={`/services/item-edit/${item?.item_id}`}
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

              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogContent className='bg-[#000000a9] bg-opacity-40 text-white border-zinc-700'>
                  <DialogHeader>
                    <DialogTitle>Delete {item?.title}</DialogTitle>
                    <DialogDescription className='text-gray-400'>
                      Are you sure you want to delete this card? This action
                      cannot be undone.
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
                      onClick={() => handleDelete(item?.item_id)}
                      className='bg-red-600 hover:bg-red-700 text-white'
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
