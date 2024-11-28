import { CreateQuiz, HomePage, JoinQuiz } from "@/pages"
import { LobbyPage } from "@/pages/LobbyPage"
import { CREATE_QUIZ_ROUTE, HOST_LOBBY_ROUTE, JOIN_QUIZ_ROUTE } from "@/utils"
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
	{
		path: HOST_LOBBY_ROUTE,
		element: <LobbyPage />,
	},
]
