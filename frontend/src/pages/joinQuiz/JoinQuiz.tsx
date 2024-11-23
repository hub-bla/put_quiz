import { useState } from "react"
import "./joinQuiz.css"

export const JoinQuiz: React.FC = () => {
	const [formData, setFromData] = useState({
		gameCode: "",
		username: "",
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		setFromData((prevFormData) => ({ 
			...prevFormData,
			[id]: id === "gameCode" ? value.toLowerCase() : value
		}))
	}

	const handleSubmit = () => {
		console.log("submitted")
	}

	return (
		<form className='join-form' onSubmit={handleSubmit}>
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
			<button type='submit'>Play</button>
		</form>
	)
}
