import { ReactNode } from "react";
import Header from "./Header";
import Container from "@mui/material/Container";

interface LayoutProps {
  children: ReactNode;
  user: any;
}

const Layout = ({ children, user }: LayoutProps) => {
  return (
    <>
      <Header user={user} />
      <Container maxWidth="md">{children}</Container>
    </>
  );
};

export default Layout;
