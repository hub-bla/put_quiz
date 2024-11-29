import { useSocketContext } from "@/utils"
import "./LobbyPage.css"
import { useEffect, useState } from "react"

export const LobbyPage: React.FC = () => {
	const [gameCode, setGameCode] = useState("")
	const [playersData, setPlayersdata] = useState<string[]>([])

	const { newMessage } = useSocketContext()

	const players = playersData.map((player) => {
		return (
			<div className='player' key={player}>
				{player}
			</div>
		)
	})

	useEffect(() => {
		const {type, data} = newMessage
		
		if (type.length != 0) {
			if (type === "game_code") {
				setGameCode(data["gameCode"])
			} else if (type == "new_player") {
				setPlayersdata(prevPlayersData => [...prevPlayersData, data['username']])
			}
		}
			console.log("fromLobby",newMessage)
	}, [newMessage])

	return (
		<div>
			<div>
				<h1>GAME CODE: {gameCode}</h1>
				<button>Start game</button>
			</div>
			{playersData.length == 0 && <div>Waiting for players to join ...</div>}
			<div className='players'>{players}</div>
		</div>
	)
}
