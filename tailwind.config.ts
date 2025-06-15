
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		fontFamily: {
			sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			playfair: ['Playfair Display', 'serif'],
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: "#2d3748", // slate-grey
					foreground: "#fff",
					light: "#4a5568"
				},
				secondary: {
					DEFAULT: "#e2e8f0", // light grey
					foreground: "#2d3748"
				},
				background: {
					DEFAULT: "#f6f8fa",
					dark: "#1a202c",
				},
				sidebar: {
					DEFAULT: '#22223b', 
					foreground: '#f6f8fa',
					border: '#393a54',
				},
				accent: {
					DEFAULT: "#b3c0e5"
				},
				muted: { DEFAULT: "#718096", foreground: "#fff" }
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
