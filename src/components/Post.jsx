import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot } from "lucide-react";

export default function Post({ content }) {
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
    <div className="flex w-full justify-center border-b py-4">
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
        </div>
      </div>
    </div>
  );
}
