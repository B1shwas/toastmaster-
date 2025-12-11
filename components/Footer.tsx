"use client";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SocialLink {
  Icon: LucideIcon;
  href: string;
  label: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    Icon: Github,
    href: "https://github.com",
    label: "GitHub",
  },
  {
    Icon: Twitter,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    Icon: Linkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    Icon: Mail,
    href: "mailto:contact@toastmaster.com",
    label: "Email",
  },
];

const FOOTER_LINKS = [
  { text: "Features", href: "#features" },
  { text: "Benefits", href: "#benefits" },
  { text: "Privacy Policy", href: "#privacy" },
  { text: "Terms of Service", href: "#terms" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950/50 border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Toastmaster Club Manager
            </h3>
            <p className="text-slate-400 text-sm">
              The complete platform for managing your Toastmasters club
              effortlessly. Free forever.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <nav className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="block text-slate-400 hover:text-white transition text-sm"
                >
                  {link.text}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Connect With Us</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <social.Icon className="w-5 h-5 text-slate-400" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} Toastmaster Club Manager. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm">
            Built for the Toastmasters community
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
