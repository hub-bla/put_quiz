import { CreateQuiz, HomePage, JoinQuiz, PlayPage } from "@/pages"
import { HostDashboardPage } from "@/pages/hostDashboardPage"
import { LobbyPage } from "@/pages/LobbyPage"
import {
	CREATE_QUIZ_ROUTE,
	HOST_DASHBOARD_ROUTE,
	HOST_LOBBY_ROUTE,
	JOIN_QUIZ_ROUTE,
	PLAY_ROUTE,
} from "@/utils"
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
	{
		path: PLAY_ROUTE,
		element: <PlayPage />,
	},
	{
		path: HOST_DASHBOARD_ROUTE,
		element: <HostDashboardPage />,
	},
]
