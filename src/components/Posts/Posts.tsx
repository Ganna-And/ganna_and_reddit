import { Community } from "@/src/atoms/communitiePageAtom";
import { Post } from "@/src/atoms/postsAtom";
import { auth, firestore } from "@/src/firebase/ClientApp";
import usePost from "@/src/hooks/usePost";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack, StackDivider } from "@chakra-ui/react";
import PostLoader from "./PostLoader";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  //useAuthHook
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    setPostStateValue,
    postStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePost();

  const getPosts = async () => {

    try {
        setLoading(true); 
      //get posts from our community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
     
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData]);

  return (
    <>
    {loading ?( <PostLoader/>) : (
    <Stack>
      {postStateValue.posts.map((item) => (
        // eslint-disable-next-line react/jsx-key
        <PostItem
          key={item.id}
          post={item}
          userIsCreator={user?.uid === item.creatorId}
          userVoteValue={postStateValue.postVotes.find(vote=>
            vote.postId === item.id )?.voteValue}
          onVote={onVote}
          onSelectPost={onSelectPost}
          onDeletePost={onDeletePost}
        />
      ))}
    </Stack>) 
}
    
    </>
  );
};
export default Posts;
