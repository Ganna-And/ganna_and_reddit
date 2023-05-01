import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { BsArrowRightCircle, BsChatDots } from "react-icons/bs";
import { GrAd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";

const Icons: React.FC = () => {
  return (
    <>
      <Flex
        display={{ base: "none", md: "flex" }}
        align="center"
        border="1px solid"
        borderColor="gray.500"
      >
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={6}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={BsArrowRightCircle} />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={6}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={ IoVideocamOutline} />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={6}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={GrAd} />
        </Flex>
        
      </Flex>
      <>
      <Flex
      display={{base: 'none', md:''}}
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={6}
          _hover={{ bg: "gray.200" }}
          fontSize={20}
        >
          <Icon as={IoFilterCircleOutline} />
        </Flex>
      <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={6}
          _hover={{ bg: "gray.200" }}
          fontSize={20}
        >
          <Icon as={IoNotificationsOutline} />
        </Flex>
      <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={6}
          _hover={{ bg: "gray.200" }}
          fontSize={20}
        >
          <Icon as={BsChatDots} />
        </Flex></>
    </>
  );
};
export default Icons;
