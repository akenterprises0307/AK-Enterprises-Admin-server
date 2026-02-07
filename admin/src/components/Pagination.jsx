export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const nums = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button disabled={page===1} onClick={()=>onChange(page-1)} className="btn-outline disabled:opacity-40">Prev</button>
      {nums.map(n => (
        <button key={n} onClick={()=>onChange(n)} className={`px-3 py-2 rounded-md border ${n===page ? 'bg-brandBlue text-white border-brandBlue' : 'border-gray-200 hover:bg-gray-50'}`}>{n}</button>
      ))}
      <button disabled={page===totalPages} onClick={()=>onChange(page+1)} className="btn-outline disabled:opacity-40">Next</button>
    </div>
  )
}

