import { useEffect, useState } from "react"
import { Standing } from "../types"
import AnswerBar from "./AnswersBar/AnswerBar"
import "./StandingTableRow.css"
import "../StandingTable.css"

interface StandingTableRowProps {
	rank: number
	numberOfQuestions: number
	startingPos: number
	prevPos: number
	standing: Standing
}

const StandingTableRow: React.FC<StandingTableRowProps> = ({
	rank,
	numberOfQuestions,
	startingPos,
	prevPos,
	standing,
}) => {
	const [rowTop, setRowTop] = useState(prevPos ? prevPos : startingPos)
	const { userName, answeredCorrectly, answeredWrong, points } = standing

	useEffect(() => {
		const moveRowTimeoutId = setTimeout(() => {
			setRowTop(startingPos)
		}, 1000)

		return () => {
			clearTimeout(moveRowTimeoutId)
		}
	}, [startingPos])

	return (
		<div style={{ top: rowTop }} className='standing-row animate-row'>
			<div className='rank'>{rank}</div>
			<div className='username'>{userName}</div>
			<div className='answers'>
				<AnswerBar
					correctAnswers={answeredCorrectly}
					wrongAnswers={answeredWrong}
					numberOfQuestions={numberOfQuestions}
					width={300}
					height={30}
				/>
			</div>
			<div className='points'>{points}</div>
		</div>
	)
}

export default StandingTableRow
