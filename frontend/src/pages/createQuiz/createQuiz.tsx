import { QuizPreview } from "@/components/QuizPreview"
import { HOST_LOBBY_ROUTE, Quiz, useSocketContext, useUserContext } from "@/utils"
import { ChangeEvent, useState } from "react"
import "./createQuiz.css"
import { useNavigate } from "react-router-dom"

export const CreateQuiz: React.FC = () => {
	const [quizData, setQuizData] = useState<Quiz>()
	const { preprocessMessage, sendMessage } = useSocketContext()
	const { userType } = useUserContext()
	const navigate = useNavigate()

	if (userType !== "host") {
		navigate("/")
	}

	const getQuizData = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		if (files && files?.length > 0) {
			files[0]
				.arrayBuffer()
				.then((val) => setQuizData(JSON.parse(new TextDecoder().decode(val))))
		}
	}

	const sendQuiz = () => {
		if (quizData) {
			const message = preprocessMessage("create_game", quizData)
			sendMessage(message)
			navigate("/" + HOST_LOBBY_ROUTE)
		}
	}

	return (
		<div>
			<div className='manipulation'>
				<button disabled={!quizData} onClick={() => sendQuiz()}>
					Create game
				</button>
				<input type='file' accept='.json' onChange={getQuizData} />
			</div>
			{quizData && <QuizPreview quiz={quizData} />}
		</div>
	)
}
