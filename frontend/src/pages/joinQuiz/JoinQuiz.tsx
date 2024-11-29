import { useState } from "react"
import "./joinQuiz.css"
import { PLAY_ROUTE, useSocketContext } from "@/utils"
import { useNavigate } from "react-router-dom"

export const JoinQuiz: React.FC = () => {
	const [formData, setFromData] = useState({
		gameCode: "",
		username: "",
	})
	const { preprocessMessage, sendMessage } = useSocketContext()
	const navigate = useNavigate()


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		setFromData((prevFormData) => ({ 
			...prevFormData,
			[id]: id === "gameCode" ? value.toUpperCase() : value
		}))
	}

	const handleSubmit = () => {
		if (formData) {
			const message = preprocessMessage("join_game", formData)
			sendMessage(message)
			console.log("sent")
			navigate("/" + PLAY_ROUTE)
		}
	}

	return (
		<div className='join-form'>
			<input
				className='form-input'
				id='gameCode'
				type='text'
				placeholder='Enter game code'
				onChange={handleInputChange}
				value={formData.gameCode}
				required
			/>
			<input
				className='form-input'
				id='username'
				type='text'
				placeholder='Enter your username'
				onChange={handleInputChange}
				value={formData.username}
				required
			/>
			<button onClick={handleSubmit}>Play</button>
		</div>
	)
}
