"use client";
import { motion } from "framer-motion";
import { Clock, Smartphone, Bell, BarChart3, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Benefit {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const BENEFITS: Benefit[] = [
  {
    Icon: Clock,
    title: "Save Time",
    desc: "Reduce admin work by 80%",
  },
  {
    Icon: Smartphone,
    title: "Mobile Ready",
    desc: "Access anywhere, anytime",
  },
  {
    Icon: Bell,
    title: "Smart Reminders",
    desc: "Auto-notify members of their roles",
  },
  {
    Icon: BarChart3,
    title: "Analytics",
    desc: "Track club performance metrics",
  },
];

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  benefitCard: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  statsCard: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
};

interface BenefitCardProps {
  benefit: Benefit;
  index: number;
}

function BenefitCard({ benefit, index }: BenefitCardProps) {
  const { Icon, title, desc } = benefit;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      variants={ANIMATION_VARIANTS.benefitCard}
      className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
    >
      <div
        className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6 text-blue-400" strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-slate-400">{desc}</p>
      </div>
    </motion.article>
  );
}

function StatsCard() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={ANIMATION_VARIANTS.statsCard}
      className="relative"
    >
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-12 shadow-2xl">
        <div
          className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6"
          aria-hidden="true"
        >
          <TrendingUp className="w-10 h-10 text-blue-400" strokeWidth={2} />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">
          Save 10+ Hours Per Month
        </h3>
        <p className="text-slate-300 text-lg mb-6">
          Club officers report saving an average of 10 hours per month on
          administrative tasks.
        </p>
        <div className="bg-linear-to-br from-blue-500 to-cyan-400 rounded-xl p-6">
          <div className="text-5xl font-bold text-white mb-2">80%</div>
          <div className="text-blue-100">Less admin work</div>
        </div>
      </div>
    </motion.div>
  );
}

function BenefitSection() {
  return (
    <section id="benefits" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.container}
          >
            <h2 className="text-5xl font-bold te xt-white mb-6">
              Focus on What Matters
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Spend less time on admin work and more time helping members grow.
              Our platform automates the boring stuff so you can focus on
              leadership and development.
            </p>

            <div className="space-y-4" role="list">
              {BENEFITS.map((benefit, index) => (
                <BenefitCard
                  key={benefit.title}
                  benefit={benefit}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          <StatsCard />
        </div>
      </div>
    </section>
  );
}

export default BenefitSection;
