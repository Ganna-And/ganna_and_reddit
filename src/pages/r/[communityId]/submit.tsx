import { CommunityState } from '@/src/atoms/communitiePageAtom';
import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/ClientApp';
import { Box, Text } from '@chakra-ui/react';

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

import About from '@/src/components/Community/About';
import useCommunityData from '@/src/hooks/useCommunityData';



const SubmitPage:React.FC = () => {
    const [user] = useAuthState(auth);
  // const communityStateValue = useSetRecoilState(CommunityState);
  const {communityStateValue} = useCommunityData();
   
    return (
        <PageContent >
        <>
        <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
            <Text>Create a post</Text>
        </Box>
        {user &&(<NewPostForm user={user} communityImageURL = {communityStateValue.currentCommunity?.imageURL} />
         )}
         </>
        <>
        {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity}/>}
        </>   
        </PageContent>
    )
}
export default SubmitPage;