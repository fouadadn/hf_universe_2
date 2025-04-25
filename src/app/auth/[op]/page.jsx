import React from "react";
import Login from "@/app/components/auth/login";
import SignUp from "@/app/components/auth/signUp";


const Auth = async ({ params }) => {

  const { op } = await params;
 

  return <div>
    {
      op === 'login' && <Login />
    }
    {
      op === "sign-up" && <SignUp />
    }
  </div>;
};

export default Auth;


export async function generateMetadata({ params }) {
  const { op } = await params;
  return {
    title: `HF Stream | ${op === "login" ? "Login" : "Sign Up"}`,
  };
}