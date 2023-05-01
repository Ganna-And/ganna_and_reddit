import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DirectoryMenuItem, directoryMenuState } from '../atoms/directoryMenuListAtom';
import { useRouter } from 'next/router';
import { CommunityState } from '../atoms/communitiePageAtom';
import useCommunityData from './useCommunityData';
import { FaReddit } from 'react-icons/fa';



const useDirectory = () => {
    const [directoryState, setMenuState]= useRecoilState(directoryMenuState);
    const router = useRouter();
    const communityStateValue = useRecoilValue(CommunityState);
    
    const onSelectedMenuItem = (menuItem: DirectoryMenuItem)=>{
        setMenuState((prev)=>({
            ...prev,
            selectedMenuItem: menuItem
        }));
        router.push(menuItem.link);
        if(directoryState.isOpen){
            toggleOpenMenu();
        }
    }
    const toggleOpenMenu = ()=>{
        setMenuState((prev)=>({
            ...prev,
            isOpen: !prev.isOpen
            
        }));
    };
useEffect(()=>{
const {currentCommunity}= communityStateValue;
if(currentCommunity){
    setMenuState((prev)=>({
        ...prev,
        selectedMenuItem:{
           imageURL: currentCommunity.imageURL,
           icon: FaReddit,
           iconColor:'blue.500',
           displayText: `r/${currentCommunity.id}`,
           link: `/r/${currentCommunity.communityId}`
        }
    }))
}

},[communityStateValue.currentCommunity])

    return {directoryState, toggleOpenMenu, onSelectedMenuItem}
}
export default useDirectory;