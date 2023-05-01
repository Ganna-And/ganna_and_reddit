import { Box, Flex, Icon, Stack,Text } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from 'react-icons/io5';

export type Comment ={
    id: string;
    creatorId: string;
   creatorDisplayText: string;
   communityId: string;
   postId:string;
   postTitle: string;
   text: string;
   createdAt: Timestamp;


}

type CommentsItemProps = {
    comment: Comment;
    onDeleteComment:(comment: Comment) => void;
    userId: string;
    loadingDelete: boolean;
};

const CommentsItem:React.FC<CommentsItemProps> = ({comment,onDeleteComment,userId,loadingDelete}) => {

    
    return (
        <Flex align='center' >
            <Box>
                <Icon as={FaReddit} fontSize='30pt' color='gray.500' mr={2}/>
            </Box>
            <Stack spacing={1}>
                <Stack direction='row' fontSize='10pt' align='center'>
                    <Text fontSize='9pt' fontWeight={700}>{comment.creatorDisplayText}</Text>
                    <Text fontSize='9pt' fontWeight={700}>{moment(new Date(comment.createdAt.seconds*1000)).fromNow()}</Text>
                </Stack>
                <Stack ml={6}>
                <Text fontSize='12pt'>{comment.text}</Text>
                <Flex align='center'>
                    <Icon as={IoArrowUpCircleOutline} />
                    <Icon as={IoArrowDownCircleOutline} />
                    {userId === comment.creatorId &&
                    (<>
                    <Text fontSize='8pt' mr={3}
                     ml={3} _hover={{color:'blue.500'}} 
                     cursor='pointer'>
                        Edit
                        </Text>
                    <Text fontSize='8pt' mr={3} ml={3}
                    _hover={{color:'blue.500'}}
                    cursor='pointer'
                    onClick={()=> {onDeleteComment(comment)}}>
                        Delete</Text>
                        </>)}
                </Flex>
                </Stack>
            </Stack>
        </Flex>
    )
}
export default CommentsItem;