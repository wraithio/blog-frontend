import { NavbarComponent } from "@/components/NavbarComponent";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>
    <NavbarComponent/>
    {children}</div>;
};

export default layout;
