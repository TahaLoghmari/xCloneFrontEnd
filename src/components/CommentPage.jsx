import React, { useContext, useState, useEffect } from "react";
import { States } from "./App";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import ReplyComment from "./ReplyComment";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Lottie from "lottie-react";
import LoadingScreen from "../assets/LoadingScreen.json";
import Comment from "./Comment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircle, Heart } from "lucide-react";

export default function CommentPage() {
  const { Auth } = useContext(States);
  const [loading, setLoading] = useState(true);
  const [replyComment, setReplyComment] = useState(null);
  const [replyReply, setReplyReply] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);
  const [replies, setReplies] = useState([]);
  const { creatorId, commentId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);

    const userPromise = fetch(`${API_BASE_URL}/User/${creatorId}`, {
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

    const commentPromise = fetch(`${API_BASE_URL}/Comment/${commentId}`, {
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
        setComment(data);
        return data;
      })
      .catch((error) => {
        console.error("Error loading initial data:", error);
        setLoading(false);
      });
    const repliesPromise = fetch(
      `${API_BASE_URL}/Comment/replies/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
      .then((res) => {
        if (!res.ok)
          return res.text().then((t) => {
            throw new Error(t);
          });
        return res.json();
      })
      .then((data) => {
        setReplies(data);
        return data;
      })
      .catch((error) => {
        console.error("Error loading initial data:", error);
        setLoading(false);
      });
    Promise.all([userPromise, commentPromise, repliesPromise]).finally(() => {
      setLoading(false);
    });
  }, [creatorId, commentId]);

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

  // console.log("user :", user);
  // console.log("comment : ", comment);
  // console.log("replies :", replies);
  if (loading)
    return (
      <>
        <div style={{ filter: "brightness(0) invert(1)" }}>
          <Lottie animationData={LoadingScreen} loop={true} />
        </div>
      </>
    );
  if (!loading && user && replies && comment)
    return (
      <>
        {comment && replyComment === comment.id && (
          <ReplyComment
            content={comment}
            setLoading={setLoading}
            Auth={Auth}
            postId={comment.postId}
            setComments={setReplies}
            setComment={setComment}
            setReplyComment={setReplyComment}
          />
        )}
        <div className="flex w-full justify-center py-4 pb-0">
          <div className="flex w-[95%] items-center gap-8">
            <ArrowLeft
              className="h-5 w-5 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <p className="text-lg font-bold">Comment</p>
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
                  <p className="w-full">{comment.content}</p>
                </div>
                <p className="border-b py-3 text-sm text-[#56595d]">
                  {formatDate(comment.createdAt)}
                </p>
                <div
                  className="mt-1 flex w-full items-center border-b"
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
                          onClick={() => setReplyComment(comment.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <p className="text-sm">{comment.repliesCount}</p>
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
                        <div className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#1e0c14] hover:text-[#da317d]">
                          <Heart className="h-4 w-4" />
                          <p className="text-sm">{comment.likesCount}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Like</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div>
                {replies
                  ? replies
                      .slice()
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                      )
                      .map((reply, index) => (
                        <React.Fragment key={reply.id}>
                          {replyReply === reply.id && (
                            <ReplyComment
                              content={reply}
                              setLoading={setLoading}
                              Auth={Auth}
                              setComments={setReplies}
                              postId={reply.postId}
                              setReplyComment={setReplyReply}
                              index={index}
                            />
                          )}
                          <Comment
                            content={reply}
                            key={reply.id}
                            postId={reply.postId}
                            setReplyComment={setReplyReply}
                          />
                        </React.Fragment>
                      ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
