
import Link from "next/link";
export default function LessonPage({ params }) {


  return (
    <>
      <div className="lessoncard">
        <h1>Lesson {params.id}</h1>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center mt-4">
        <Link href={`/lesson/flash/${params.id}`}>
          <button className="btn button-primary">Study Flashcards!</button>
        </Link>
        <Link href={`/lesson/quiz1/${params.id}`}>
          <button className="btn button-primary">Quiz 1</button>
        </Link>
        <Link href={`/lesson/quiz2/${params.id}`}>
          <button className="btn button-primary">Quiz 2</button>
        </Link>
        <Link href={`/lesson/quiz3/${params.id}`}>
          <button className="btn button-primary">Quiz 3</button>
        </Link>
      </div>

    </>
  )
}