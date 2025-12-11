"use client";
import { motion } from "framer-motion";

const STATS = [
  { value: "500+", label: "Active Clubs" },
  { value: "15K+", label: "Members" },
  { value: "4.9★", label: "Rating" },
];

const TABS = ["clubs", "members", "meetings"];

const WINDOW_DOTS = [
  { color: "bg-red-500" },
  { color: "bg-yellow-500" },
  { color: "bg-green-500" },
];

const DASHBOARD_CARDS = [
  {
    title: "Next Meeting",
    badge: {
      text: "Upcoming",
      className: "bg-emerald-500/20 text-emerald-400",
    },
    content: "Thursday, 7:00 PM",
  },
  {
    title: "Attendance Rate",
    value: "87%",
    progressBar: { width: "87%", gradient: "from-emerald-500 to-teal-500" },
  },
  {
    title: "Role Assignments",
    roles: [
      { role: "Toastmaster", assignee: "John D." },
      { role: "Table Topics", assignee: "Sarah M." },
      { role: "Timer", assignee: "Mike L." },
    ],
  },
];

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-blue-300 text-sm font-semibold">
                Trusted by 20+ Toastmasters Clubs
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Manage Your</span>
              <br />
              <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Toastmasters Club
              </span>
              <br />
              <span className="text-white">Effortlessly</span>
            </h1>

            <p className=" text-slate-300 mb-8 max-w-xl text-lg">
              The complete platform for Toastmasters club management. Schedule
              meetings, assign roles, track progress, and engage members - all
              in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-linear-to-br from-blue-500 to-cyan-400 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-2xl"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl text-white font-bold text-lg hover:bg-white/20 transition"
              >
                View Features
              </motion.button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 text-sm">
              {STATS.map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Window Dots */}
              <div className="flex gap-2 mb-6">
                {WINDOW_DOTS.map((dot, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${dot.color}`}
                  />
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {TABS.map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      index === 0
                        ? "bg-linear-to-br from-blue-500 to-cyan-400 text-white"
                        : "bg-white/10 text-slate-400 hover:bg-white/20"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Dashboard Cards */}
              <div className="space-y-3">
                {DASHBOARD_CARDS.map((card, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">
                        {card.title}
                      </span>
                      {card.badge && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${card.badge.className}`}
                        >
                          {card.badge.text}
                        </span>
                      )}
                      {card.value && (
                        <span className="text-emerald-400 font-bold">
                          {card.value}
                        </span>
                      )}
                    </div>

                    {card.content && (
                      <div className="text-slate-400 text-sm">
                        {card.content}
                      </div>
                    )}

                    {card.progressBar && (
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`bg-linear-to-r ${card.progressBar.gradient} h-2 rounded-full`}
                          style={{ width: card.progressBar.width }}
                        />
                      </div>
                    )}

                    {card.roles && (
                      <div className="space-y-2 text-sm">
                        {card.roles.map((roleItem, roleIndex) => (
                          <div
                            key={roleIndex}
                            className="flex justify-between text-slate-400"
                          >
                            <span>{roleItem.role}</span>
                            <span className="text-white">
                              {roleItem.assignee}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
