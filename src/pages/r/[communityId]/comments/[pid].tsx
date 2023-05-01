import { authModalState } from '@/src/atoms/authModalAtom';
import { CommunityState } from '@/src/atoms/communitiePageAtom';
import { Post, postState } from '@/src/atoms/postsAtom';
import About from '@/src/components/Community/About';
import PageContent from '@/src/components/Layout/PageContent';
import Comments from '@/src/components/Posts/Comments/Comments';
import PostItem from '@/src/components/Posts/PostItem';
import { auth, firestore } from '@/src/firebase/ClientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import usePosts from '@/src/hooks/usePost';
import { User } from 'firebase/auth';
import { doc, getDoc, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { pid } from 'process';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';



const PostPage:React.FC = () => {
    const {postStateValue, setPostStateValue, onDeletePost, onVote} = usePosts();
    const [user] = useAuthState(auth);
    const router = useRouter();
    const {communityStateValue} =useCommunityData()
   

    const fetchPost = async (postId: string)=> {
try {
    const postDocRef = doc(firestore, 'posts', postId);
    const postDoc = await getDoc(postDocRef);
    setPostStateValue((prev)=>({
        ...prev,
        selectedPost:{
            id:postDoc.id, ...postDoc.data()
        } as Post
    }))
    
} catch (error) {
    console.log('fetchPost error', error)
}
    }

    useEffect(()=>{
        const {pid} = router.query;
if(pid && !postStateValue.selectedPost){
    fetchPost(pid as string);
}
    })
    return (
        <PageContent>
            <>
            {postStateValue.selectedPost &&
            (<PostItem 
                post={postStateValue.selectedPost} 
            onDeletePost={onDeletePost}
            onVote={onVote}
            userVoteValue={postStateValue.postVotes.find(
                (item)=> item.postId === postStateValue.selectedPost?.id
                )?.voteValue}
            userIsCreator={postStateValue.selectedPost?.creatorId === user?.uid}
            />
            )}

          <Comments user={user as User}
           selectedPost={postStateValue.selectedPost}
            communityId={postStateValue.selectedPost?.communityId as string} 
            />
           </>
           <> {communityStateValue.currentCommunity && (<About communityData={communityStateValue.currentCommunity} />)}
            </>
        </PageContent>
    )
}
export default PostPage;