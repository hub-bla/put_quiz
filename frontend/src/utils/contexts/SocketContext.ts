import { createContext, useContext, useState } from "react"
import { stringToUint8 } from "../functions"
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket"
import { SERVER_URL } from "../constants"

interface ISocketContext {
	preprocessMessage: <MessageObj extends object>(
		type: string,
		message: MessageObj
	) => Uint8Array
	sendMessage: SendMessage
	readyState: ReadyState
	lastMessage: MessageEvent<any> | null
}

export const SocketContext = createContext<ISocketContext | null>(null)

export const useSocketContext = () => {
	const context = useContext(SocketContext)

	if (!context) {
		throw new Error(
			"useSocketContext must be used within SocketContext.Provider"
		)
	}

	return context
}

export const useSockContextValues = () => {
	const [socketUrl, setSocketUrl] = useState(SERVER_URL)
	// const [messageHistory, setMessageHistory] = useState([])

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)

	const preprocessMessage = <MessageObj extends object>(
		type: string,
		message: MessageObj
	) => {
		const jsonStr = JSON.stringify(message)
		const headerStr = `${type}\n\n${jsonStr.length}\n\n`

		const headerUint8 = stringToUint8(headerStr, 100)

		const messageUint8 = stringToUint8(jsonStr, jsonStr.length)
		const combined = new Uint8Array(headerUint8.length + messageUint8.length)
		combined.set(headerUint8, 0)
		combined.set(messageUint8, headerUint8.length)

		return combined
	}

	return { preprocessMessage, sendMessage, readyState, lastMessage }
}
