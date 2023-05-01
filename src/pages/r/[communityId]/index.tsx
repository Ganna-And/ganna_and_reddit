
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/src/firebase/ClientApp';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { Community, CommunityState } from '@/src/atoms/communitiePageAtom';
import safeJsonStrigify from 'safe-json-stringify'
import NotFound from '@/src/components/Community/NotFound';
import Header from '@/src/components/Community/Header';
import PageContent from '@/src/components/Layout/PageContent';
import CreatePostLink from '@/src/components/Community/CreatePostLink';
import Posts from '@/src/components/Posts/Posts';
import { useRecoilState, useSetRecoilState } from 'recoil';
import About from '@/src/components/Community/About';

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage:React.FC<CommunityPageProps> = ({communityData}) => {
   
    const setCommunityStateValue = useSetRecoilState(CommunityState);

    useEffect(()=>{
        setCommunityStateValue((prev)=>({
          ...prev,
          currentCommunity: communityData,
        }))
          },[communityData]);
          
    if(!communityData){
        return(<NotFound />)
    }
    
    return (
    <>
    <Header communityData={communityData}/>
    <PageContent>
        <>
        < CreatePostLink />
        <Posts communityData={communityData}/>
        </>
        <>
      <About communityData={communityData}/>
        </>
        
    </PageContent>
    </>
    )

   
};


export async function getServerSideProps(context:GetServerSidePropsContext) {
    //get community data from server and pass it to the client
try {
    const communityDocRef = doc(firestore,
        'communities',
        context.query.communityId as string);
    
        const communityDoc = await getDoc(communityDocRef);

        return {
            props:{
                communityData: communityDoc.exists() ? JSON.parse(
                    safeJsonStrigify({id: communityDoc.id, ...communityDoc.data()})
                ) : '' ,
            }
        }

} catch (error) {
    console.log('getServerSideProps error', error)
}

}

export default CommunityPage;