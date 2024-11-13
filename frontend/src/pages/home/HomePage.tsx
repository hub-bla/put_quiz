import { Link } from "react-router-dom"
import "./HomePage.css"
import { CREATE_QUIZ_ROUTE, JOIN_QUIZ_ROUTE } from "@/utils"
export const HomePage: React.FC = () => {
	return (
		<div className='home-page'>
			<Link to={CREATE_QUIZ_ROUTE}>
				<button>Create quiz</button>
			</Link>
			<Link to={JOIN_QUIZ_ROUTE}>
				<button>Join quiz</button>
			</Link>
		</div>
	)
}
