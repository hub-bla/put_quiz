import { createContext, useContext, useEffect, useState } from "react"
import { stringToUint8 } from "../functions"
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket"
import { SERVER_URL } from "../constants"
import { NavigateFunction } from "react-router"

interface ISocketContext {
	preprocessMessage: <MessageObj extends object>(
		type: string,
		message: MessageObj
	) => Uint8Array
	sendMessage: SendMessage
	readyState: ReadyState
	lastMessage: MessageEvent | null
	newMessage: {
		type: string
		data: Record<string, any>
	}
	checkSocket: (navigate: NavigateFunction) => void
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

const HEADER_SIZE = 100
export const useSockContextValues = () => {
	const [readBuffer, setReadBuffer] = useState("")
	const [newMessage, setNewMessage] = useState({
		type: "",
		data: {},
	})
	const [currentlyReadMess, setCurrentlyReadMess] = useState({
		messageHeader: "",
		readHeader: HEADER_SIZE,
		messageType: "",
		messageSize: 0,
		message: "",
	})

	const { sendMessage, lastMessage, readyState } = useWebSocket(SERVER_URL)

	const preprocessMessage = <MessageObj extends object>(
		type: string,
		message: MessageObj
	) => {
		const jsonStr = JSON.stringify(message)
		console.log(jsonStr)
		const headerStr = `${type}\n${jsonStr.length}\n`

		const headerUint8 = stringToUint8(headerStr, 100)

		const messageUint8 = stringToUint8(jsonStr, jsonStr.length)
		const combined = new Uint8Array(headerUint8.length + messageUint8.length)
		combined.set(headerUint8, 0)
		combined.set(messageUint8, headerUint8.length)

		return combined
	}

	useEffect(() => {
		if (lastMessage !== null) {
			lastMessage.data.text().then((text: string) => {
				console.log("lastMEssage", text)
				setReadBuffer((prevReadBuffer) => prevReadBuffer + text)
			})
		}
	}, [lastMessage])

	useEffect(() => {
		console.log("READ BUFFER", readBuffer)
		if (readBuffer.length != 0) {
			let { readHeader, messageHeader, messageSize, message, messageType } =
				currentlyReadMess
			const bytesToRead =
				readHeader > 0
					? readHeader - messageHeader.length
					: messageSize - message.length

			const bytesAvailableToRead = Math.min(bytesToRead, readBuffer.length)
			const readStr = readBuffer.slice(0, bytesAvailableToRead)

			// remember to remove thign that were read

			if (readHeader > 0) {
				messageHeader += readStr
				readHeader -= bytesAvailableToRead
			}

			if (readHeader == 0) {
				if (messageSize == 0) {
					const [type, size] = messageHeader.split("\n")

					messageSize = Number(size)
					messageType = type
				} else {
					message += readStr
				}
			}

			if (messageSize != 0 && messageSize == message.length) {
				const parsedData = JSON.parse(message)
				console.log("readmessage", message, messageSize, message.length)
				setNewMessage({
					type: messageType,
					data: parsedData,
				})

				setCurrentlyReadMess({
					messageHeader: "",
					readHeader: HEADER_SIZE,
					messageType: "",
					messageSize: 0,
					message: "",
				})
				setReadBuffer((prevReadBuffer) =>
					prevReadBuffer.slice(bytesAvailableToRead, prevReadBuffer.length)
				)
				console.log("cleaned")
				return
			}

			console.log({
				messageHeader,
				readHeader,
				messageType,
				messageSize,
				message,
			})
			// console.log("message", messageHeader)
			console.log("readbuffer", readBuffer)

			setCurrentlyReadMess({
				messageHeader,
				readHeader,
				messageType,
				messageSize,
				message,
			})

			setReadBuffer((prevReadBuffer) =>
				prevReadBuffer.slice(bytesAvailableToRead, prevReadBuffer.length)
			)
		}
	}, [readBuffer, currentlyReadMess])

	const checkSocket = (navigate: NavigateFunction) => {
		if (ReadyState.OPEN !== readyState) {
			navigate("/")
		}
	}

	return {
		preprocessMessage,
		sendMessage,
		readyState,
		lastMessage,
		newMessage,
		checkSocket,
	}
}
