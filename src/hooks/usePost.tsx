import React, { ReactDOM, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, PostVote, postState } from '../atoms/postsAtom';
import { auth, firestore, storage } from '../firebase/ClientApp';
import { deleteObject, ref } from 'firebase/storage';
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CommunityState } from '../atoms/communitiePageAtom';
import { authModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';



const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState)
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();
const currentCommunity = useRecoilValue(CommunityState).currentCommunity;

  
const onVote = async(event:React.MouseEvent<SVGElement, MouseEvent>, post:Post, vote: number, communityId: string)=>{
  event.stopPropagation();
      if(!user?.uid){
        setAuthModalState({open:true, view:'login'});
        return;
       }
       event.isPropagationStopped();
       try {
       const {voteStatus} = post;
       const existingVote = postStateValue.postVotes.find(vote=> vote.postId === post.id);
       const  updatedPost = {...post};
       const updatedPosts = [...postStateValue.posts];
       let updatedPostVotes = [...postStateValue.postVotes];
       let voteChange = vote;
       
       const batch = writeBatch(firestore);
if (!existingVote) {
  //creating new postVote Document in users collection
  const voteDocRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`));
  const newVote: PostVote={
    id: voteDocRef.id,
    postId: post.id!,
    communityId,
    voteValue: vote,
   }
   batch.set(voteDocRef, newVote)
  // adding substracting 1 to the vote number value
updatedPost.voteStatus = voteStatus + vote;
updatedPostVotes = [...updatedPostVotes, newVote];

//existing vote(tey have voted on the post before)
} else {
    const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`)
    //  removing their vote (up => neutral Or down =>neutral)
     if(existingVote.voteValue === vote){
       //add/substract 1 to /from the post.voteStatus
    updatedPost.voteStatus = voteStatus-vote;
    updatedPostVotes = updatedPostVotes.filter((vote )=> vote.id !== existingVote.id);
 //deleting the postVote Document
   batch.delete(postVoteRef);
   voteChange += -1
    }
   
  //fliping their vote (up => down OR down=>up 
  else {
    //adding or substracting 2 to/from posts.voteStatus
  updatedPost.voteStatus = voteStatus + 2*vote;
  const voteIdx = postStateValue.postVotes.findIndex((vote )=> vote.id ===existingVote.id);
  updatedPostVotes[voteIdx] = {
    ...existingVote,
    voteValue: vote,
  };
    //updating existing postVote document in db
  batch.update(postVoteRef, {
    voteValue: vote,
  })
   voteChange = 2*vote;
  }
}
//update our post document
const postIdx = postStateValue.posts.findIndex((item)=> item.id === post.id);
updatedPosts[postIdx] = updatedPost;
setPostStateValue((prev)=>({
    ...prev,
     posts: updatedPosts,
    postVotes: updatedPostVotes
}));
if(postStateValue.selectedPost){
  setPostStateValue((prev)=>({
...prev,
selectedPost:updatedPost
  }))
}
const postDocRef = doc(firestore, 'posts', post.id!);
batch.update(postDocRef,{
    voteStatus: voteStatus + voteChange});
await batch.commit();
//update state with updated values


} catch (error) {
         console.log("onVote error", error);
       }
        
    };

const onSelectPost = (post: Post)=> {
      setPostStateValue((prev)=>({
        ...prev,
        selectedPost: post,
      }));
router.push(`/r/${post.communityId}/comments/${post.id}`);
    };

    const onDeletePost = async(post:Post): Promise<boolean>=>{
        try {
          //if post has img remore img from firebase
          if(post.imageURL){
            const imgRef = ref(storage, `posts/${post.id}/image`);
            await deleteObject(imgRef)
          }
    //delete post from firestore
    const postDocRef = doc(firestore, 'posts', post.id);
    await deleteDoc(postDocRef);

    //update recoil state

    setPostStateValue((prev)=>({
        ...prev,
        posts: prev.posts.filter((item)=> item.id !== post.id),
    }));
        return true  
        } catch (error) {
         return false   
        }
    
    };

    const getCommunityPostVotes = async(communityId: string)=>{

        const postVotesQuery = query(
            collection(firestore,'users', `${user?.uid}/postVotes`),
        where('communityId', '==', communityId));
        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()

        }));
        setPostStateValue((prev)=>({
            ...prev,
            postVotes: postVotes as PostVote[],
        }));
    };
       useEffect(()=>{
        if(!user || !currentCommunity?.id) return;
        getCommunityPostVotes(currentCommunity?.id)
       }, [user, currentCommunity]);

       useEffect(()=>{
        if(!user){
            setPostStateValue((prev)=>( {
                ...prev,
                postVotes: [],
            }))
        }
       },[user]);
       

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    };
};
export default usePosts;