
import IssueCard from '../components/IssueCard'

function IssueCardDemo() {

  const sampleComplaint = {
    id: 'CS001',
    title: 'Pothole near main road',
    category: 'Roads & Infrastructure',
    status: 'In Progress',
    location: 'Civil Lines, Delhi',
    date: '1 November 2026',
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        My Complaints
      </h1>

      <p className="mb-8 text-slate-500">
        Track the status of your reported civic issues.
      </p>

      <div className="max-w-xl">
        <IssueCard complaint={sampleComplaint} />
      </div>

    </div>
  )
}

export default IssueCardDemo
