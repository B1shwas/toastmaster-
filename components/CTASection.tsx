"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
};

function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={ANIMATION_VARIANTS.container}
          className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Club?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of Toastmasters clubs already saving hours every week
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-linear-to-br from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition inline-flex items-center justify-center gap-2"
            >
              Get Started - It's Free!
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition"
            >
              Sign In
            </motion.button>
          </div>

          <p className="text-slate-400 text-sm">
            No credit card required • No setup fees • Start in minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;
