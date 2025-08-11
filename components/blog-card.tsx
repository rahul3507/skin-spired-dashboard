"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogPost {
  id: string;
  author: string;
  title: string;
  content: string;
  avatar: string;
  isDeleted: boolean;
}

interface BlogCardProps {
  blog: BlogPost;
  onToggleDelete: (id: string) => void;
}

export default function BlogCard({ blog, onToggleDelete }: BlogCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='bg-white rounded-lg p-6 relative'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex items-center'>
          <div className='relative h-16 w-16 rounded-full overflow-hidden'>
            <Image
              src={blog.avatar || "/placeholder.svg"}
              alt={blog.author}
              fill
              className='object-cover'
            />
          </div>
          {blog.isDeleted && (
            <Badge className='absolute top-2 left-20 bg-white text-pink-900 border border-pink-900'>
              Deleted
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onToggleDelete(blog.id)}>
              {blog.isDeleted ? "Delete" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='space-y-1'>
        <h3 className='font-bold text-lg'>{blog.author}</h3>
        <p className='text-sm text-gray-600'>{blog.title}</p>
        <p className='text-sm mt-2'>
          {expanded ? blog.content : `${blog.content.substring(0, 120)}...`}
          <button
            onClick={() => setExpanded(!expanded)}
            className='text-gray-500 ml-1 hover:text-gray-700'
          >
            {expanded ? "less" : "more"}
          </button>
        </p>
      </div>
    </div>
  );
}
