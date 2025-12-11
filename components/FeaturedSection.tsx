"use client";
import { motion } from "framer-motion";
import { CalendarDays, Users, Trophy, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  Icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    Icon: CalendarDays,
    title: "Meeting Management",
    desc: "Schedule and organize meetings effortlessly",
    color: "from-blue-500 to-cyan-400",
  },
  {
    Icon: Users,
    title: "Member Tracking",
    desc: "Track attendance and member progress",
    color: "from-cyan-500 to-teal-400",
  },
  {
    Icon: Trophy,
    title: "Role Assignment",
    desc: "Automate role assignments and reminders",
    color: "from-teal-500 to-emerald-400",
  },
  {
    Icon: TrendingUp,
    title: "Progress Reports",
    desc: "View member achievements and growth",
    color: "from-indigo-500 to-blue-400",
  },
];

const ANIMATION_VARIANTS = {
  card: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const { Icon, title, desc, color } = feature;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      variants={ANIMATION_VARIANTS.card}
      whileHover={{ y: -10, scale: 1.05 }}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-16 h-16 rounded-xl bg-linear-to-br ${color} flex items-center justify-center mb-4`}
        aria-hidden="true"
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300">{desc}</p>
    </motion.article>
  );
}

function FeaturedSection() {
  return (
    <section id="features" className="py-20 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-300">
            Powerful features designed specifically for Toastmasters clubs
          </p>
        </motion.header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedSection;
