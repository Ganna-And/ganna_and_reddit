import { Community, CommunityState } from "@/src/atoms/communitiePageAtom";
import { Box, Button, Divider, Flex, Icon, Stack, Text, Link, Image, Spinner, Input } from "@chakra-ui/react";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import {RiCakeLine} from 'react-icons/ri'
import React, { useRef, useState } from "react";
import moment from "moment";

import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/src/firebase/ClientApp";
import useSelectFile from "@/src/hooks/useSelectFile";
import {FaReddit} from 'react-icons/fa'
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useSetRecoilState } from "recoil";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
const [user] = useAuthState(auth);
const selectedFileRef =useRef<HTMLInputElement>(null);
const {selectFile,onSelectFile,setSelectFile} = useSelectFile();
const [uploadingImage, setUploadingImage] = useState(false);
const setCommunityStateValue = useSetRecoilState(CommunityState);
const onUpdateImage =async()=>{
     if(!selectFile)return;
     setUploadingImage(true);
     try {
        const imgRef = ref(storage, `communities/${communityData.id}/image` );
        await uploadString(imgRef, selectFile, 'data_url');
        const downloadURL = await getDownloadURL(imgRef);
        await updateDoc(doc(firestore, 'communities', communityData.id),{
            imageURL: downloadURL,
        });
        setCommunityStateValue((prev)=>({
            ...prev,
            currentCommunity:{
                ...prev.currentCommunity,
                imageURL: downloadURL
            } as Community
        }))
     } catch (error: any) {
       console.log('onUpdateImage error', error) 
     }
     setUploadingImage(false)
};
  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.500"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={600}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsCircleHorizontal}></Icon>
      </Flex>
      <Flex direction="column" bg="white" p={3} borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt"fontWeight={700}>
              <Flex
                fontSize="10pt"
                
                direction="column"
                flexGrow={1}
              >
                <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
                <Text>Members</Text>
              </Flex>

              <Flex direction="column" flexGrow={1}>
                <Text>1</Text>
                <Text>Online</Text>
              </Flex>
          </Flex>
          <Divider />
          <Flex align='center' width='100%' p={1} fontSize='10pt' fontWeight={500}>
            <Icon as={RiCakeLine} fontSize='15pt' mr={2} />
            {communityData.createdAt && 
            (<Text fontSize='9pt' fontWeight={500}>Created at {moment(new Date(
                communityData.createdAt.seconds *1000)).format('MMM DD YYYY')}
                </Text>)}
                <Link href={`/r/${communityData.id}/submit`}>
                <Button mt={3} height='30px'>Create Post</Button>
                </Link>
          </Flex>
          {user?.uid === communityData.creatorId &&(
            <>
            <Divider/>
            <Stack spacing={1} fontSize='10pt'>
                <Text fontWeight={600}>Admin</Text>
                <Flex align='center' justify='space-between'>
                  <Text 
                  color='blue.500' 
                  cursor='poiter' 
                  _hover={{textDecoration: 'underline'}}
                  onClick={()=>selectedFileRef.current?.click()}>
                    Change image
                  </Text>
                  {communityData.imageURL || selectFile ?
                  ( <Image src={selectFile|| communityData.imageURL}
                   borderRadius='full' boxSize='40px' alt='Community image'/>):(
                    <Image as={FaReddit} 
                    fontSize='40px'
                    color='brand.100'
                    mr={2} alt='defaul reddit icon'/>
                   )}
                   {selectFile &&(
                    uploadingImage ? (<Spinner /> ):( <Text cursor='pointer'
                     onClick={onUpdateImage}>SaveChanges
                     </Text>))}
                     <Input 
                     id='file-upload'
                     type='file'
                     hidden
                     ref={selectedFileRef}
                     onChange={onSelectFile}/>
                </Flex>
            </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
