import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { rootRoutes } from "./routes"
import { SocketContext, useSockContextValues } from "./utils"

const router = createBrowserRouter(rootRoutes, { basename: "/" })

function App() {
	const socketValues = useSockContextValues()

	return (
		<>
			<SocketContext.Provider value={socketValues}>
				<RouterProvider
					router={router}
					fallbackElement={<div>Loading...</div>}
				/>
			</SocketContext.Provider>
		</>
	)
}

export default App
