import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { rootRoutes } from "./routes"
import { SocketContext, UserContext, useSockContextValues, useUserContextValues } from "./utils"

const router = createBrowserRouter(rootRoutes, { basename: "/" })

function App() {
	const socketValues = useSockContextValues()
	const userValues = useUserContextValues()

	return (
		<>
			<UserContext.Provider value={userValues}>
				<SocketContext.Provider value={socketValues}>
					<RouterProvider
						router={router}
						fallbackElement={<div>Loading...</div>}
					/>
				</SocketContext.Provider>
			</UserContext.Provider>
		</>
	)
}

export default App
