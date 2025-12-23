'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    await signIn('google', {
      callbackUrl: '/profile?login=success',
    });
  };

  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border py-2.5 rounded font-medium hover:bg-gray-200 transition"
      >
        <Image
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          width={20}
          height={20}
        />
        Continue with Google
      </button>
    </>
  );
};

export default GoogleLogin;
