import useDirectory from '@/src/hooks/useDirectory';
import { Flex, Icon, Image, MenuItem, Text } from '@chakra-ui/react';

import React from 'react';
import { IconType } from 'react-icons/lib';

type MenuListItemProps = {
    icon:IconType;
    iconColor: string;
    displayText: string;
    imageURL?: string;
    link: string;
};

const MenuListItem:React.FC<MenuListItemProps> = ({icon, iconColor,imageURL,displayText,link}) => {
    const {onSelectedMenuItem} =useDirectory()
    return (
        <MenuItem
        width='100%'
        fontSize='10pt'
        _hover={{bg:'gray.100'}}
        onClick={()=>onSelectedMenuItem({icon, iconColor, displayText, imageURL, link })}>
            <Flex align='center'>
                {imageURL ? (<Image 
                alt='community image' 
                src={imageURL}
                borderRadius='full'
                boxSize='18px'
                mr={2} />):
                (<Icon as ={icon}
                 color={iconColor}
                 fontSize={20}
                 mr={2}
                 />)}
                 {displayText}
            </Flex>
        </MenuItem>
    )
}
export default MenuListItem;