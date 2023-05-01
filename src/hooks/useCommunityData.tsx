import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilStateLoadable, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, CommunityState } from '../atoms/communitiePageAtom';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { auth, firestore } from '../firebase/ClientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { authModalState } from '../atoms/authModalAtom';
import  { useRouter } from 'next/router';



const useCommunityData = () => {
   const [communityStateValue, setCommunityStateValue]= useRecoilState(CommunityState) 
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('');
   const [user] = useAuthState(auth);
   const setAuthModalState = useSetRecoilState(authModalState);
   const router = useRouter();
   
   const joinOrLeaveCommunity = (
    communityData: Community,
     isJoined: boolean,
     ) => {
    //if the user signed in
    if(!user){
        setAuthModalState({ open: true, view:'login'});
        return
    }
    //if not => open auth mode
    if(isJoined){
        leaveCommunity(communityData.id)
        return;
    }
    joinCommunity(communityData);
   }
   const getMySnippets = async() =>{
    setLoading(true)
    try {
        const snippetDocs = await getDocs(
            collection(firestore, `users/${user?.uid}/communitySnippets`)
            );
        const snippets = snippetDocs.docs.map((doc)=>({...doc.data()}));
        setCommunityStateValue((prev)=>({
            ...prev,
            mySnippets: snippets as CommunitySnippet[],
            snippetsFetched: true,
        }));

    } catch (error:any) {
        console.log('getMySnippets error', error);
        setError(error)
    }
    setLoading(false)
   }
   const joinCommunity =async (communityData: Community)=>{
    //batch writes
    //creating new community snippet
    //updating the number of users on community
   
    try {
        const batch = writeBatch(firestore);
        const newSnippet: CommunitySnippet={
            communityId:communityData.id,
            imageURL: communityData.imageURL || '',
            isModerator: user?.uid === communityData.creatorId,
        }
        batch.set(doc(firestore,`users/${user?.uid}/communitySnippets`, communityData.id), newSnippet);
        batch.update(doc(firestore, 'communities', communityData.id),{
            numberOfMembers: increment(1)
        });

        await batch.commit();
        //update recoil state => communityState.mySnippets
        setCommunityStateValue(prev=>({
            ...prev,
            mySnippets:[...prev.mySnippets, newSnippet]
         }));
         
       } catch (error:any) {
        console.log('joinCommunity error', error);
        setError(error.message);
    }
    setLoading(false);
}
     
     
   const leaveCommunity = async (communityId: string) =>{
     //batch writes
     try {
       const batch = writeBatch(firestore);
       //deleting  community snippet
       batch.delete(doc(firestore,`users/${user?.uid}/communitySnippets`, communityId));
       //substructing the number of users on community by one
       //substructing the number of users on community by one
    batch.update(doc(firestore, 'communities', communityId),{
        numberOfMembers: increment(-1)
    });
    //update recoil state => communityState.mySnippets
await batch.commit();
setCommunityStateValue((prev)=>({
      ...prev,
    mySnippets: prev.mySnippets.filter((item )=> item.communityId !== communityId)
}))
     } catch (error:any) {
        console.log('leaveCommunity error', error);
        console.log(setError(error.message));
     }
setLoading(false)


   };
   const getCommunityPostVotes = async(communityData: Community) =>{}
   useEffect(() => {
    if(!user) {
       setCommunityStateValue((prev)=>({
     ...prev,
     mySnippets:[],
     snippetsFetched: false,
       }));
       return; 
    }
    getMySnippets();
  }, [user]);

  const getCommunityData =async(communityId: string)=>{
const communityDataDocRef = doc(firestore, 'communities', communityId);
const communityDataDoc = await getDoc(communityDataDocRef);

setCommunityStateValue((prev)=>({
    ...prev,
    currentCommunity:{
        id: communityDataDoc.id,
        ...communityDataDoc.data()
    }as Community
}))
  }
   useEffect(()=>{
    getCommunityPostVotes
   })
useEffect(()=>{
    const {communityId} = router.query;
    if(communityId && !communityStateValue.currentCommunity){
getCommunityData(communityId as string)
    }
},[router.query, communityStateValue.currentCommunity])

  return{
//data and functions
communityStateValue,
joinOrLeaveCommunity,
loading
}   
}


export default useCommunityData;