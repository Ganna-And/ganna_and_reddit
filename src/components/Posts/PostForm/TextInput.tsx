import { Button, Flex, Input, Stack, Textarea, border } from "@chakra-ui/react";
import React from "react";

type TextInputProps = {
  textInput: {
    title: string;
    body: string;
  }  

  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    )=> void;
    handleCreatePost: ()=> void;
    loading:boolean;
};


const TextInput: React.FC<TextInputProps> = ({
    textInput,
    onChange,
    handleCreatePost,
    loading
}) => {
  return (
    <Stack spacing={3} width="100%">
      <Input 
      name="title"
      value={textInput.title}
      onChange={onChange}
      fontSize='10pt'
      borderRadius={4}
      placeholder="text title"
      _placeholder={{color: 'gray.500'}}
      _focus={{outline:'none ', bg:'gray.200'}}
      _hover={{borderColor: 'blue.500'}}
      border='1px solid'
      borderColor='black'/>
      <Textarea
      name="body"
      _hover={{borderColor: 'blue.500'}}
      height={100}
       value={textInput.body}
      onChange={onChange}
      fontSize='10pt'
      borderRadius={4}
      placeholder="text optional"
      _placeholder={{color: 'gray.500'}}
      _focus={{outline:'none ', bg:'gray.200'}}
      border='1px solid'
      borderColor='black'></Textarea>
      <Flex justify='flex-end' >
        <Button height='34px' padding='0px 30px'
         disabled={!textInput.title}
         isLoading={loading}
        onClick={handleCreatePost}>Post</Button>
      </Flex>
    </Stack>
  );
};
export default TextInput;
