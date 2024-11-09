import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <main className="flex justify-center items-center h-screen">
      {children}
    </main>
  );
};

export default layout;
