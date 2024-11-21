import { QuizPreview } from "@/components/QuizPreview"
import { Quiz } from "@/utils"
import { ChangeEvent, useState } from "react"
import "./createQuiz.css"

export const CreateQuiz: React.FC = () => {
	const [quizData, setQuizData] = useState<Quiz>()
	const getQuizData = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		if (files && files?.length > 0) {
			files[0]
				.arrayBuffer()
				.then((val) => setQuizData(JSON.parse(new TextDecoder().decode(val))))
		}
	}

	return (
		<div>
			<div className='manipulation'>
				<button disabled={!quizData}>Create game</button>
				<input type='file' accept='.json' onChange={getQuizData} />
			</div>
			{quizData && <QuizPreview quiz={quizData} />}
		</div>
	)
}
