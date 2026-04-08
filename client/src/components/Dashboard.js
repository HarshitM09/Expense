import { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryCard from './SummaryCard';
import SettlementSummary from './SettlementSummary';

function Dashboard() {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [settlement, setSettlement] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [membersRes, expensesRes, balancesRes, settlementRes] = await Promise.all([
      axios.get('http://localhost:5000/api/members'),
      axios.get('http://localhost:5000/api/expenses'),
      axios.get('http://localhost:5000/api/expenses/balances'),
      axios.get('http://localhost:5000/api/expenses/settlement')
    ]);
    setMembers(membersRes.data);
    setExpenses(expensesRes.data);
    setBalances(balancesRes.data);
    setSettlement(settlementRes.data);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Expenses" value={`₹${totalExpenses}`} />
        <SummaryCard title="Members" value={members.length} />
        <SummaryCard title="Expenses" value={expenses.length} />
        <SummaryCard title="Settlements" value={settlement.length} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
          {recentExpenses.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentExpenses.map(e => (
                <li key={e.id} className="bg-white p-4 rounded shadow">
                  <p className="font-semibold">{e.title}</p>
                  <p>₹{e.amount} paid by {members.find(m => m.id === e.paidBy)?.name}</p>
                  <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Members</h2>
          {members.length === 0 ? (
            <p>No members yet.</p>
          ) : (
            <ul className="space-y-2">
              {members.map(m => (
                <li key={m.id} className="bg-white p-4 rounded shadow">
                  <p className="font-semibold">{m.name}</p>
                  <p>Balance: ₹{balances[m.id]?.net || 0}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <SettlementSummary settlement={settlement} />
    </div>
  );
}

export default Dashboard;