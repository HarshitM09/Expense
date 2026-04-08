import { useEffect, useState } from 'react';
import axios from 'axios';

function ExpenseHistory() {
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [filterMember, setFilterMember] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [expRes, memRes] = await Promise.all([
      axios.get('http://localhost:5000/api/expenses'),
      axios.get('http://localhost:5000/api/members')
    ]);
    setExpenses(expRes.data);
    setMembers(memRes.data);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    fetchData();
  };

  const filteredExpenses = expenses
    .filter(e => !filterMember || e.paidBy === filterMember || e.splitAmong.includes(filterMember))
    .filter(e => !filterCategory || e.category === filterCategory)
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Expense History</h1>
      <div className="mb-6 flex space-x-4">
        <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} className="border p-2">
          <option value="">All Members</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2">
          <option value="">All Categories</option>
          <option value="rent">Rent</option>
          <option value="groceries">Groceries</option>
          <option value="bills">Bills</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="space-y-4">
        {filteredExpenses.map(e => (
          <div key={e.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{e.title}</h3>
                <p>Amount: ₹{e.amount}</p>
                <p>Paid by: {members.find(m => m.id === e.paidBy)?.name}</p>
                <p>Split among: {e.splitAmong.map(id => members.find(m => m.id === id)?.name).join(', ')}</p>
                <p>Category: {e.category}</p>
                <p>Date: {new Date(e.date).toLocaleDateString()}</p>
                {e.note && <p>Note: {e.note}</p>}
              </div>
              <button onClick={() => deleteExpense(e.id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseHistory;