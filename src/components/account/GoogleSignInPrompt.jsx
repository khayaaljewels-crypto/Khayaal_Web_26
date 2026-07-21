import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function GoogleSignInPrompt({ title = 'Sign in to continue', description }) {
  const { signInWithGoogle } = useCustomerAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-beige">
        <HiOutlineUserCircle className="text-3xl text-gold" />
      </span>
      <h2 className="mt-6 font-heading text-2xl text-brown">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-text/60">{description}</p>}

      <button
        onClick={signInWithGoogle}
        className="mt-6 flex items-center gap-3 rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-brown shadow-sm transition-colors hover:border-gold"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>
    </motion.div>
  );
}
