
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuList, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { TiHome } from 'react-icons/ti';
import Communities from './Communities';
import useDirectory from '@/src/hooks/useDirectory';




const UserMenu: React.FC = () => {
  const {directoryState, toggleOpenMenu} = useDirectory();
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{
          outline: "1px solid",
          outlineColor: "gray.200",
        }}
        mr={2}
        ml={{base:'none', md: 2}}
        onClick={toggleOpenMenu}
      >
        <Flex align="center" width={{base:'auto', lg:'200px'}} justify='space-between'>
          <Flex align="center" >
            {directoryState.selectedMenuItem.imageURL ?
           ( <Image 
            mr={2}
            alt='community image'
            boxSize='24px'
             borderRadius='full' 
            src={directoryState.selectedMenuItem.imageURL}/>)
             :(
              <Icon 
              mr={2}
              boxSize='24px'
             borderRadius='full' 
              as={directoryState.selectedMenuItem.icon}
              color={directoryState.selectedMenuItem.iconColor} />
            )}
            
            <Flex display={{base: 'none', lg: 'flex'}}>
              <Text fontSize='10pt' fontWeight={600}>
                {directoryState.selectedMenuItem.displayText}</Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default UserMenu;