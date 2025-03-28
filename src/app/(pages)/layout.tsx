import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>
    <h2>A navbar</h2>
    <p>p tag</p>
    {children}</div>;
};

export default layout;
