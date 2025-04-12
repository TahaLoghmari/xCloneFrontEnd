import { API_BASE_URL } from "@/lib/api";
import { useState, useEffect, useRef, useCallback } from "react";
import Lottie from "lottie-react";
import LoadingScreen from "../assets/LoadingScreen.json";
import Post from "./Post";

export default function NewsFeedPosts() {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observer = useRef();

  const lastPostRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore],
  );

  useEffect(() => {
    setLoading(true);
    fetchPosts(1);
  }, []);

  const fetchPosts = (pageNum) => {
    fetch(`${API_BASE_URL}/Post/paginatedPosts?page=${pageNum}&pageSize=10`, {
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
        if (pageNum === 1) {
          setPosts(data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data]);
        }

        setHasMore(data.length > 0);
        setLoading(false);
        setLoadingMore(false);
      })
      .catch((error) => {
        setLoading(false);
        setLoadingMore(false);
        setAuthError(error);
      });
  };
  const loadMorePosts = () => {
    setLoadingMore(true);
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchPosts(nextPage);
      return nextPage;
    });
  };
  console.log(posts);
  if (loading)
    return (
      <div className="flex h-full w-screen flex-col items-center justify-center">
        <div style={{ filter: "brightness(0) invert(1)" }}>
          <Lottie
            animationData={LoadingScreen}
            loop={true}
            className="h-50 w-50"
          />
        </div>
      </div>
    );

  return (
    <div className="flex w-full flex-col">
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return <Post ref={lastPostRef} key={post.id} content={post} />;
        } else {
          return <Post key={post.id} content={post} />;
        }
      })}

      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-4 text-center text-gray-500">
          No more posts to load
        </div>
      )}
    </div>
  );
}
