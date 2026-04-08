import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">Expense Splitter</Link>
        <div>
          <Link to="/" className="mr-4">Dashboard</Link>
          <Link to="/members" className="mr-4">Members</Link>
          <Link to="/add-expense" className="mr-4">Add Expense</Link>
          <Link to="/history">History</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;