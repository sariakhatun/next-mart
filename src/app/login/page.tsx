'use client';

import GoogleLogin from '@/src/components/GoogleLogin';
import Link from 'next/link';
import { useState } from 'react';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log({ name, email, password });
//     alert('Form submitted!');
//   };

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Login Your Account</h1>

      <form  className="space-y-4">
       

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-cyan-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-cyan-500"
          />
        </div>
         {/* Already have account text */}
      <p className="text-sm text-center mb-4">
        Don't have an account?{' '}
        <Link href="/register" className="text-cyan-600 font-medium hover:underline">
          register
        </Link>
      </p>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-2.5 rounded font-semibold hover:bg-cyan-700 transition"
        >
          Login
        </button>
        {/* Google login */}
        <GoogleLogin></GoogleLogin>
      </form>
    </div>
  );
};

export default Login;
