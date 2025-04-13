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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Reply from "./Reply";
import { useNavigate, useParams } from "react-router-dom";
import { States } from "./App";
import { API_BASE_URL } from "@/lib/api";
import Lottie from "lottie-react";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "../assets/LoadingScreen.json";
import React, { useState, useContext, useEffect } from "react";
import Comment from "./Comment";

export default function PostPage() {
  const { Auth } = useContext(States);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState(false);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { creatorId, postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE_URL}/User/${creatorId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          return res.text().then((text) => {
            throw new Error(text);
          });
        return res.json();
      })
      .then((data) => {
        setUser(data);
        return data;
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });

    fetch(`${API_BASE_URL}/Post/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          return res.text().then((text) => {
            throw new Error(text);
          });
        return res.json();
      })
      .then((data) => {
        setPost(data);
        return data;
      })
      .catch((error) => {
        console.error("Error loading initial data:", error);
        setLoading(false);
      });
    fetch(`${API_BASE_URL}/Comment/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          return res.text().then((t) => {
            throw new Error(t);
          });
        return res.json();
      })
      .then((data) => {
        setComments(data);
        return data;
      })
      .catch((error) => {
        console.error("Error loading initial data:", error);
        setLoading(false);
      });
    setLoading(false);
  }, [creatorId, postId]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${formattedHours}:${formattedMinutes} ${ampm} · ${month} ${day}, ${year}`;
  }
  if (loading)
    return (
      <div className="2sm:ml-20 bg-background semixl:w-[63%] flex w-full items-center justify-center overflow-y-auto sm:ml-17 md:border-r md:p-3 xl:w-[67%] 2xl:ml-70">
        <div style={{ filter: "brightness(0) invert(1)" }}>
          <Lottie animationData={LoadingScreen} loop={true} />
        </div>
      </div>
    );
  if (!loading && user && post)
    return (
      <>
        {post && reply && (
          <Reply content={post} Auth={Auth} setReply={setReply} type="post" />
        )}
        <div className="flex w-full justify-center py-4 pb-0">
          <div className="flex w-[95%] items-center gap-8">
            <ArrowLeft
              className="h-5 w-5 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <p className="text-lg font-bold">Post</p>
          </div>
        </div>
        <div className="flex w-full justify-center py-4 pb-0">
          <div className="flex w-[90%]">
            <div className="mb-14 flex w-full flex-col gap-1 md:mb-0">
              <div className="flex gap-2">
                <Avatar className="h-11 w-auto">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex w-full justify-between overflow-hidden">
                  <div className="flex w-fit max-w-[60%] flex-col">
                    <p className="truncate">{user.username}</p>
                    <p className="text-sm text-[#56595d]">
                      @{user.displayName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
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
              </div>
              <div className="flex max-w-full min-w-0 flex-1 flex-col">
                <div className="w-full overflow-hidden">
                  <p className="w-full">{post.content}</p>
                  {post.mediaUploadPath && (
                    <img
                      src={post.mediaUploadPath}
                      className="mt-2 h-auto max-w-full rounded-md object-contain"
                    />
                  )}
                </div>
                <p className="border-b py-3 text-sm text-[#56595d]">
                  {formatDate(post.createdAt)}
                </p>
                <div
                  className="mt-1 flex w-full items-center justify-between border-b"
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
                          onClick={() => setReply(true)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <p className="text-sm">{post.commentsCount}</p>
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
                        <div className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#0f1a14] hover:text-[#50b87c]">
                          <Repeat2 className="h-4 w-4" />
                          <p className="text-sm">{post.sharesCount}</p>
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
                          <p className="text-sm">{post.likesCount}</p>
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
                          <p className="text-sm">{post.viewsCount}</p>
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
                {/* here */}
                <div>
                  {comments.map((comment) => {
                    return <Comment key={comment.id} content={comment} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
