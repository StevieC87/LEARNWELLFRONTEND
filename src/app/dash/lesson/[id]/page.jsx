
import Link from "next/link";
export default async function LessonPage({ params }) {

  const lessonid = await params.id

  const toggleTabs = (tab) => {
    if (tab === "pagecontent") {
      setPageContent(true);
      setSEOVisible(false);
      setJsonldVisible(false);
    }
    else if (tab === "seocontent") {
      setSEOVisible(true);
      setPageContent(false);
      setJsonldVisible(false);
    }

    else if (tab === "jsonld") {
      setPageContent(false);
      setSEOVisible(false);
      setJsonldVisible(true);
    }
  }
  return (
    <>

      {/* WE NEED TO CHECK IF ALL THE FLASHCARDS WERE STUDIED IN THE STACK FIRST */}
      <div className="lessoncard">
        <h1>Lesson {lessonid}</h1>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center mt-4">
        <Link href={`./flash/${lessonid}`}>
          <button className="btn button-primary">Study Flashcards!</button>
        </Link>
        <Link href={`./quiz1/${lessonid}`}>
          <button className="btn button-primary">QUIZ1: Word Test</button>
        </Link>
        <Link href={`./quiz2/${lessonid}`}>
          <button className="btn button-primary">QUIZ2: Choice Test</button>
        </Link>
        <Link href={`./quiz3/${lessonid}`}>
          <button className="btn button-primary">QUIZ3: Sentence Gap</button>
        </Link>
        <Link href={`./quiz4/${lessonid}`}>
          <button className="btn button-primary">QUIZ4: Sentence Choice</button>

        </Link>
        <Link href={`./quiz5/${lessonid}`}>
          <button className="btn button-primary">QUIZ5: Sentence Builder</button>

        </Link>
      </div>

    </>
  )
}