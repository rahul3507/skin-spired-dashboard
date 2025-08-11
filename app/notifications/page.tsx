"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NotificationItem from "@/components/notification-item";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/feature/notificationAPI";
import { useState } from "react";
import Loading from "@/components/Loading";
import { toast } from "sonner";

export default function NotificationsPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10; // Matches the limit in the API request

  const { data, isLoading, isError, error, refetch } = useGetNotificationsQuery(
    {
      page: currentPage,
      limit: notificationsPerPage,
    }
  );

  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // Extract notifications and metadata from API response
  const notifications = data?.data?.result || [];
  const totalNotifications = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalNotifications / notificationsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle previous and next buttons
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await updateNotification("").unwrap();

      if (res?.success === true) {
        toast.success("Notification read successfully!");
      }
      refetch();
    } catch (error) {
      toast.error("Error updating notification");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteNotification("").unwrap();

      if (res?.success === true) {
        toast.success("Notification deleted successfully!");
      }

      refetch();
    } catch (error) {
      toast.error("Error updating notification");
    }
  };

  return (
    <div className="container mx-auto bg-white min-h-[80vh] rounded-lg">
      <header className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
            <div>
              <h1 className="text-xl font-medium">Notifications</h1>
              <p className="text-sm text-gray-500 ">
                You have {totalNotifications} notifications
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Read
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="divide-y">
        {isLoading ? (
          <p>
            <Loading />
          </p>
        ) : isError ? (
          <p className="text-red-500">
            Error loading notifications: {error?.toString() || "Unknown error"}
          </p>
        ) : notifications.length > 0 ? (
          notifications?.map((notification: any) => (
            <NotificationItem
              key={notification._id} // Use _id from the API response
              notification={notification}
            />
          ))
        ) : (
          <p className="min-h-screen flex items-center justify-center text-3xl text-red-600">
            No notifications available.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
