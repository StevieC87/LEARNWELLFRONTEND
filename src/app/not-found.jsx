import Link from 'next/link'
import '../styles/extra/custom404.css'


export default function NotFound() {
  return (
    <div className="custom404div">
      <h1 style={{ fontSize: '6rem' }}>404 Not Found</h1>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}