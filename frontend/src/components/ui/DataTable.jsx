export default function DataTable({ columns = [], rows = [], renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col}
                className="text-left text-xs font-semibold font-manrope uppercase tracking-wider text-surface-500 px-4 py-3"
              >
                {col.label || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              className={`transition-colors duration-150 hover:bg-surface-100 ${
                i % 2 === 0 ? "bg-white" : "bg-surface-50"
              }`}
            >
              {columns.map((col) => {
                const key = col.key || col;
                return (
                  <td key={key} className="px-4 py-4 text-sm">
                    {renderCell ? renderCell(key, row) : String(row[key] ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
