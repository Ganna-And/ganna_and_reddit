import { auth, firestore } from '@/src/firebase/ClientApp';
import { Button, Box, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Checkbox, Stack, Flex, Icon } from '@chakra-ui/react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {BsFillEyeFill, BsFillPersonFill} from 'react-icons/bs';
import {HiLockClosed} from 'react-icons/hi'

type CreateCommunityModalProps = {
    open: boolean,
    handleClose: ()=> void
};

const CreateCommunityModal:React.FC<CreateCommunityModalProps> = ({open, handleClose}) => {
     
    const [communityName, setCommunityName] = useState('');
    const [charRemaining, setCharRemaining] =useState(21);
    const [communityType, setCommunityType] = useState('private');
    const [error, setError] = useState('')
    const [user] =useAuthState(auth);
    const [loading, setLoading] = useState(false)

    const handleChange =(event: React.ChangeEvent<HTMLInputElement>)=>{
        
        if(event.target.value.length > 21) return;
        setCommunityName(event.target.value);

        setCharRemaining(21 - event.target.value.length);
    }

    const onCommunityTypeChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setCommunityType(event.target.name)   
    }
   
    const handleCreateComunity = async()=>{
        //validate community name
        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(error) setError('');
        if(format.test(communityName) || communityName.length <3){
            setError(
            'Community name can not contain special characters like and must be minimum 4 characters')
            return;
        }
       
        setLoading(true);
      
        try {
     const communityDocRef = doc(firestore, 'communities', communityName);
    await runTransaction(firestore, async(transaction)=>{
    // check if community exist in db
    const communityDoc = await transaction.get(communityDocRef);
     
    if(communityDoc.exists()){
       throw new Error(`Sorry, r/${communityName} is taken.Try another one`);
    }
    //create community
    transaction.set(communityDocRef, {
        creatorId: user?.uid,
        createdAt: serverTimestamp(),
        numberOfMembers: 1,
        privacyType: communityType,
        
     });
     //create community snippet on user

     transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),{
        communityId: communityName,
        isModarator: true,
     });

    });
     
     
            
        } catch (error: any) {
        console.log('handleCreateComunity error', error);
        setError(error.message)    
        }
     
     setLoading(false)
    }

    return (
        <>
         
    
          <Modal isOpen={open} onClose={handleClose} size={'lg'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader display='flex' flexDirection='column'
              fontSize={15} padding={3}>Create Community
              </ModalHeader>
              <Box pl={3} pr={3}>
              <ModalCloseButton />
              <ModalBody display='flex' flexDirection='column'
              padding='10px 0px'>
                <Text fontWeight='600' fontSize={15}>Name</Text>
                <Text fontSize={10} color='gray.500'>
                    Community capitalization can not be changed
                    </Text>
                <Text position='relative'
                 top='28px' left='10px'
                 width='20px' color='gray.400'>
                    r/</Text>
                <Input position='relative'
                value={communityName} size='sm'
                 pl={22}
                onChange={handleChange}/>
                  <Text fontSize='8pt' color='red'
                   fontWeight='500' ml={2} mt={2}>{error}</Text>
                <Text fontSize='9pt' 
                color={charRemaining === 0 ? 'red' : 'gray.500'}>
                    {charRemaining} Characters remaining</Text>
                <Box>
                    <Text fontWeight='600' fontSize={15}
                    mt={4} mb={4}>Community type</Text>
                    {/* <Checkbox/> */}
                    <Stack spacing={2}>
                    <Checkbox name='public' 
                    isChecked={communityType === 'public'}
                    onChange={onCommunityTypeChange}>
                        <Flex align='center'>
                    <Icon as={BsFillPersonFill} mr={2} color='gray.500'/>
                    <Text fontSize={10}>
                        Public</Text>
                    <Text fontSize={8} pl={2} color='gray.500'>
                        Any one can view, post and comment here</Text>
                    </Flex>
                    </Checkbox>
                    <Checkbox name='restricted'
                     isChecked={communityType === 'restricted'}
                     onChange={onCommunityTypeChange}>
                        <Flex align='center'>
                        <Icon as={BsFillEyeFill} mr={2} color='gray.500'/>       
                    <Text fontSize={10}>Restricted</Text>
                    <Text fontSize={8} pl={2} color='gray.500'>
                        Only approved users can post in this comunity</Text>
                    </Flex>
                     </Checkbox>
                    <Checkbox name='private' 
                    isChecked={communityType === 'private'}
                    onChange={onCommunityTypeChange}>
                        <Flex align='center'>
                        <Icon as={HiLockClosed} mr={2} color='gray.500'/>
                    <Text fontSize={10}>Private</Text>
                    <Text fontSize={8} pl={2} color='gray.500'>
                        Only approved users can view this community</Text>
                    </Flex>
                    </Checkbox>
                    </Stack>
                </Box>
              </ModalBody>
              </Box>
              
    
              <ModalFooter color='gray.500' borderRadius='0px 0px 10px 10px'>
                <Button variant='outline' height='30px' mr={3} onClick={handleClose}>
                  Cancel
                </Button>
                <Button height='30px' onClick={handleCreateComunity} isLoading={loading}>Create Community</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}
export default CreateCommunityModal;