import { useEffect, useState } from "react"
import { Standing } from "./types"
import StandingTableRow from "./StandingTableRow/StandingTableRow"
import "./StandingTable.css"

interface StandingMessage {
	numberOfQuestions: number
	standings: Array<Standing>
}

type StandingsPositions = { [userName: string]: number }

const MOCK_DATA: StandingMessage = {
	numberOfQuestions: 10,
	standings: [
		{
			userName: "ktos2", // cap it to 20 chars
			answeredCorrectly: 2,
			answeredWrong: 5,
			points: 10000,
		},
		{
			userName: "kto3",
			answeredCorrectly: 3,
			answeredWrong: 4,
			points: 200,
		},
		{
			userName: "ktos",
			answeredCorrectly: 4,
			answeredWrong: 3,
			points: 421,
		},
		{
			userName: "kto5",
			answeredCorrectly: 3,
			answeredWrong: 4,
			points: 203,
		},
		{
			userName: "ktos4",
			answeredCorrectly: 4,
			answeredWrong: 3,
			points: 421,
		},
		{
			userName: "kto6",
			answeredCorrectly: 3,
			answeredWrong: 4,
			points: 241,
		},
		{
			userName: "ktos7",
			answeredCorrectly: 4,
			answeredWrong: 3,
			points: 452,
		},
	],
}

const BASE_TOP_POS = 65
const HEADER_SPACE_POS = 40

const StandingTable: React.FC = () => {
	const [prevRowsPos, setPrevRowsPos] = useState<StandingsPositions>({})
	const [standingsData, setStandingsData] = useState(MOCK_DATA)

	useEffect(() => {
		// NOTE: Following lines are just for testing animations
		const testId = setTimeout(() => {
			setStandingsData((prev) => {
				const newPoints = prev["standings"].map((standing) => standing)

				newPoints[1]["points"] = 1000
				newPoints[1]["answeredCorrectly"] = 8
				newPoints[1]["answeredWrong"] = 2
				newPoints[2]["points"] = 20
				newPoints[2]["answeredCorrectly"] = 7
				newPoints[2]["answeredWrong"] = 3
				return {
					...prev,
					standings: newPoints,
				}
			})
		}, 3000)

		const posObj: StandingsPositions = {}

		standingsData["standings"]
			.sort((standing1, standing2) => standing2["points"] - standing1["points"])
			.map(
				(standing, rank) =>
					(posObj[standing["userName"]] = BASE_TOP_POS * (rank + 1))
			)

		setPrevRowsPos(posObj)

		return () => {
			clearTimeout(testId)
		}
	}, [])

	const tableData = standingsData["standings"]
		.sort((standing1, standing2) => standing2["points"] - standing1["points"])
		.map((standing, rank) => {
			return (
				<StandingTableRow
					key={standing["userName"]}
					rank={rank + 1}
					numberOfQuestions={MOCK_DATA["numberOfQuestions"]}
					standing={standing}
					startingPos={BASE_TOP_POS * (rank + 1)}
					prevPos={prevRowsPos[standing["userName"]]}
				/>
			)
		})

	return (
		<div
			style={{ height: HEADER_SPACE_POS + BASE_TOP_POS * tableData.length }}
			className='standing-table'>
			<div>
				<div className='table-headers' style={{ height: HEADER_SPACE_POS }}>
					<div className='left-align-header  rank'>Rank</div>
					<div className='left-align-header username'>Username</div>
					<div className='left-align-header answers'>Answers</div>
					<div className='left-align-header  points'>Points</div>
				</div>
				{tableData}
			</div>
		</div>
	)
}

export default StandingTable
