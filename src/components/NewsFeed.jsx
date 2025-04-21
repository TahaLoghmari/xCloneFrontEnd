import NewsFeedAddPost from "./NewsFeedAddPost";
import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedPosts from "./NewsFeedPosts";
import { createContext, useState, useContext } from "react";
import { States } from "./App";

export const NewsFeedStates = createContext(null);
export default function NewsFeed({}) {
  const [forYou, setForYou] = useState(true);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <NewsFeedStates.Provider
      value={{
        forYou,
        following,
        setForYou,
        setFollowing,
        loading,
        setLoading,
      }}
    >
      {/* This is The Header */}
      <NewsFeedHeader />
      <div className="flex w-full flex-1 flex-col">
        {/* This is the part where you can post */}
        <NewsFeedAddPost />
        {/* Posts part */}
        <NewsFeedPosts />
      </div>
    </NewsFeedStates.Provider>
  );
}
