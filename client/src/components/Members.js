import { useEffect, useState } from 'react';
import axios from 'axios';

function Members() {
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get('http://localhost:5000/api/members');
    setMembers(res.data);
  };

  const addMember = async () => {
    if (!newName) return;
    await axios.post('http://localhost:5000/api/members', { name: newName });
    setNewName('');
    fetchMembers();
  };

  const deleteMember = async (id) => {
    await axios.delete(`http://localhost:5000/api/members/${id}`);
    fetchMembers();
  };

  const startEdit = (member) => {
    setEditing(member.id);
    setEditName(member.name);
  };

  const saveEdit = async () => {
    await axios.put(`http://localhost:5000/api/members/${editing}`, { name: editName });
    setEditing(null);
    fetchMembers();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Members</h1>
      <div className="mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New member name"
          className="border p-2 mr-2"
        />
        <button onClick={addMember} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul className="space-y-2">
        {members.map(m => (
          <li key={m.id} className="bg-white p-4 rounded shadow flex justify-between">
            {editing === m.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border p-2"
                />
                <button onClick={saveEdit} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Save</button>
                <button onClick={() => setEditing(null)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
              </>
            ) : (
              <>
                <span>{m.name}</span>
                <div>
                  <button onClick={() => startEdit(m)} className="bg-yellow-600 text-white px-4 py-2 rounded mr-2">Edit</button>
                  <button onClick={() => deleteMember(m.id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Members;