import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, Button, MenuList, MenuItem, Flex, Icon, MenuDivider, Text } from '@chakra-ui/react';
import { User, signOut } from 'firebase/auth';
import React from 'react';
import {FaRedditSquare} from 'react-icons/fa';
import{VscAccount} from 'react-icons/vsc';
import{IoSparkles} from 'react-icons/io5';
import {CgProfile} from 'react-icons/cg';
import {MdOutlineLogout} from 'react-icons/md';
import { auth } from '@/src/firebase/ClientApp';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import { CommunityState } from '@/src/atoms/communitiePageAtom';

type UserMenuProps = {
    user?: User | null;
}

const UserMenu:React.FC<UserMenuProps> = ({ user }) => {
  
  const setAuthModalState = useSetRecoilState(authModalState);
    const logout = async()=>{
      await signOut(auth);
    }
    return (
        <Menu>
        <MenuButton cursor='pointer'
        padding='0px 6px'
        borderRadius={4} 
        _hover={{
        outline:'1px solid',
        outlineColor:'gray.200'
        }}>
          <Flex align='center'  >
                 <Flex align='center'  >
                    {user ? (
                <>
                <Icon fontSize='24' 
                mr={2} color='gray.200' 
                as={FaRedditSquare}
                />
                <Flex direction='column'
                display={{base:'none', lg:'flex'}}
                fontSize='8pt'
                align='flex-start'>
                    <Text fontWeight='700'>{user?.displayName || user?.email!.split('@')[0]}</Text>
                    <Flex>
                      <Icon as={IoSparkles} mr={1} color='orange.900' />
                      <Text  color='gray.500'>1 karma</Text>

                    </Flex>
                </Flex>
                </>)
          : (
            <Icon fontSize={24} mr={2} color='gray.400' as={VscAccount}/>
          )} 
          </Flex>
                <ChevronDownIcon/>
            </Flex>
        </MenuButton>
        <MenuList>
            {user ? 

            (
            <>
            <MenuItem 
            fontSize='10pt'
            fontWeight='700'
            _hover={{bg:'blue.400', color:'white'}}>
                <Flex align='center' fontSize={14}>
              <Icon as={CgProfile} mr={2}
               fontSize={24}/> Profile
              </Flex>
              </MenuItem>
              <MenuDivider />
              <MenuItem 
            fontSize='10pt'
            fontWeight='700'
            _hover={{bg:'blue.400', color:'white'}}
            onClick={logout}>
              <Flex align='center' fontSize={14}>
              <Icon as={MdOutlineLogout} mr={2}
               fontSize={24}/> Logout
              </Flex>
              </MenuItem>
              </>) : (<MenuItem 
            fontSize='10pt'
            fontWeight='700'
            _hover={{bg:'blue.400', color:'white'}}
            onClick={()=> setAuthModalState({open: true, view: 'login'})}>
              <Flex align='center' fontSize={14}>
              <Icon as={MdOutlineLogout} mr={2}
               fontSize={24}/>Log In / Sign up
              </Flex>
              </MenuItem>)}
            
        </MenuList>
      </Menu>  
    )
}
export default UserMenu;