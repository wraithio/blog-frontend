import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>
    <h2>A navbar</h2>
    {children}</div>;
};

export default layout;
