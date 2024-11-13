import { QuizPreview } from "@/components/QuizPreview"
import { Quiz } from "@/utils"
import { ChangeEvent, useState } from "react"

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
			<input type='file' accept='.json' onChange={getQuizData} />
			<button disabled={!quizData}>Create game</button>
			{quizData && <QuizPreview quiz={quizData} />}
		</div>
	)
}
