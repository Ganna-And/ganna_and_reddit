
import React, { useState } from 'react';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import { authModalState } from '@/src/atoms/authModalAtom';
import {useSetRecoilState} from 'recoil'
import { auth } from '@/src/firebase/ClientApp';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { FIREBASE_ERRORS } from '@/src/firebase/Errors';

type LoginProps = {
    
};

// eslint-disable-next-line react-hooks/rules-of-hooks

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loginForm, setLoginForm] = useState({
        email:'',
        password:''
    });
    

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        signInWithEmailAndPassword(loginForm.email, loginForm.password)    
    };
    const onChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
     setLoginForm((prev)=>({
        ...prev,
        [event.target.name]: event.target.value

     }))
    };
    
    return (
        <form onSubmit={onSubmit}>
            <Input
            required
            name="email" 
            type='email' 
            placeholder='email'
            mb={2}
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{color:'gray.500'}}
            _hover={{
                bg:'white',
                border:"1px solid",
                borderColor:"blue.500"
                
            }}
            bg='gray.50'/>
            <Input 
            required
            name='password'
            type='password'
            placeholder='password'
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{color:'gray.500'}}
            _hover={{
                bg:'white',
                border:"1px solid",
                borderColor:"blue.500"
                
            }}
            bg='gray.50'
            mb={2}/>
           <Text textAlign='center' fontSize='9pt' color='red'>{FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}</Text>
            <Button width='100%' height='36px' mt={2} mb={2} 
            type='submit'
            isLoading={loading}>
                Log In</Button> 
                <Text fontSize='9pt' 
                textAlign='center' fontStyle='italic'>Forgot your password?</Text>
                <Text fontSize='9pt' fontWeight='700'
                 color='blue.400' 
                 cursor='pointer' onClick={()=>
                    setAuthModalState((prev)=>({
                    ...prev,
                    view: 'resetPassword'}))}
                 textAlign='center'>
                    Reset</Text>    
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mb={2}>New here?</Text>
                <Text ml={2} color='blue.500' 
                fontWeight='700'
                cursor='pointer'
                onClick={()=>setAuthModalState((prev)=>({
                    ...prev,
                    view: 'signup'
                }))}> SIGN UP</Text>
            </Flex>
        </form>
        
    );
};
export default Login;