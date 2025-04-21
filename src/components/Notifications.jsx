import { useContext, useState, useEffect } from "react";
import { States } from "./App";
import { API_BASE_URL } from "@/lib/api";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import {
  Heart,
  MessageCircle,
  Repeat,
  AtSign,
  UserPlus,
  Loader2,
} from "lucide-react";

export default function Notifications() {
  const { Auth } = useContext(States);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/all/${Auth.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/all/${Auth.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 1:
        return <Heart className="text-red-500" size={18} />;
      case 2:
        return <Repeat className="text-green-500" size={18} />;
      case 3:
        return <MessageCircle className="text-blue-500" size={18} />;
      case 4:
        return <AtSign className="text-purple-500" size={18} />;
      default:
        return <UserPlus className="text-primary" size={18} />;
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.postId) {
      return `/${notification.creator?.userName}/${notification.creator?.id}/${notification.postId}`;
    } else if (notification.commentId) {
      return `/comment/${notification.creator?.userName}/${notification.creator?.id}/${notification.commentId}`;
    } else if (notification.creator) {
      return `/${notification.creator.userName}/${notification.creator.id}`;
    } else {
      return "#";
    }
  };

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl pt-4">
      <div className="mb-4 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Notifications</h1>
        {notifications && notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-primary text-sm hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              to={getNotificationLink(notification)}
              className={`block px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
              onClick={() => {
                if (!notification.isRead) {
                  markAsRead(notification.id);
                }
              }}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 pt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-3">
                      {notification.creator?.imageUrl && (
                        <img
                          src={notification.creator.imageUrl}
                          alt={notification.creator.displayName}
                          className="mr-2 inline-block h-8 w-8 rounded-full"
                        />
                      )}
                      <div
                        className="inline-block text-sm"
                        dangerouslySetInnerHTML={{
                          __html: notification.content,
                        }}
                      />
                    </div>
                    <span className="ml-2 text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
