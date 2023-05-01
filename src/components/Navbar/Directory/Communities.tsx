import React, { useState } from 'react';
import CreateCommunityModal from '../../Model/CreateCommunityModal.tsx/CreateCommunityModal';
import { Flex, MenuItem , Icon, Box, Text, MenuList} from '@chakra-ui/react';
import {GrAdd} from 'react-icons/gr'
import { useRecoilValue  } from 'recoil';
import { CommunityState } from '@/src/atoms/communitiePageAtom';
import MenuListItem from './MenuListItem';
import { FaReddit } from 'react-icons/fa';
type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {
    const [open, setOpen] = useState(false);
    const mySnippets = useRecoilValue(CommunityState).mySnippets
    return (
        <>
        <Box mb={4} mt={4} ml={4}>
            <Text fontSize='7pt' color='gray.1
            500' fontWeight={500} mb={2} >
                MODERATING
            </Text>
        {mySnippets.filter(snippet=>snippet.isModerator).map((snippet)=>
            (<MenuListItem key={snippet.communityId} icon={FaReddit} iconColor='blue.500'
             imageURL={snippet.imageURL} 
             displayText={`r/${snippet.communityId}`}
             link={`/r/${snippet.communityId}`}/>)
        )}
          </Box>
        <CreateCommunityModal open={open} handleClose={()=>setOpen(false)}/>
        <Box mb={4} mt={4} ml={4}>
            <Text fontSize='7pt' color='gray.1
            500' fontWeight={500} mb={2} >
                MY COMMUNITIES
            </Text>
      
        <MenuItem fontSize='10pt' width='100%'
         _hover={{bg:'brand.100', color:'white'}}
         onClick={()=>setOpen(true)}>
        <Flex align='center' >
            <Icon as={GrAdd} mr={2}/>Create Comunity
            </Flex>
            
            
        </MenuItem>
        {mySnippets.map((snippet)=>
            (<MenuListItem key={snippet.communityId} icon={FaReddit} iconColor='blue.500'
             imageURL={snippet.imageURL} 
             displayText={`r/${snippet.communityId}`}
             link={`/r/${snippet.communityId}`}/>)
        )}
          </Box>
        </>
    )
}
export default Communities;