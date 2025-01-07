import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout =  async ({ children }: Props) => {
  const auth = await onAuthenticateUser();
  if (
    auth.status === 400 ||
    auth.status === 500 ||
    auth.status === 404 ||
    auth.status === 403
  )
    return redirect("/auth/sign-in");
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
