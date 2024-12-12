import { Question, useSocketContext } from "@/utils"
import "./QuestionCard.css"

interface QuestionCardProps {
	question: Question
	setAnswered: () => void
}

const BUTTON_COLOR_PREFIX = "button-"

const buttonColors = ["green", "red", "blue", "yellow"]

export const QuestionCard: React.FC<QuestionCardProps> = ({
	question,
	setAnswered,
}) => {
	const { text, answers } = question
	const { sendMessage, preprocessMessage } = useSocketContext()
	const sendAnswer = (idx: Number) => {
		const message = preprocessMessage("answer", {
			text: text,
			answerIdx: idx,
		})
		sendMessage(message)
		setAnswered()
	}

	const answersButtons = answers.map((answer, idx) => {
		return (
			<button
				key={idx}
				onClick={() => sendAnswer(idx)}
				className={`answer-button ${BUTTON_COLOR_PREFIX + buttonColors[idx]}`}>
				{answer}
			</button>
		)
	})

	return (
		<div className='question'>
			<h1>{text}</h1>
			<div className='answers'>{answersButtons}</div>
		</div>
	)
}
