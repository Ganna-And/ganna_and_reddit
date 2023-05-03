import { Post } from "@/src/atoms/postsAtom";
import {
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Skeleton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  Link,
  
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (event:React.MouseEvent<SVGElement, MouseEvent>, post:Post, vote: number, communityId: string) => void;
  onSelectPost?: (post: Post) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  homePage: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onSelectPost,
  onDeletePost,
  homePage,
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const singlePage =!onSelectPost;
  const router = useRouter();

  const handleDeletePost = async (event:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    try {
      setDeleteLoading(true);
      const sucsess = await onDeletePost(post);
      if (!sucsess) {
        throw new Error("Failed to delete the post");
      }
      console.log("Post sucsesfully deleted");
      if(singlePage){
        router.push(`/r/${post.communityId}`)
      }
    } catch (error: any) {
      setError(error.message);
    }
    setDeleteLoading(false);
  };
  return (
    <Flex
      bg="orange.50"
      border="1px solid"
      borderColor={singlePage ? 'white' : "gray.300"}
      borderRadius={singlePage ? '0px': '4px'}
      _hover={{ borderColor: singlePage ? 'white' : '"gray.500" '}}
      cursor={singlePage ? 'unset': "pointer"}
      onClick={()=> onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePage ? 'white' : "gray.100"}
        p={2}
        width="40px"
        borderRadius={singlePage ? '0px' : '3px 0px 0px 3px'}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "orange.500" : "gray.400"}
          fontSize={22}
          onClick={(event)=>onVote(event, post, 1, post.communityId)}
          cursor="pointer"
        />
        <Text fontSize="9pt">
          {post.voteStatus}
        </Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
          fontSize={22}
          onClick={(event)=> onVote(event, post, -1, post.communityId)}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
            <Alert status="error">
              <AlertIcon />
              <Text mr={2}>{error}</Text>
            </Alert>
          
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing="0.6" align="center" fontSize="9pt">
            {/* Home page check */}
            {homePage && (
              <>
              {post.communityImageURL ?(
                <Image alt ='community image'
                borderRadius='full'
                boxSize='18px'
                mr={2}
                src={post.communityImageURL}/>
              ) : (
                <Icon as={FaReddit} fontSize='18pt' color='blue.500' mr={2}/>
              )}
              <Link href={`r/${post.communityId}`}> 
              <Text mr={2} fontWeight={700}
              onClick={event=> event.stopPropagation()}>{`r/${post.communityId}`}</Text>
              </Link>
              <Icon  as={BsDot} color='gray.500' fontSize='8pt'/>
              </>
            )}
            <Text>
              Posted by {post.creatorDisplayName} <span></span>
              {post.createdAt && moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center">
              {imageLoading ? (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              ) : (
                <Image
                  src={post.imageURL}
                  maxHeight="460px"
                  alt="image of post"
                  display={imageLoading ? "none" : "unset"}
                  onLoad={() => setImageLoading(false)}
                />
              )}
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            borderRadius={4}
            padding="8px 10px"
            _hover={{ color: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            borderRadius={4}
            padding="8px 10px"
            _hover={{ color: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            borderRadius={4}
            padding="8px 10px"
            _hover={{ color: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              borderRadius={4}
              padding="8px 10px"
              _hover={{ color: "gray.200" }}
              cursor="pointer"
              onClick={handleDeletePost}
            >
              {deleteLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
