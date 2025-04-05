import NewsFeedAddPost from "./NewsFeedAddPost";
import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedPosts from "./NewsFeedPosts";
import { createContext, useState } from "react";

export const States = createContext(null);
export default function NewsFeed({}) {
  const [forYou, setForYou] = useState(true);
  const [following, setFollowing] = useState(false);
  return (
    <States.Provider value={{ forYou, following, setForYou, setFollowing }}>
      <div className="w-full sm:ml-16">
        {/* This is The Header */}
        <NewsFeedHeader />
        {/* This is the part where you can post */}
        <NewsFeedAddPost />
        {/* Posts part */}
        <NewsFeedPosts />
      </div>
    </States.Provider>
  );
}
