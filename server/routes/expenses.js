const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const expensesFile = path.join(__dirname, '../data/expenses.json');
const membersFile = path.join(__dirname, '../data/members.json');

function readExpenses() {
  if (!fs.existsSync(expensesFile)) return [];
  return JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
}

function writeExpenses(expenses) {
  fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
}

function readMembers() {
  if (!fs.existsSync(membersFile)) return [];
  return JSON.parse(fs.readFileSync(membersFile, 'utf8'));
}

router.get('/', (req, res) => {
  res.json(readExpenses());
});

router.post('/', (req, res) => {
  const expenses = readExpenses();
  const newExpense = {
    id: uuidv4(),
    title: req.body.title,
    amount: req.body.amount,
    paidBy: req.body.paidBy,
    splitAmong: req.body.splitAmong,
    category: req.body.category,
    date: req.body.date,
    note: req.body.note
  };
  expenses.push(newExpense);
  writeExpenses(expenses);
  res.json(newExpense);
});

router.delete('/:id', (req, res) => {
  const expenses = readExpenses();
  const filtered = expenses.filter(e => e.id !== req.params.id);
  writeExpenses(filtered);
  res.json({ message: 'Expense deleted' });
});

// Balances
router.get('/balances', (req, res) => {
  const expenses = readExpenses();
  const members = readMembers();
  const balances = {};
  members.forEach(m => balances[m.id] = { name: m.name, paid: 0, owed: 0, net: 0 });
  expenses.forEach(exp => {
    balances[exp.paidBy].paid += exp.amount;
    const share = exp.amount / exp.splitAmong.length;
    exp.splitAmong.forEach(id => {
      balances[id].owed += share;
    });
  });
  Object.keys(balances).forEach(id => {
    balances[id].net = balances[id].paid - balances[id].owed;
  });
  res.json(balances);
});

// Settlement
router.get('/settlement', (req, res) => {
  const expenses = readExpenses();
  const members = readMembers();
  const bal = {};
  members.forEach(m => bal[m.id] = 0);
  expenses.forEach(exp => {
    const share = exp.amount / exp.splitAmong.length;
    exp.splitAmong.forEach(id => {
      bal[id] -= share;
      bal[exp.paidBy] += share;
    });
  });
  const creditors = [];
  const debtors = [];
  Object.keys(bal).forEach(id => {
    if (bal[id] > 0.01) creditors.push({ id, amount: bal[id] });
    else if (bal[id] < -0.01) debtors.push({ id, amount: -bal[id] });
  });
  creditors.sort((a,b) => b.amount - a.amount);
  debtors.sort((a,b) => b.amount - a.amount);
  const settlements = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amount = Math.min(creditor.amount, debtor.amount);
    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount: Math.round(amount * 100) / 100
    });
    creditor.amount -= amount;
    debtor.amount -= amount;
    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }
  const memberMap = {};
  members.forEach(m => memberMap[m.id] = m.name);
  const settlementWithNames = settlements.map(s => ({
    from: memberMap[s.from],
    to: memberMap[s.to],
    amount: s.amount
  }));
  res.json(settlementWithNames);
});

module.exports = router;