
import React from 'react';
import  Link  from 'next/link';
import { Flex, Button } from '@chakra-ui/react';

const NotFound:React.FC = () => {
    
    return (
        <Flex
        justifyContent='center'
        alignItems='center'
        direction='column'
        minHeight='60vh'>
            Sorry community with this name doesnt exist
            <Link href="/">
                <Button mt={4}>
                    GO HOME
                </Button>
                
            </Link>
        </Flex>
    )
}
export default NotFound;