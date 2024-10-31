import { useEffect, useState } from "react"
import "./AnswerBar.css"

interface AnswerBarProps {
	correctAnswers: number
	wrongAnswers: number
	numberOfQuestions: number
	width: number
	height: number
}

const AnswerBar: React.FC<AnswerBarProps> = ({
	correctAnswers,
	wrongAnswers,
	numberOfQuestions,
	width,
	height,
}) => {
	const [displayAnimation, setDisplayAnimation] = useState({
		correct: 0,
		wrong: 0,
	})

	const correctWidth = Math.floor(width * (correctAnswers / numberOfQuestions))
	const wrongWidth = Math.floor(width * (wrongAnswers / numberOfQuestions))

	useEffect(() => {
		const displayBarTimeoutId = setTimeout(() => {
			setDisplayAnimation({ correct: correctWidth, wrong: wrongWidth })
		}, 250)
		return () => {
			clearTimeout(displayBarTimeoutId)
		}
	}, [correctWidth, wrongWidth])

	return (
		<div style={{ width: width, height: height }} className='bar-background'>
			<div
				style={{ width: displayAnimation["correct"], height: height }}
				className={`correct animate-bar`}></div>
			<div
				style={{ width: displayAnimation["wrong"], height: height }}
				className={`wrong animate-bar`}></div>
		</div>
	)
}

export default AnswerBar
