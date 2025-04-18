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
import Reply from "./Reply";
import { useNavigate, useParams } from "react-router-dom";
import { States } from "./App";
import { API_BASE_URL } from "@/lib/api";
import Lottie from "lottie-react";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "../assets/LoadingScreen.json";
import React, { useState, useContext, useEffect } from "react";
import Comment from "./Comment";
import ReplyComment from "./ReplyComment";

export default function PostPage() {
  const { Auth } = useContext(States);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState(null);
  const [replyComment, setReplyComment] = useState(null);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { creatorId, postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE_URL}/User/${creatorId}/${Auth.id}`, {
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

    fetch(`${API_BASE_URL}/Post/${postId}/${Auth.id}`, {
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
    fetch(`${API_BASE_URL}/Comment/post/${postId}/${Auth.id}`, {
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
  const [loadingLike, setLoadingLike] = useState(false);
  const handleLike = () => {
    setLoadingLike(true);
    if (!post.hasLiked)
      fetch(`${API_BASE_URL}/Like/post/${post.id}/${Auth.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          console.log(data);
          setPost((prevState) => ({
            ...prevState,
            hasLiked: true,
            likesCount: prevState.likesCount + 1,
          }));
          setLoadingLike(false);
        })
        .catch((error) => {
          setLoadingLike(false);
          console.log(error);
        });
    else
      fetch(`${API_BASE_URL}/Like/post/${post.id}/${Auth.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          console.log(data);
          setPost((prevState) => ({
            ...prevState,
            hasLiked: false,
            likesCount: prevState.likesCount - 1,
          }));
          setLoadingLike(false);
        })
        .catch((error) => {
          setLoadingLike(false);
          console.log(error);
        });
  };
  console.log(comments);
  if (loading)
    return (
      <>
        <div style={{ filter: "brightness(0) invert(1)" }}>
          <Lottie animationData={LoadingScreen} loop={true} />
        </div>
      </>
    );
  if (!loading && user && post)
    return (
      <>
        {post && reply === post.id && (
          <Reply
            content={post}
            Auth={Auth}
            setReply={setReply}
            setPost={setPost}
            setComments={setComments}
            setLoading={setLoading}
          />
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
                    <p className="truncate">{user.userName}</p>
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
                          onClick={() => setReply(post.id)}
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
                        <div
                          className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#1e0c14] hover:text-[#da317d]"
                          onClick={() => handleLike()}
                        >
                          {post.hasLiked ? (
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
                            className={`text-sm ${post.hasLiked && "text-[#da317d]"}`}
                          >
                            {post.likesCount}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {post.hasLiked ? <p>Unlike</p> : <p>Like</p>}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  {comments
                    .slice()
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
                    .map((comment, index) => (
                      <React.Fragment key={comment.id}>
                        {replyComment === comment.id && (
                          <ReplyComment
                            content={comment}
                            setLoading={setLoading}
                            Auth={Auth}
                            postId={post.id}
                            setReplyComment={setReplyComment}
                            setComments={setComments}
                            index={index}
                            key={comment.id}
                          />
                        )}
                        <Comment
                          content={comment}
                          postId={post.id}
                          setReplyComment={setReplyComment}
                          setComments={setComments}
                          index={index}
                        />
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
