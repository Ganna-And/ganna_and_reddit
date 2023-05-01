import { authModalState } from '@/src/atoms/authModalAtom';
import { Flex, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from "recoil";
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { auth } from '@/src/firebase/ClientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import ResetPassword from './ResetPasswrd';



const AuthModal:React.FC = () => {
    
const [modalState, setModalState] = useRecoilState(authModalState)
const [user, loading, error] = useAuthState(auth);

const handleClose =()=>{
    setModalState(prev=>({
        ...prev,
        open:false,
    }));
};

useEffect(()=>{
if(user) handleClose();
console.log("user", user)
}, [user])
return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>
            {modalState.view === 'login' && 'Login' }
            {modalState.view ==='signup' && 'Sign Up'}
            {modalState.view === 'resetPassword' && 'Reset Passwprd'}
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' 
          alignItems='center' 
          justifyContent='center'
          pb={2}>
           <Flex 
           direction='column'
           justify='center'
           width='70%' >
            {modalState.view === 'login' || modalState.view === 'signup' ? (
              <>
              <OAuthButtons />
            <Text textAlign='center' color='gray.500' mb={4} mt={4}>
              OR
            </Text>
            <AuthInputs  />
            </>
            ) : ( <ResetPassword />)}
           
           

           </Flex>
          </ModalBody>
          </ModalContent>
      </Modal>
    </>
  )
       
}
export default AuthModal;