import { HomePage } from "@pages/home"
import { RouteObject } from "react-router-dom"

export const rootRoutes: RouteObject[] = [
	{
		path: "/",
		element: <HomePage />,
	},
]
