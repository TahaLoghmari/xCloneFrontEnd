import { API_BASE_URL } from "@/lib/api";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { States } from "./App";
import Post from "./Post";
import Lottie from "lottie-react";
import LoadingScreen from "../assets/LoadingScreen.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Profile({}) {
  const { Auth } = useContext(States);
  const navigate = useNavigate();
  const [posts, setPosts] = useState(true);
  const [comments, setComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState(null);
  const [userComments, setUserComments] = useState(null);
  const [postCommentsMap, setPostCommentsMap] = useState({});
  const { id } = useParams();
  const [user, setUser] = useState(false);
  const token = localStorage.getItem("token");
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingPostComments, setLoadingPostComments] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/User/${id}/${Auth.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
        setUser(data);
        return fetch(`${API_BASE_URL}/Post/${data.id}/posts/${Auth.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => {
        if (!res.ok)
          return res.text().then((t) => {
            throw new Error(t);
          });
        return res.json();
      })
      .then((data) => {
        setUserPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, Auth.id]);

  useEffect(() => {
    if (!userComments || userComments.length === 0 || !user) return;
    const postIdsToFetch = userComments
      .filter((post) => !postCommentsMap[post.id])
      .map((post) => post.id);

    if (postIdsToFetch.length === 0) return;

    setLoadingPostComments(true);

    const fetchPromises = postIdsToFetch.map((postId) =>
      fetch(
        `${API_BASE_URL}/Comment/user/${user.id}/post/${postId}/${Auth.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then((res) => {
          if (!res.ok)
            throw new Error(`Failed to fetch comments for post ${postId}`);
          return res.json();
        })
        .then((data) => ({ postId, data })),
    );

    Promise.all(fetchPromises)
      .then((results) => {
        const newCommentsMap = { ...postCommentsMap };
        results.forEach(({ postId, data }) => {
          newCommentsMap[postId] = data;
        });
        setPostCommentsMap(newCommentsMap);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingPostComments(false);
      });
  }, [userComments, user]);

  const fetchComments = () => {
    if (userComments) return;
    setLoadingComments(true);
    fetch(
      `${API_BASE_URL}/Comment/user/${user.id}/commented-posts/${Auth.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
        setUserComments(data);
        setLoadingComments(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingComments(false);
      });
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `Joined ${month} ${year}`;
  };
  const fetchPostComments = (postId) => {
    if (postCommentsMap[postId]) return;
    setLoadingPostComments(true);
    fetch(`${API_BASE_URL}/Comment/user/${user.id}/post/${postId}/${Auth.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
        setPostCommentsMap((prev) => ({
          ...prev,
          [postId]: data,
        }));
        setLoadingPostComments(false);
      })
      .catch((error) => {
        setLoadingPostComments(false);
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

  if (loading)
    return (
      <div
        className="flex w-full justify-center py-4 pb-0"
        style={{ filter: "brightness(0) invert(1)" }}
      >
        <Lottie animationData={LoadingScreen} loop={true} />
      </div>
    );
  if (!loading && user && userPosts) {
    document.title = `${user.userName}`;
    return (
      <div className="flex w-full flex-col items-center">
        {/* 95% of the screen centered */}
        <div className="w-[90%]">
          {/* header */}
          <div className="flex gap-8 py-4">
            <ArrowLeft
              className="h-5 w-5 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <p className="text-lg font-bold">{user.userName}</p>
          </div>
          {/* content */}
          <div className="flex flex-col gap-2">
            <Avatar className="h-13 w-13">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold">{user.userName}</p>
              <p className="text-sm text-[#56595d]">@{user.displayName}</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-[#56595d]">
              <CalendarDays className="h-4 w-4" />
              <p>{formatJoinDate(user.birthDate)}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <p>
                {user.followingCount}{" "}
                <span className="text-sm text-[#56595d]">Following</span>
              </p>
              <p>
                {user.followerCount}{" "}
                <span className="text-sm text-[#56595d]">Followers</span>
              </p>
            </div>
            <div className="flex w-full items-center justify-start gap-6">
              <div className="cursor-pointer">
                <p
                  className={`py-2 font-semibold transition-all duration-300 ${posts ? "border-b-3 border-blue-400 opacity-100" : "opacity-50"}`}
                  onClick={() => {
                    setPosts((prevState) => !prevState);
                    setComments((prevState) => !prevState);
                  }}
                >
                  Posts
                </p>
              </div>
              <div className="cursor-pointer">
                <p
                  className={`py-2 font-semibold transition-all duration-300 ${comments ? "border-b-3 border-blue-400 opacity-100" : "opacity-50"}`}
                  onClick={() => {
                    setPosts((prevState) => !prevState);
                    setComments((prevState) => !prevState);
                    fetchComments();
                  }}
                >
                  Comments
                </p>
              </div>
            </div>
            {/* either comments or posts content */}
            {posts ? (
              userPosts.map((userPost, index) => (
                <Post
                  key={userPost.id}
                  content={userPost}
                  setPosts={setUserPosts}
                  index={index}
                />
              ))
            ) : loadingComments ? (
              <div>Loading..</div>
            ) : (
              userComments &&
              userComments.map((userPost, index) => {
                if (loadingPostComments)
                  return (
                    <div
                      key={index}
                      className="flex w-full justify-center py-4 pb-0"
                      style={{ filter: "brightness(0) invert(1)" }}
                    >
                      <Lottie animationData={LoadingScreen} loop={true} />
                    </div>
                  );
                return (
                  <div key={index}>
                    <Post
                      content={userPost}
                      setPosts={setUserPosts}
                      index={index}
                    />
                    {postCommentsMap[userPost.id]?.length > 0 && (
                      <div className="ml-10 border-l">
                        {postCommentsMap[userPost.id].map(
                          (comment, commentIndex) => (
                            <div
                              key={commentIndex}
                              className="flex w-full cursor-pointer justify-center border-b pt-4"
                            >
                              <div className="flex w-[95%]">
                                <div className="flex w-13 flex-col">
                                  <Avatar className="h-auto w-10">
                                    <AvatarImage
                                      src={comment.creator.imageUrl}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="flex max-w-full min-w-0 flex-1 flex-col">
                                  <div className="flex w-full gap-1">
                                    <div className="flex w-fit max-w-[60%] items-center gap-1 overflow-hidden">
                                      <p className="truncate">
                                        {comment.creator.userName}
                                      </p>
                                    </div>
                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
                                      <div className="flex">
                                        <p className="text-sm text-[#56595d]">
                                          @{comment.creator.displayName}
                                        </p>
                                        <p className="text-sm text-[#56595d]">
                                          . {formatTimeAgo(comment.createdAt)}
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
                                    <p className="w-full">{comment.content}</p>
                                  </div>
                                  <div
                                    className="mt-1 flex w-full items-center gap-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                  >
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <div
                                            className="flex cursor-pointer items-center gap-1 rounded-full p-3 text-[#72767b] transition hover:bg-[#1e0c14] hover:text-[#da317d]"
                                            onClick={() => handleLike()}
                                          >
                                            {comment.hasLiked ? (
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
                                              className={`text-sm ${comment.hasLiked && "text-[#da317d]"}`}
                                            >
                                              {comment.likesCount}
                                            </p>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          {comment.hasLiked ? (
                                            <p>Unlike</p>
                                          ) : (
                                            <p>Like</p>
                                          )}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
