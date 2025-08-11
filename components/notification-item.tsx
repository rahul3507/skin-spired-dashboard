"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

interface NotificationProps {
  notification: {
    id: number;
    type: string;
    text: string;
    createdAt: string;
    read: boolean;
  };
}

export default function NotificationItem({ notification }: NotificationProps) {
  const [isRead, setIsRead] = useState(notification.read);

  const handleClick = () => {
    setIsRead(true);
  };

  return (
    <div
      className={`flex items-start p-4 gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        notification.type === "payment"
          ? "bg-blue-600 text-white"
          : isRead
          ? "bg-blue-300 text-white"
          : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mt-1">
        <div
          className={`rounded-full p-2 ${
            notification.type === "payment"
              ? "bg-white/20"
              : "border border-gray-200"
          }`}
        >
          <Bell
            className={`h-4 w-4 ${
              notification.type === "payment" ? "text-white" : "text-gray-500"
            }`}
          />
        </div>
      </div>
      <div className="flex-1">
        <p
          className={`${
            notification.type === "payment" ? "text-white" : "text-gray-800"
          }`}
        >
          {notification.text}
        </p>
        <p
          className={`text-sm ${
            notification.type === "payment" ? "text-white/80" : "text-gray-500"
          }`}
        >
          {notification.createdAt.slice(0, 10)}
        </p>
      </div>
    </div>
  );
}
