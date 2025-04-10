import React from "react";
import Login from "@/app/components/auth/login";
import SignUp from "@/app/components/auth/signUp";

const Auth = async ({ params }) => {
  const { op } = await params;

  console.log(op);
  return <div>
    {
      op === 'login' && <Login/>
    }
    {
      op === "sign-up" && <SignUp />
    }
  </div>;
};

export default Auth;
