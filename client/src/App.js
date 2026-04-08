import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import AddExpense from './components/AddExpense';
import ExpenseHistory from './components/ExpenseHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/history" element={<ExpenseHistory />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;