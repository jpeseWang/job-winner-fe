export default function Pagination({ page, total, pageSize, onChange }:
  { page: number, total: number, pageSize: number, onChange: (p: number) => void }) {
  const pageCount = Math.ceil(total / pageSize);
  return (
    <div className="flex justify-center my-6 gap-2">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40">Previous</button>
      {[...Array(pageCount)].map((_, idx) => (
        <button key={idx} onClick={() => onChange(idx + 1)}
          className={`px-3 py-1 rounded ${page === idx + 1 ? "bg-teal-500 text-white" : "bg-gray-200"}`}>
          {idx + 1}
        </button>
      ))}
      <button disabled={page >= pageCount} onClick={() => onChange(page + 1)}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40">Next</button>
    </div>
  );
}
