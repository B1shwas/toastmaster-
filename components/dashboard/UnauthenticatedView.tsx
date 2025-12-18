import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UnauthenticatedView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Please Sign In</h1>
        <p className="text-slate-400 mb-6">
          You need to be logged in to access the dashboard
        </p>
        <Link href="/auth">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Go to Sign In
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
