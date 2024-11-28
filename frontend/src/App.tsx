import "./App.css"
import { useState, useCallback, useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import StandingTable from "./components/StandingTable/StandingTable"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { rootRoutes } from "./routes"
import { SERVER_URL } from "./utils"
import {
	SocketContext,
	useSockContextValues,
} from "./utils/contexts/SocketContext"

const router = createBrowserRouter(rootRoutes, { basename: "/" })

function App() {
	//Public API that will echo messages sent to it back to the client
	// const [socketUrl, setSocketUrl] = useState(SERVER_URL)
	// const [messageHistory, setMessageHistory] = useState([])
	const socketValues = useSockContextValues()
	// const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)

	// // useEffect(() => {
	// // 	if (lastMessage !== null) {
	// // 		setMessageHistory((prev) => prev.concat(lastMessage))
	// // 	}
	// // }, [lastMessage])

	// const handleClickChangeSocketUrl = useCallback(
	// 	() => setSocketUrl(SERVER_URL),
	// 	[]
	// )

	// const stringToUint8 = (data, size) => {
	// 	const textEncoder = new TextEncoder()
	// 	const encodedData = textEncoder.encode(data)
	// 	const paddedArray = new Uint8Array(size)
	// 	paddedArray.set(encodedData, 0)
	// 	return paddedArray
	// }

	// const handleClickSendMessage = useCallback(() => {
	// 	const jsonStr = `{"bajojajo": 4}`
	// 	const headerStr = `dziala\n\n${jsonStr.length}\n\n`

	// 	const header = stringToUint8(headerStr, 100)

	// 	const message = stringToUint8(jsonStr, jsonStr.length)
	// 	const combined = new Uint8Array(header.length + message.length)
	// 	combined.set(header, 0)
	// 	combined.set(message, header.length)
	// 	sendMessage(combined)
	// }, [])

	// const connectionStatus = {
	// 	[ReadyState.CONNECTING]: "Connecting",
	// 	[ReadyState.OPEN]: "Open",
	// 	[ReadyState.CLOSING]: "Closing",
	// 	[ReadyState.CLOSED]: "Closed",
	// 	[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	// }[readyState]

	// lastMessage?.data.text().then((text) => console.log(text))

	return (
		<>
			{/* <div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
				}}>
				<div>
					<button onClick={handleClickChangeSocketUrl}>
						Click Me to change Socket Url
					</button>
					<button
						onClick={handleClickSendMessage}
						disabled={readyState !== ReadyState.OPEN}>
						Click Me to send 'Hello'
					</button>
					{/* <span>The WebSocket is currently {connectionStatus}</span> */}
			{/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}
			{/* <ul>
						{messageHistory.map((message, idx) => (
							<span key={idx}>{message ? message.data : null}</span>
						))}
					</ul> */}
			{/* </div> */}
			{/* // </div> */}
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
