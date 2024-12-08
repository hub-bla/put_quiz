import { Question } from "@/utils"
import "./QuestionPreview.css"

interface QuestionPreview {
	question: Question
}

export const QuestionPreview: React.FC<QuestionPreview> = ({ question }) => {
	const { text } = question

	return (
		<div className='question-preview'>
			<h2 className = 'preview-header'>Current question</h2>
			<p>{text}</p>
		</div>
	)
}
