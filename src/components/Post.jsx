import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Reply from "./Reply";
import { useNavigate } from "react-router-dom";
import { States } from "./App";
import React, { useState } from "react";
import { useContext, createContext } from "react";
import { API_BASE_URL } from "@/lib/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Post({ content, setPosts, index }) {
  const navigate = useNavigate();
  const { Auth } = useContext(States);
  const [reply, setReply] = useState(null);
  const [loadingLike, setLoadingLike] = useState(false);
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
  const handleLike = () => {
    setLoadingLike(true);
    if (!content.hasLiked)
      fetch(`${API_BASE_URL}/Like/post/${content.id}/${Auth.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          console.log(data);
          setPosts((prevState) => {
            return prevState.map((post) =>
              post.id === content.id
                ? {
                    ...post,
                    likesCount: post.likesCount + 1,
                    hasLiked: true,
                  }
                : post,
            );
          });
          setLoadingLike(false);
        })
        .catch((error) => {
          setLoadingLike(false);
          console.log(error);
        });
    else
      fetch(`${API_BASE_URL}/Like/post/${content.id}/${Auth.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          console.log(data);
          setPosts((prevState) => {
            return prevState.map((post) =>
              post.id === content.id
                ? {
                    ...post,
                    likesCount: post.likesCount - 1,
                    hasLiked: false,
                  }
                : post,
            );
          });
          setLoadingLike(false);
        })
        .catch((error) => {
          setLoadingLike(false);
          console.log(error);
        });
  };
  if (content) {
    return (
      <>
        {content && reply === content.id && (
          <Reply
            content={content}
            Auth={Auth}
            setReply={setReply}
            setPosts={setPosts}
            index={index}
          />
        )}
        <div
          className="flex w-full cursor-pointer justify-center border-b py-4 pb-0"
          onClick={(e) => {
            navigate(
              `/${content.creator.userName}/${content.creator.id}/${content.id}`,
            );
          }}
        >
          <div className="flex w-[95%]">
            <div className="flex w-13 flex-col">
              <Avatar className="h-auto w-10">
                <AvatarImage src={content.creator.imageUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
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
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Popover>
                      <PopoverTrigger>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          fill="#56595d"
                          className="h-5 w-5 cursor-pointer"
                        >
                          <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                        </svg>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p
                          className="cursor-pointer text-sm"
                          onClick={() => handleFollow()}
                        >
                          Follow{" "}
                          <span className="text-[#56595d]">
                            @{content.creator.displayName}
                          </span>
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="w-full overflow-hidden">
                <p className="w-full">{content.content}</p>
                {content.mediaUploadPath && (
                  <img
                    src={content.mediaUploadPath}
                    className="mt-2 h-auto max-w-full rounded-md object-contain"
                  />
                )}
              </div>
              <div
                className="mt-1 flex w-full items-center justify-start"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#0e171f] hover:text-blue-400"
                        onClick={() => setReply(content.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <p className="text-sm">{content.commentsCount}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Reply</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
      </>
    );
  }
}
