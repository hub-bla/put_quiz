import { Question, Quiz } from "@/utils"
import { QuestionPreview } from "./QuestionPreview"
import "./QuizPreview.css"

interface QuizPreviewProps {
	quiz: Quiz
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz }) => {
	const questionsPreview = quiz.questions.map((question: Question, idx) => {
		return <QuestionPreview key={idx} question={question} />
	})
	return <div className='questions'>{questionsPreview}</div>
}
