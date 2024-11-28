import { useSocketContext } from "@/utils"
import "./LobbyPage.css"
import { useEffect, useState } from "react"
const playersData = ["nick1", "nick2", "nick3"]

export const LobbyPage: React.FC = () => {
	const [gameCode, setGameCode] = useState("")

	const { lastMessage } = useSocketContext()

	const players = playersData.map((player) => {
		return (
			<div className='player' key={player}>
				{player}
			</div>
		)
	})

	useEffect(() => {
		if (lastMessage !== null) {
			lastMessage.data.text().then((text: string) => {
				const message = JSON.parse(text)
				if (message?.gameCode) {
					setGameCode(message.gameCode)
				}
			})

			// console.log(message)
			// setGameCode(message?.gameCode)
		}
	}, [lastMessage])

	return (
		<div>
			<div>
				<h1>GAME CODE: {gameCode}</h1>
				<button>Start game</button>
			</div>
			<div className='players'>{players}</div>
		</div>
	)
}
