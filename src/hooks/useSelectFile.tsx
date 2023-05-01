import React, { useState } from 'react';



const useSelectFile= () => {
    const [selectFile, setSelectFile] = useState<string>();
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
          reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
          if (readerEvent.target?.result) {
            setSelectFile(readerEvent.target.result as string);
          }
        };
      };
    
    return {
        selectFile, setSelectFile, onSelectFile
    }
}
export default useSelectFile;