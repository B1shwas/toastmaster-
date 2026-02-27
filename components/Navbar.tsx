"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useLogout } from "@/lib/api";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const MotionButton = motion.button;

const navVariants = {
  hidden: { y: -100 },
  visible: { y: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

function Navbar() {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const logout = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4 }}
      className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-white/10 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Toastmaster Manager
            </span>
          </motion.div>
        </Link>

        <div className="flex gap-3">
          {!mounted ? (
            // 🔑 MUST match server render
            <NavLink href="/auth">Sign In</NavLink>
          ) : isAuthenticated ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/profile">Profile</NavLink>
              <NavLink href="/clubs">Explore Clubs</NavLink>
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                disabled={logout.isPending}
                className="hidden sm:flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-6 py-2 rounded-lg text-white font-semibold"
              >
                <LogOut className="h-4 w-4" />
              </MotionButton>
            </>
          ) : (
            <NavLink href="/auth">Sign In</NavLink>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <MotionButton
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="hidden sm:block bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-lg text-white font-semibold hover:bg-white/20 transition cursor-pointer"
      >
        {children}
      </MotionButton>
    </Link>
  );
}

export default Navbar;
