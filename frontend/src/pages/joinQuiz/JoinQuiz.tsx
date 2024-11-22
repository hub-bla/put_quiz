import { useState } from "react"
import "./joinQuiz.css"

export const JoinQuiz: React.FC = () => {
	const [formData, setFromData] = useState({
		gameCode: null,
		username: null,
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		setFromData((prevFormData) => ({ ...prevFormData, [id]: value }))
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
				required
			/>
			<input
				className='form-input'
				id='username'
				type='text'
				placeholder='Enter your username'
				onChange={handleInputChange}
				required
			/>
			<button type='submit'>Play</button>
		</form>
	)
}
