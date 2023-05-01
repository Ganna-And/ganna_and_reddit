
import { Inter } from 'next/font/google'
import PageContent from '../components/Layout/PageContent'
import { authModalState } from '../atoms/authModalAtom';
import { auth, firestore } from '../firebase/ClientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import usePosts from '../hooks/usePost';
import { Post, PostVote } from '../atoms/postsAtom';
import PostLoader from '../components/Posts/PostLoader';
import PostItem from '../components/Posts/PostItem';
import { Stack } from '@chakra-ui/react';
import CreatePostLink from '../components/Community/CreatePostLink';
import { CommunityState } from '../atoms/communitiePageAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import useCommunityData from '../hooks/useCommunityData';
import Recomandations from '../components/Community/Recomandations';
import Premium from '../components/Community/Premium';
import PersonalHome from '../components/Community/PersonalHome';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {postStateValue, setPostStateValue, onDeletePost, onSelectPost, onVote} = usePosts();
  const {communityStateValue} = useCommunityData()

  const buildUserHomeFeed = async ()=>{
    
   setLoading(true);
    try {
      if(communityStateValue.mySnippets.length){
         //get posts from user communities
         const mySnippetsIds = communityStateValue.mySnippets.map(snippet=> snippet.communityId);
         const postsQuery = query(collection(firestore, 'posts'),
         where('communityId', 'in', mySnippetsIds),
         limit(10));
         const postDocs = await getDocs(postsQuery);
         const posts = postDocs.docs.map((doc)=>({
          id: doc.id,
          ...doc.data()
         }));
         setPostStateValue((prev)=>({
          ...prev,
          posts: posts as Post[],
         }));
      } else{
        buildNoUserHomeFeed()
      }
     
    } catch (error) {
      
    }
    setLoading(false);
  };

  const buildNoUserHomeFeed = async ()=> {
setLoading(true);
try {
  const postQuery = query(collection(firestore, 'posts'),
  orderBy('voteStatus', 'desc'),
  limit(10));

  const postDocs = await getDocs(postQuery);
  const posts = postDocs.docs.map((doc)=>({
    id: doc.id,
    ...doc.data()
  }));

  setPostStateValue((prev)=>({
    ...prev,
    posts: posts as Post[],
  }))
  
} catch (error) {
  console.log('buildNoUserHomeFeed error', error)
}
setLoading(false);
  };

  const getPostVotes = async()=>{
    try {
     const postIds = postStateValue.posts.map(post=> post.id);
     const postVotesQuery = query(collection(firestore, `users/${user?.uid}/postVotes`),
     where('postId', 'in', postIds));
     const postVotesDocs= await getDocs(postVotesQuery);
     const postVotes = postVotesDocs.docs.map((doc)=>({
      id: doc.id,
      ...doc.data()
     }));
     setPostStateValue((prev)=>({
      ...prev,
      postVotes: postVotes as PostVote[],
     }))
    } catch (error) {
      console.log('getPostVotes error', error)
    }
  };

  //useEffects
  useEffect(()=>{
if(communityStateValue.snippetsFetched) buildUserHomeFeed()
  },[communityStateValue.snippetsFetched])

  useEffect(()=>{
if(!user && !loadingUser) buildNoUserHomeFeed();
  },[user, loadingUser]);

  useEffect(()=>{
if(user && postStateValue.posts.length) getPostVotes();
return()=>{
  setPostStateValue((prev)=>({
    ...prev,
    postVotes: [],
  }))
}
  }, [user, postStateValue.posts])

  return (
   <PageContent>
    <>
    <CreatePostLink />
   {loading ? (
    <PostLoader />
   ) : (
    <Stack>
    {postStateValue.posts.map((post)=>(
      <PostItem 
      key={post.id}
      post={post}
      onDeletePost={onDeletePost}
      onVote={onVote}
      onSelectPost={onSelectPost}
      userVoteValue={postStateValue.postVotes.find((vote)=>vote.postId === post.id)?.voteValue}
      userIsCreator={user?.uid === post.creatorId}
      homePage/>
    ))}
    </Stack>
)}
    </>
    <Stack spacing={5}>
    <Recomandations/>
    <Premium />
    <PersonalHome />
    </Stack>
   </PageContent>
  )
}
