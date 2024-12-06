import { Question } from "@/utils"
import "./QuizPreview.css"

interface QuestionProps {
	question: Question
}

export const QuestionPreview: React.FC<QuestionProps> = ({ question }) => {
	const { text, answers, correctAnswerIdx } = question

	const answersData = answers.map((answer, idx) => (
		<div
			key={idx}
			className={`answer-preview ${
				correctAnswerIdx === idx ? " correct-answer" : ""
			}`}>
			{answer}
		</div>
	))
	return (
		<div>
			<h3>{text}</h3>
			<div className='answers'>{answersData}</div>
		</div>
	)
}
