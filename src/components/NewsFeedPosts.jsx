import { API_BASE_URL } from "@/lib/api";
import { useState, useEffect, useRef, useCallback } from "react";
import Lottie from "lottie-react";
import LoadingScreen from "../assets/LoadingScreen.json";
import Post from "./Post";

export default function NewsFeedPosts() {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/Post/allPosts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          return res.text().then((t) => {
            setAuthError(t);
            throw new Error(t);
          });
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setAuthError(error);
      });
  }, []);
  if (loading)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div style={{ filter: "brightness(0) invert(1)" }}>
          <Lottie
            animationData={LoadingScreen}
            loop={true}
            className="h-50 w-50"
          />
        </div>
      </div>
    );

  if (!loading && posts)
    return (
      <div className="mb-14 flex w-full flex-col md:mb-0">
        {posts.map((post, index) => {
          if (!post) return null;
          return (
            <Post
              key={post.id}
              content={post}
              setPosts={setPosts}
              index={index}
            />
          );
        })}
      </div>
    );
}
