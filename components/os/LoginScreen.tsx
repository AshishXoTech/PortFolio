"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 120,
      damping: 18,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 16 },
  },
};

export default function LoginScreen({ onLogin }: LoginScreenProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    window.setTimeout(() => {
      onLogin();
    }, 800);
  }, [isLoading, onLogin]);

  return (
    <div className="login-dot-grid relative flex min-h-screen items-center justify-center bg-[#050510] p-4">

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[400px] rounded-lg border border-[rgba(255,255,255,0.06)] p-12 backdrop-blur-[20px]"
        style={{ backgroundColor: "rgba(8, 8, 20, 0.75)" }}
      >
        <motion.div
          variants={itemVariants}
          className="mx-auto flex w-[100px] justify-center"
        >
          <div className="login-avatar-ring rounded-full p-[2px]">
            <div className="overflow-hidden rounded-full bg-[#050510] p-[2px]">
              <Image
                src="/images/avatar.jpg"
                alt="Ashish Kumar Jha"
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-4 text-center font-display text-[22px] font-bold text-[#e8e8f0]"
        >
          Ashish Kumar Jha
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-1 text-center font-mono text-xs text-[#4a4a6a]"
        >
          Full Stack Developer
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="my-6 h-px w-full bg-[rgba(255,255,255,0.08)]"
          aria-hidden="true"
        />

        <motion.div variants={itemVariants}>
          <label
            htmlFor="login-password"
            className="mb-1 block font-mono text-[11px] text-[#4a4a6a]"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value="••••••••"
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#050510] px-[14px] py-[10px] font-mono text-sm text-[#e8e8f0] outline-none"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4">
          <motion.button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            whileHover={{ scale: 1.02, filter: "brightness(1.08)" }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00ff41] px-4 py-3 font-display text-sm font-bold text-[#050510] transition-[filter] disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login →"
            )}
          </motion.button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-center font-mono text-[10px] text-[#4a4a6a]"
        >
          AshishOS 1.0.0 • kernel 18.2
        </motion.p>
      </motion.div>
    </div>
  );
}
