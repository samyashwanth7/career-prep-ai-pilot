
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
					DEFAULT: "#23395d", // Professional navy
					foreground: "#fff",
					light: "#38598b"
				},
				secondary: {
					DEFAULT: "#eaeaea", // off-white for cards
					foreground: "#23395d"
				},
				background: {
					DEFAULT: "#f5f7fa", // light gray-blue
					dark: "#151f2c",    // rich slate for dark
				},
				sidebar: {
					DEFAULT: "#23395d", // Navy for sidebar
					foreground: "#fff",
					border: "#334e73",
				},
				accent: {
					DEFAULT: "#70a1d7", // Soft blue accent
					foreground: "#fff"
				},
				muted: { DEFAULT: "#697289", foreground: "#fff" }
			},
			transitionProperty: {
				'colors-bg': 'background-color, color, border-color, fill, stroke',
				'opacity': 'opacity',
			},
			transitionDuration: {
				DEFAULT: '300ms'
			},
			transitionTimingFunction: {
				DEFAULT: 'ease-in-out'
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
			},
			keyframes: {
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(12px)' },
					to:   { opacity: '1', transform: 'translateY(0)' }
				}
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
