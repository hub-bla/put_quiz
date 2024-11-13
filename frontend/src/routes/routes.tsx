import { CreateQuiz, JoinQuiz } from "@/pages"
import { CREATE_QUIZ_ROUTE, JOIN_QUIZ_ROUTE } from "@/utils"
import { HomePage } from "@pages/home"
import { RouteObject } from "react-router-dom"

export const rootRoutes: RouteObject[] = [
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: JOIN_QUIZ_ROUTE,
		element: <JoinQuiz />,
	},
	{
		path: CREATE_QUIZ_ROUTE,
		element: <CreateQuiz />,
	},
]
