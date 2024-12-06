import { useEffect, useState } from "react"
import { Standing } from "./types"
import StandingTableRow from "./StandingTableRow/StandingTableRow"
import "./StandingTable.css"
import { useSocketContext } from "@/utils"

type Standings = {
	[username: string]: Standing
}

interface StandingMessage {
	numberOfQuestions: number
	standings: Standings
}

const MOCK_DATA: StandingMessage = {
	numberOfQuestions: 10,
	standings: {
		ktos2: {
			answeredCorrectly: 0,
			answeredWrong: 5,
			points: 10000,
		},
	},
}

const BASE_TOP_POS = 65
const HEADER_SPACE_POS = 40

const StandingTable: React.FC = () => {
	const { newMessage } = useSocketContext()
	const [standingsData, setStandingsData] = useState<StandingMessage>({
		numberOfQuestions: 0,
		standings: {},
	})

	// useEffect(() => {
	// 	// NOTE: Following lines are just for testing animations
	// 	const testId = setTimeout(() => {
	// 		setStandingsData((prev) => {
	// 			const newPoints = prev["standings"].map((standing) => standing)

	// 			newPoints[1]["points"] = 1000
	// newPoints[1]["answeredCorrectly"] = 8
	// 			newPoints[1]["answeredWrong"] = 2
	// 			newPoints[2]["points"] = 20
	// 			newPoints[2]["answeredCorrectly"] = 7
	// 			newPoints[2]["answeredWrong"] = 3
	// 			return {
	// 				...prev,
	// 				standings: newPoints,
	// 			}
	// 		})
	// 	}, 3000)

	// 	return () => {
	// 		clearTimeout(testId)
	// 	}
	// }, [])

	useEffect(() => {
		const { type, data } = newMessage as {
			type: string
			data: StandingMessage
		}
		if (type.length != 0) {
			if (type == "standing") {
				if (!data["standings"]) {
					data["standings"] = {}
				}
				setStandingsData(data)
			}
		}
	}, [newMessage])

	const tableData = Object.entries(standingsData["standings"])
		.sort(
			(standing1, standing2) => standing2[1]["points"] - standing1[1]["points"]
		)
		.map((standing, rank) => {
			const username = standing[0]
			return (
				<StandingTableRow
					key={username}
					rank={rank + 1}
					username={username}
					numberOfQuestions={MOCK_DATA["numberOfQuestions"]}
					standing={standing[1]}
					startingPos={BASE_TOP_POS * (rank + 1)}
				/>
			)
		})

	return (
		<div
			style={{ height: HEADER_SPACE_POS + BASE_TOP_POS * tableData.length }}
			className='standing-table'>
			<div>
				<div className='table-headers' style={{ height: HEADER_SPACE_POS }}>
					<div className='left-align-header rank'>Rank</div>
					<div className='left-align-header username'>username</div>
					<div className='left-align-header answers'>Answers</div>
					<div className='left-align-header points'>Points</div>
				</div>
				{tableData}
			</div>
		</div>
	)
}

export default StandingTable
