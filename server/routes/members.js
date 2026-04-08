const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const membersFile = path.join(__dirname, '../data/members.json');

function readMembers() {
  if (!fs.existsSync(membersFile)) return [];
  return JSON.parse(fs.readFileSync(membersFile, 'utf8'));
}

function writeMembers(members) {
  fs.writeFileSync(membersFile, JSON.stringify(members, null, 2));
}

router.get('/', (req, res) => {
  res.json(readMembers());
});

router.post('/', (req, res) => {
  const members = readMembers();
  const newMember = { id: uuidv4(), name: req.body.name };
  members.push(newMember);
  writeMembers(members);
  res.json(newMember);
});

router.put('/:id', (req, res) => {
  const members = readMembers();
  const index = members.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Member not found' });
  members[index].name = req.body.name;
  writeMembers(members);
  res.json(members[index]);
});

router.delete('/:id', (req, res) => {
  const members = readMembers();
  const filtered = members.filter(m => m.id !== req.params.id);
  writeMembers(filtered);
  res.json({ message: 'Member deleted' });
});

module.exports = router;