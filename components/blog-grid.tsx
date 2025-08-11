"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import BlogCard from "./blog-card";

interface BlogPost {
  id: string;
  author: string;
  title: string;
  content: string;
  avatar: string;
  isDeleted: boolean;
}

// Sample data
const BLOGS_PER_PAGE = 8;
const INITIAL_BLOGS: BlogPost[] = Array(24)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    author: "Dr. Jane Nicholson",
    title: "Leading Diagnostic Doctor",
    content:
      "I was 29, chasing dreams and designing a future I could touch with my own hands, when everything changed. It started with a strange numbness in my fingers, then a crushing fatigue that no amount of sleep could cure.",
    avatar: `/user1.jpg`,
    isDeleted: i % 7 === 0, // Mark some as deleted for demo
  }));

export default function BlogGrid() {
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Filter blogs based on active tab
  const filteredBlogs = blogs.filter((blog) =>
    activeTab === "all"
      ? true
      : activeTab === "deleted"
      ? blog.isDeleted
      : !blog.isDeleted
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * BLOGS_PER_PAGE,
    currentPage * BLOGS_PER_PAGE
  );

  // Handle delete/restore
  const handleToggleDelete = (id: string) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === id ? { ...blog, isDeleted: !blog.isDeleted } : blog
      )
    );
  };

  return (
    <div className='container mx-auto'>
      <Tabs defaultValue='all' onValueChange={setActiveTab}>
        <TabsList className='mb-6'>
          <TabsTrigger
            value='all'
            className='bg-pink-900 text-white data-[state=active]:bg-pink-900 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-pink-900'
          >
            All Blogs
          </TabsTrigger>
          <TabsTrigger
            value='deleted'
            className='bg-white text-pink-900 data-[state=active]:bg-white data-[state=active]:text-pink-900'
          >
            Deleted
          </TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='mt-0'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {currentBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onToggleDelete={handleToggleDelete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value='deleted' className='mt-0'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {currentBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onToggleDelete={handleToggleDelete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href='#'
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
