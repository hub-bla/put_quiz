import "./AnsweredSidebar.css"

const playersStatesData = {
	answered: 1,
	nPlayers: 3,
	players: {
		marik1234: false,
		msciwoj: true,
		komar: false,
	},
}

export const AnsweredSidebar: React.FC = () => {
	const playersStates = Object.entries(playersStatesData["players"]).map(
		(player, idx) => {
			const [username, answered] = player

			return (
				<div key={idx}>
					{username}: {answered ? "answered" : "thinking..."}
				</div>
			)
		}
	)
	return (
		<div className='answer-sidebar'>
			<h3>
				Answered: {playersStatesData.answered}/{playersStatesData.nPlayers}
			</h3>
			{playersStates}
		</div>
	)
}
