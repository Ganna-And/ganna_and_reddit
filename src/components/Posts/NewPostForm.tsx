import { Alert, AlertIcon, AlertTitle, Flex, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";
import TabItem from "./TabItem";
import TextInput from "./PostForm/TextInput";
import ImageUpload from "./PostForm/ImageUpload";
import { Post } from "@/src/atoms/postsAtom";
import { User } from "@firebase/auth";
import { useRouter } from "next/router";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/src/firebase/ClientApp";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import useSelectFile from "@/src/hooks/useSelectFile";

type NewPostForProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Image & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];
export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostForProps> = ({ user, communityImageURL }) => {
  const router = useRouter();
  const [error,setError] = useState(false);
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInput, setTextInput] = useState({
    title: "",
    body: "",
  });
  const {setSelectFile, selectFile, onSelectFile} = useSelectFile();


  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    
    //create new post type of Post
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInput.title,
      body: textInput.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
      communityImageURL: communityImageURL || '',
    };
    // store post in db
    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      //check for selectFile
      if (selectFile) {
        //store in storage => getDownload (return url to that img(Imgurl))
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        //update the post doc by adding imageurl
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      } router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(true)
    }
    setLoading(false);

    //redirect to community page  using router
    router.back();
  };
 
  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Flex direction="column" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInput
            textInput={textInput}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Image & Video" && (
          <ImageUpload
            onSelectImage={onSelectFile}
            selectFile={selectFile}
            setSelectFile={setSelectFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <>
        <Alert status='error'>
  <AlertIcon />
  <AlertTitle>You have an error in creating a post</AlertTitle>
</Alert>
</>
      )}
    </Flex>
  );
};
export default NewPostForm;
