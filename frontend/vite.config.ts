import { defineConfig } from "vite"
import * as path from "path"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: "@components",
				replacement: path.resolve(__dirname, "./src/components/"),
			},
			{ find: "@utils", replacement: path.resolve(__dirname, "./src/utils/") },
			{
				find: "@assets",
				replacement: path.resolve(__dirname, "./src/assets/"),
			},
			{ find: "@pages", replacement: path.resolve(__dirname, "./src/pages/") },
			{ find: "@", replacement: path.resolve(__dirname, "./src/") },
		],
	},
})
