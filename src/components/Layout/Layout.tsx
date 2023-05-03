import React from 'react';
import Navbar  from '../Navbar/Navbar';

interface LayoutProps extends React.PropsWithChildren<{}> {}

const Layout:React.FC<LayoutProps> = ({children}) => {
    
    return (
        <>
         <Navbar /> 
        <main>{children}</main>
        </>
    );
};
export default Layout;