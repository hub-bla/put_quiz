import { HOST_DASHBOARD_ROUTE, useSocketContext } from "@/utils"
import "./LobbyPage.css"
import { useEffect, useState } from "react"
import { useBlocker, useNavigate } from "react-router-dom"

export const LobbyPage: React.FC = () => {
	const [gameCode, setGameCode] = useState("")
	const [playersData, setPlayersdata] = useState<string[]>([])
	const navigate = useNavigate()
	// let blocker = useBlocker(() => gameCode !== "")

	const {
		newMessage,
		checkSocket,
		readyState,
		sendMessage,
		preprocessMessage,
	} = useSocketContext()

	const players = playersData.map((player) => {
		return (
			<div className='player' key={player}>
				{player}
			</div>
		)
	})

	const startGame = () => {
		window.removeEventListener("beforeunload", handleBeforeUnload)
		const message = preprocessMessage("next_question", {})
		sendMessage(message)
		navigate("/" + HOST_DASHBOARD_ROUTE)
	}

	const handleBeforeUnload = (event: BeforeUnloadEvent) => {
		if (gameCode !== "") {
			event.preventDefault()
			event.returnValue = "" // This triggers the browser's confirmation dialog.
			window.location.href = "/"
		}
	}

	useEffect(() => {
		const { type, data } = newMessage

		if (type.length != 0) {
			if (type === "game_code") {
				setGameCode(data["gameCode"])
			} else if (type == "new_player") {
				setPlayersdata((prevPlayersData) => [
					...prevPlayersData,
					data["username"],
				])
			}
		}
		console.log("fromLobby", newMessage)
	}, [newMessage])

	// useEffect(() => {
	// 	window.addEventListener("beforeunload", handleBeforeUnload)

	// 	return () => {
	// 		window.removeEventListener("beforeunload", handleBeforeUnload)
	// 	}
	// }, [gameCode])

	useEffect(() => {
		checkSocket(navigate)
	}, [readyState])

	// useEffect(() => {
	// 	if (blocker.state === "blocked") {
	// 		const beforeUnloadEvent = new Event("beforeunload")
	// 		window.dispatchEvent(beforeUnloadEvent)
	// 	}
	// }, [blocker.state])

	return (
		<div>
			<div>
				<h1>GAME CODE: {gameCode}</h1>
				<button onClick={() => startGame()}>Start game</button>
			</div>
			{playersData.length == 0 && <div>Waiting for players to join ...</div>}
			<div className='players'>{players}</div>
		</div>
	)
}
