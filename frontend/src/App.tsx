import "./App.css"
import { useState, useCallback, useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import StandingTable from "./components/StandingTable/StandingTable"

function App() {
	//Public API that will echo messages sent to it back to the client
	const [socketUrl, setSocketUrl] = useState("ws://localhost:8080")
	const [messageHistory, setMessageHistory] = useState([])

	const { sendMessage, lastMessage, readyState, sendJsonMessage } =
		useWebSocket(socketUrl)

	useEffect(() => {
		if (lastMessage !== null) {
			setMessageHistory((prev) => prev.concat(lastMessage))
		}
	}, [lastMessage])

	const handleClickChangeSocketUrl = useCallback(
		() => setSocketUrl("ws://localhost:8080"),
		[]
	)

	const stringToUint8 = (data, size) => {
		const textEncoder = new TextEncoder()
		const encodedData = textEncoder.encode(data)
		const paddedArray = new Uint8Array(size)
		paddedArray.set(encodedData, 0)
		return paddedArray
	}

	const handleClickSendMessage = useCallback(() => {
		console.log("sending")
		sendMessage(stringToUint8("dziala", 20))
	}, [])

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	}[readyState]

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
			}}>
			<StandingTable />
			<div>
				<button onClick={handleClickChangeSocketUrl}>
					Click Me to change Socket Url
				</button>
				<button
					onClick={handleClickSendMessage}
					disabled={readyState !== ReadyState.OPEN}>
					Click Me to send 'Hello'
				</button>
				<span>The WebSocket is currently {connectionStatus}</span>
				{lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
				<ul>
					{messageHistory.map((message, idx) => (
						<span key={idx}>{message ? message.data : null}</span>
					))}
				</ul>
			</div>
		</div>
	)
}

export default App
