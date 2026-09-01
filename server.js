const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(PUBLIC_DIR));

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = { teams: [], users: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    if (!raw.trim()) {
      const initialData = { teams: [], users: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading data file:', error.message);
    return { teams: [], users: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function findTeamById(id) {
  const data = readData();
  return data.teams.find((team) => team.id === id);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Paisa Vasool' });
});

app.get('/api/teams', (req, res) => {
  const data = readData();
  res.json({ teams: data.teams });
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body || {};

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password are required.' });
  }

  res.json({
    success: true,
    message: `Welcome back, ${login}!`,
  });
});

app.post('/api/signup', (req, res) => {
  const { login, password } = req.body || {};

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password are required to sign up.' });
  }

  const data = readData();
  const existingUser = data.users.find((user) => user.login === login);

  if (existingUser) {
    return res.status(409).json({ message: 'This login already exists.' });
  }

  data.users.push({ login, password });
  writeData(data);

  res.status(201).json({
    success: true,
    message: `Account created for ${login}.`,
  });
});

app.post('/api/teams', (req, res) => {
  const { name, headName, members } = req.body || {};

  if (!name || !headName) {
    return res.status(400).json({ message: 'Team name and team head are required.' });
  }

  const data = readData();
  const newTeam = {
    id: Date.now().toString(),
    name,
    headName,
    members: Array.isArray(members) ? members.filter(Boolean) : [],
    photos: [],
    collections: [],
    createdAt: new Date().toISOString(),
  };

  data.teams.push(newTeam);
  writeData(data);

  res.status(201).json({ team: newTeam });
});

app.post('/api/teams/:id/members', (req, res) => {
  const { memberName } = req.body || {};
  const team = findTeamById(req.params.id);

  if (!team) {
    return res.status(404).json({ message: 'Team not found.' });
  }

  if (!memberName || !memberName.trim()) {
    return res.status(400).json({ message: 'Member name is required.' });
  }

  team.members.push(memberName.trim());

  const data = readData();
  const teamIndex = data.teams.findIndex((item) => item.id === req.params.id);
  if (teamIndex !== -1) {
    data.teams[teamIndex] = team;
    writeData(data);
  }

  res.status(201).json({ team });
});

app.post('/api/teams/:id/photos', (req, res) => {
  const { photoName, imageData } = req.body || {};
  const team = findTeamById(req.params.id);

  if (!team) {
    return res.status(404).json({ message: 'Team not found.' });
  }

  if (!imageData) {
    return res.status(400).json({ message: 'Image is required.' });
  }

  const photo = {
    id: Date.now().toString(),
    name: photoName || 'team-photo',
    imageData,
    uploadedAt: new Date().toISOString(),
  };

  team.photos.push(photo);

  const data = readData();
  const teamIndex = data.teams.findIndex((item) => item.id === req.params.id);
  if (teamIndex !== -1) {
    data.teams[teamIndex] = team;
    writeData(data);
  }

  res.status(201).json({ photo });
});

app.post('/api/teams/:id/collections', (req, res) => {
  const { eventName, memberName, amount } = req.body || {};
  const team = findTeamById(req.params.id);

  if (!team) {
    return res.status(404).json({ message: 'Team not found.' });
  }

  if (!eventName || !memberName || amount === undefined || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Event name, member name, and a valid amount are required.' });
  }

  const record = {
    id: Date.now().toString(),
    eventName,
    memberName,
    amount: Number(amount),
    date: new Date().toISOString(),
  };

  team.collections.push(record);

  const data = readData();
  const teamIndex = data.teams.findIndex((item) => item.id === req.params.id);
  if (teamIndex !== -1) {
    data.teams[teamIndex] = team;
    writeData(data);
  }

  res.status(201).json({ record, team });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Paisa Vasool app running on http://localhost:${PORT}`);
});
