import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Eye,
  Bookmark,
  Share,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Reply from "./Reply";
import { useNavigate } from "react-router-dom";
import { States } from "./App";
import React from "react";
import { useContext } from "react";

const Post = React.forwardRef(({ content }, ref) => {
  const navigate = useNavigate();
  const { Auth } = useContext(States);
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
      ref={ref}
      className="flex w-full cursor-pointer justify-center border-b py-4 pb-0"
      onClick={(e) => {
        navigate(`/${Auth.username}/${Auth.id}/${content.id}`);
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
            {content.mediaUploadPath && (
              <img
                src={content.mediaUploadPath}
                className="mt-2 h-auto max-w-full rounded-md object-contain"
              />
            )}
          </div>
          <div
            className="mt-1 flex w-full items-center justify-between"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#0e171f] hover:text-blue-400">
                          <MessageCircle className="h-4 w-4" />
                          <p className="text-sm">{content.commentsCount}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Reply</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </DialogTrigger>
              <Reply content={content} Auth={Auth} />
            </Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#0f1a14] hover:text-[#50b87c]">
                    <Repeat2 className="h-4 w-4" />
                    <p className="text-sm">{content.sharesCount}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Repost</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#1e0c14] hover:text-[#da317d]">
                    <Heart className="h-4 w-4" />
                    <p className="text-sm">{content.likesCount}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Like</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#1d1f21] hover:text-blue-400">
                    <Eye className="h-4 w-4" />
                    <p className="text-sm">{content.viewsCount}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Bookmark className="h-10 w-10 cursor-pointer rounded-full p-3 text-[#72767b] transition hover:bg-[#0e171f] hover:text-blue-400" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Share className="h-10 w-10 cursor-pointer rounded-full p-3 text-[#72767b] transition hover:bg-[#0e171f] hover:text-blue-400" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Post;
