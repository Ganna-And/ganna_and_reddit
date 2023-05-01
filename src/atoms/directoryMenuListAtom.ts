import { IconType } from "react-icons/lib";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";


export type DirectoryMenuItem = {
    icon: IconType;
    imageURL?: string;
    displayText: string;
    link: string;
    iconColor: string;
}

 interface DirectoryMenuState {
isOpen: boolean;
selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuItem = {
    icon: TiHome,
    iconColor: 'black',
    displayText: 'Home',
    link:'/'
}

export const defaultMenuState: DirectoryMenuState ={
isOpen: false,
selectedMenuItem: defaultMenuItem,
} 

export const directoryMenuState = atom<DirectoryMenuState>({
    key:'directoryMenuState',
    default: defaultMenuState,
})