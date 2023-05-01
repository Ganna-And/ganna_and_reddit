import { auth } from '@/src/firebase/ClientApp';
import { Button, Img, Text} from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';


const OAuthButtons:React.FC = () => {


    const [signInWithGoogle, user, 
        loading, error] = useSignInWithGoogle(
        auth
      );

    return (
        <>
        <Button variant='outline' mb={2}
         type='submit'
         isLoading={loading} 
         onClick={()=>{
           signInWithGoogle();
        }}>
            <Img height='20px' mr={6} src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/882px-Google_%22G%22_Logo.svg.png?20230305195327' alt='goofle logo' />Continue with Google</Button>
        <Button variant='outline' mb={2}>
            <Img height='20px' mr={6} src='https://pic.onlinewebfonts.com/svg/img_326384.png' alt='github logo'/>Continue with Github</Button>
        {error && <Text>{error.message}
        </Text>}
        </>
        
    )
}
export default OAuthButtons;