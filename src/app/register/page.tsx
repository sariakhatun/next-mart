'use client';

import { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2'; // import sweetalert2
import { registerUser } from '../actions/auth/registerUser';
import GoogleLogin from '@/src/components/GoogleLogin';

const Register = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(''); // photo URL state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const response = await registerUser({ name, email, password, photo });

//     if (response.success) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Registered!',
//         text: 'Your account has been created successfully.',
//         confirmButtonColor: '#06b6d4', // cyan
//       }).then(() => {
//         // Redirect to login after user clicks OK
//         window.location.href = '/';
//       });
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: response.message || 'Something went wrong!',
//         confirmButtonColor: '#06b6d4',
//       });
//     }
//   };

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>

      <form  className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Your Name'
            className="w-full border px-3 py-2 rounded focus:outline-cyan-500"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            type="text"
            value={photo}
            onChange={e => setPhoto(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full border px-3 py-2 rounded focus:outline-cyan-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            placeholder='example@gmail.com'
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
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-600 font-medium hover:underline">
            Login
          </Link>
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-2.5 rounded font-semibold hover:bg-cyan-700 transition"
        >
          Register
        </button>
        <GoogleLogin></GoogleLogin>
      </form>
    </div>
  );
};

export default Register;
