import { useEffect, useState } from "react"
import { Standing } from "../types"
import AnswerBar from "./AnswersBar/AnswerBar"
import "./StandingTableRow.css"
import "../StandingTable.css"
import { useMediaQueries, useUserContext } from "@/utils"

interface StandingTableRowProps {
	rank: number
	numberOfQuestions: number
	startingPos: number
	username: string
	standing: Standing
}

const StandingTableRow: React.FC<StandingTableRowProps> = ({
	rank,
	numberOfQuestions,
	startingPos,
	username,
	standing,
}) => {
	const [rowTop, setRowTop] = useState(startingPos)
	const { answeredCorrectly, answeredWrong, points } = standing
	const { md } = useMediaQueries()
	const {username:playerUsername} = useUserContext()

	useEffect(() => {
		const moveRowTimeoutId = setTimeout(() => {
			setRowTop(startingPos)
		}, 1000)

		return () => {
			clearTimeout(moveRowTimeoutId)
		}
	}, [startingPos])

	return (
		<div style={{ top: rowTop }} className={`standing-row animate-row ${playerUsername===username ? "this-player" : ""}`}>
			<div className='rank'>{rank}</div>
			<div className='username'>{username}</div>
			<div className='answers'>
				<AnswerBar
					correctAnswers={answeredCorrectly}
					wrongAnswers={answeredWrong}
					numberOfQuestions={numberOfQuestions}
					width={md ? 200 : 300}
					height={30}
				/>
			</div>
			<div className='points'>{points}</div>
		</div>
	)
}

export default StandingTableRow
