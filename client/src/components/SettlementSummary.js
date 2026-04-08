function SettlementSummary({ settlement }) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Settlement Summary</h2>
      {settlement.length === 0 ? (
        <p>All settled!</p>
      ) : (
        <ul className="space-y-2">
          {settlement.map((s, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              {s.from} owes {s.to} ₹{s.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SettlementSummary;