import { Community } from '@/src/atoms/communitiePageAtom';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from 'react-icons/fa';


type HeaderProps = {
    communityData: Community;
};

const Header:React.FC<HeaderProps> = ({communityData}) => {
    
    const { communityStateValue, joinOrLeaveCommunity, loading  } = useCommunityData()
   const isJoined = !!communityStateValue.mySnippets.find(
    item => item.communityId == communityData.id)
    console.log(isJoined)
    return(
        <Flex direction='column' height='146px' width='100%'>
            <Box height='50%' bg='blue.400' />
            <Flex justify='center'  bg='white' flexGrow={1}>
            <Flex  width='95%' maxWidth='860px' bg='white' >
                {communityStateValue.currentCommunity?.imageURL ? (
                <Image
                 src={communityStateValue.currentCommunity.imageURL} 
                 alt='community img'
                 borderRadius='full'
                 boxSize='66px'
                 position='relative'
                 top={-3}
                 border='4px solid white'
                color={'blue.500'}/>):
                (<Icon as={FaReddit}
                fontSize={64}
                color={'blue.400'}
                position='relative'
                top={-3}
                border='2px solid white'
                borderRadius='50%'
                />)}
                <Flex padding='10px 16px'>
                    <Flex direction='column' mr={6}>
                    <Text fontWeight={800} fontSize='16pt'>{communityData.id}</Text>
                   <Text 
                   fontWeight={600} 
                   color='gray.400'
                   fontSize='10pt'>
                    r/{communityData.id}</Text>
                    </Flex>
                    <Button 
                variant={isJoined ? 'outline' :
                 'solid'} 
                 pr={6} pl={6} height={30}
                 onClick={()=>{joinOrLeaveCommunity(communityData, isJoined)}}
                 isLoading={loading}>{isJoined ? 'Joined' : 
                 'Join'}</Button>
                </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
export default Header;