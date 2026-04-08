import { useEffect, useState } from 'react';
import axios from 'axios';

function AddExpense() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    paidBy: '',
    splitAmong: [],
    category: '',
    date: '',
    note: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get('http://localhost:5000/api/members');
    setMembers(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSplitChange = (id) => {
    setForm({
      ...form,
      splitAmong: form.splitAmong.includes(id)
        ? form.splitAmong.filter(i => i !== id)
        : [...form.splitAmong, id]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/expenses', form);
    setForm({
      title: '',
      amount: '',
      paidBy: '',
      splitAmong: [],
      category: '',
      date: '',
      note: ''
    });
    alert('Expense added!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add Expense</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block">Amount</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block">Paid By</label>
          <select name="paidBy" value={form.paidBy} onChange={handleChange} required className="border p-2 w-full">
            <option value="">Select</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Split Among</label>
          {members.map(m => (
            <label key={m.id} className="block">
              <input
                type="checkbox"
                checked={form.splitAmong.includes(m.id)}
                onChange={() => handleSplitChange(m.id)}
              /> {m.name}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <label className="block">Category</label>
          <select name="category" value={form.category} onChange={handleChange} required className="border p-2 w-full">
            <option value="">Select</option>
            <option value="rent">Rent</option>
            <option value="groceries">Groceries</option>
            <option value="bills">Bills</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block">Note</label>
          <textarea name="note" value={form.note} onChange={handleChange} className="border p-2 w-full"></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;