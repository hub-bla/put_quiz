import { Link } from "react-router-dom"
import "./HomePage.css"
import { CREATE_QUIZ_ROUTE, JOIN_QUIZ_ROUTE, useUserContext } from "@/utils"
export const HomePage: React.FC = () => {
	const {setUserTypeToHost, setUserTypeToPlayer} = useUserContext()
	return (
		<div className='home-page'>
			<Link to={CREATE_QUIZ_ROUTE} onClick={() => setUserTypeToHost()}>
				<button>Create quiz</button>
			</Link>
			<Link to={JOIN_QUIZ_ROUTE} onClick={() => setUserTypeToPlayer()}>
				<button>Join quiz</button>
			</Link>
		</div>
	)
}
