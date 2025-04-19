import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Eye,
  Bookmark,
  Share,
} from "lucide-react";
import Reply from "./Reply";
import { useNavigate } from "react-router-dom";
import { States } from "./App";
import React, { useState } from "react";
import { useContext } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function Comment({
  content,
  setReplyComment,
  index,
  setComments,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { Auth } = useContext(States);
  const [loadingLike, setLoadingLike] = useState(false);
  const handleLike = () => {
    setLoadingLike(true);
    if (!content.hasLiked)
      fetch(`${API_BASE_URL}/Like/comment/${content.id}/${Auth.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          setComments((prevState) => {
            return prevState.map((comment) =>
              comment.id === content.id
                ? {
                    ...comment,
                    hasLiked: true,
                    likesCount: comment.likesCount + 1,
                  }
                : comment,
            );
          });
          setLoadingLike(false);
        })
        .catch((error) => {
          setLoadingLike(false);
          console.log(error);
        });
    else
      fetch(`${API_BASE_URL}/Like/comment/${content.id}/${Auth.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          console.log(data);
          setComments((prevState) => {
            return prevState.map((comment) =>
              comment.id === content.id
                ? {
                    ...comment,
                    hasLiked: false,
                    likesCount: comment.likesCount - 1,
                  }
                : comment,
            );
          });
          setLoadingLike(false);
        })
        .catch((error) => {
          setLoadingLike(false);
          console.log(error);
        });
  };
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor((now - postDate) / 1000);

    if (isNaN(seconds)) return "";
    const intervals = {
      y: 31536000,
      mo: 2592000,
      w: 604800,
      d: 86400,
      h: 3600,
      m: 60,
    };

    if (seconds < 60) return "just now";

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit}` : `${interval}${unit}`;
      }
    }
  };

  return (
    <div
      className="flex w-full cursor-pointer justify-center border-b pt-4"
      onClick={() => {
        navigate(
          `/comment/${content.creator.userName}/${content.creator.id}/${content.id}`,
        );
      }}
    >
      <div className="flex w-[95%]">
        {/* image left part , width is fixed*/}
        <div className="flex w-13 flex-col">
          <Avatar className="h-auto w-10">
            <AvatarImage src={content.creator.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        {/* content right part */}
        <div className="flex max-w-full min-w-0 flex-1 flex-col">
          <div className="flex w-full gap-1">
            <div className="flex w-fit max-w-[60%] items-center gap-1 overflow-hidden">
              <p className="truncate">{content.creator.userName}</p>
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
              <div className="flex">
                <p className="text-sm text-[#56595d]">
                  @{content.creator.displayName}
                </p>
                <p className="text-sm text-[#56595d]">
                  . {formatTimeAgo(content.createdAt)}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="#56595d"
                className="h-5 w-5"
              >
                <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
              </svg>
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <p className="w-full">{content.content}</p>
          </div>
          <div
            className="mt-1 flex w-full items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#0e171f] hover:text-blue-400"
                          onClick={() => setReplyComment(content.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <p className="text-sm">{content.repliesCount}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Reply</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </DialogTrigger>
            </Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#1e0c14] hover:text-[#da317d]"
                    onClick={() => handleLike()}
                  >
                    {content.hasLiked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="#da317d"
                        className="h-4 w-4"
                      >
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                      </svg>
                    )}

                    <p
                      className={`text-sm ${content.hasLiked && "text-[#da317d]"}`}
                    >
                      {content.likesCount}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {content.hasLiked ? <p>Unlike</p> : <p>Like</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
