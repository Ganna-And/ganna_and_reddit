import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './rightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/ClientApp';
import Directory from './Directory/Directory';
import { useRecoilState, useRecoilValue } from 'recoil';
import { defaultMenuItem, directoryMenuState } from '@/src/atoms/directoryMenuListAtom';
import { CommunityState } from '@/src/atoms/communitiePageAtom';
import useDirectory from '@/src/hooks/useDirectory';

const Navbar: React.FC = () => {
    const [user, loading, error] = useAuthState(auth);  
    const {onSelectedMenuItem} = useDirectory()
     return (
        <Flex bg="white" height='44px' padding='6px 12px' 
        justify={{md:'space-between'}}>
            <Flex align='center' 
            width={{base:'40px', md:'auto'}}
            mr={{base: 0, md: 2}}>
            <Image src='https://e7.pngegg.com/pngimages/15/349/png-clipart-india-gaana-logo-streaming-media-milestone-s-india-text-trademark.png'
            height='30px' alt='g logo'
            onClick={()=>{onSelectedMenuItem(defaultMenuItem)}}
            cursor='pointer'/>
            <Image src='https://raw.githubusercontent.com/shadeemerhi/reddit-clone-yt/cfb2f3bea30f757c25371be4b83c1fc65a903f2b/public/images/redditText.svg'
            alt='ganna logo' height='46px' 
            display={{base: 'none', md: 'unset'}}/>
            </Flex>
            {user && <Directory />  }
            <SearchInput user={user}/>
            <RightContent user={user} />
           </Flex>
    );
};
export default Navbar;