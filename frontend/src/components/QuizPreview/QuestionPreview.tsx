import { Question } from "@/utils"
import "./QuizPreview.css"
interface QuestionProps {
	question: Question
}
export const QuestionPreview: React.FC<QuestionProps> = ({ question }) => {
	const { text, answers, correctAnswerIdx } = question
	console.log(text)

	const answersData = answers.map((answer, idx) => (
		<div>
			answer
			{correctAnswerIdx && correctAnswerIdx === idx ? " --correct" : ""}
		</div>
	))
	return (
		<div>
			<h3>{text}</h3>
			<div className='answers'>{answersData}</div>
		</div>
	)
}
