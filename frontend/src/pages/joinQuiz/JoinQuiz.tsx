import { useEffect, useState } from "react"
import "./joinQuiz.css"
import { PLAY_ROUTE, useSocketContext, useUserContext } from "@/utils"
import { useNavigate } from "react-router-dom"

export const JoinQuiz: React.FC = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const [validateData, setValidateData] = useState(false)
	const [formData, setFromData] = useState({
		gameCode: "",
		username: "",
	})
	const { preprocessMessage, sendMessage, newMessage } = useSocketContext()
	const [prevMessageType, setPrevMessageType] = useState("")
	const navigate = useNavigate()
	const { userType, setUsernameIfPlayer } = useUserContext()

	if (userType !== "player") {
		navigate("/")
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		setFromData((prevFormData) => ({
			...prevFormData,
			[id]: id === "gameCode" ? value.toUpperCase() : value,
		}))
	}

	const handleSubmit = () => {
		if (formData) {
			const message = preprocessMessage("join_game", formData)
			sendMessage(message)
			console.log(validateData)
			setValidateData(true)
		}
	}

	useEffect(() => {
		if (validateData && newMessage.type !== prevMessageType) {
			const { type } = newMessage
			console.log("VALIDATE DATA: ", type)
			if (type === "ok") {
				setUsernameIfPlayer(formData.username)
				navigate("/" + PLAY_ROUTE)
			} else if (type === "error") {
				const { data } = newMessage
				setErrorMessage(data["text"])
				setValidateData(false)
				setPrevMessageType(type)
			}
		}
	}, [validateData, newMessage])

	return (
		<div className='join-form'>
			{errorMessage !== "" && <div> ERROR: {errorMessage} </div>}
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
