/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3B82F6",
          blueDark: "#1E3A8A",
          cyan: "#22D3EE",
          cyanDark: "#067CB3",
        },
        surface: {
          base: "#0F172A",
          baseLight: "#1E293B",
          card: "rgba(255,255,255,0.05)",
          cardHover: "rgba(255,255,255,0.10)",
        },
        gradient: {
          blueCyanStart: "#3B82F6",
          blueCyanEnd: "#22D3EE",
          cyanTealStart: "#22D3EE",
          cyanTealEnd: "#14B8A6",
          tealEmeraldStart: "#14B8A6",
          tealEmeraldEnd: "#10B981",
          indigoBlueStart: "#6366F1",
          indigoBlueEnd: "#3B82F6",
        },
        semantic: {
          success: "#10B981",
          warning: "#FACC15",
          danger: "#EF4444",
        },
      },
      boxShadow: {
        glowBlue: "0 0 40px rgba(59,130,246,0.5)",
        glowCyan: "0 0 40px rgba(34,211,238,0.5)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
      },
    },
  },
  plugins: [],
};
