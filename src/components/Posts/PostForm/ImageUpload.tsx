import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectFile?: string;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>)=> void;
    setSelectedTab:(value: string) => void;
    setSelectFile?: (value: string) => void;
    
};

const ImageUpload:React.FC<ImageUploadProps> = (
{onSelectImage,
selectFile,
setSelectFile,
setSelectedTab}
) => {
    
    const selectDocRef = useRef<HTMLInputElement>(null)
    return (
       <Flex direction='column' justify='center' align='center' width='100%'>
       {selectFile ? ( 
       <>
      <Image src={selectFile} alt='select your image'
      maxHeight='480px' maxWidth='480px'/>
      <Stack direction='row' mt={4}>
        <Button height='28px' 
        onClick={()=>setSelectedTab('Post')}>Back to post</Button>
        <Button variant='outline' height='28px' onClick={()=>setSelectFile('')}>Remove</Button>
      </Stack>
       </>) :
      ( <Flex justify='center' align='center' 
        padding={20}
        border='1px dashed'
        borderColor='blue.200'
        width='100%'
        borderRadius={4}>
            <Button variant='outline' height='28px'
            onClick={()=>selectDocRef.current?.click()}>Upload</Button>
            <input ref={selectDocRef} hidden
            type='file'
            onChange={onSelectImage} />
            <img src={selectFile} />
        </Flex>)}
       </Flex> 
    )
}
export default ImageUpload;