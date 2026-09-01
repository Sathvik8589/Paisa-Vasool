const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const signupBtn = document.getElementById('signupBtn');
const authMessage = document.getElementById('authMessage');
const logoutBtn = document.getElementById('logoutBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const currentUserLabel = document.getElementById('currentUserLabel');
const viewTitle = document.getElementById('viewTitle');

const teamForm = document.getElementById('teamForm');
const teamList = document.getElementById('teamList');
const memberForm = document.getElementById('memberForm');
const memberNameInput = document.getElementById('memberName');
const teamNameInput = document.getElementById('teamName');
const teamHeadInput = document.getElementById('teamHead');

const collectionForm = document.getElementById('collectionForm');
const collectionTeamSelect = document.getElementById('collectionTeamSelect');
const collectionMemberSelect = document.getElementById('collectionMemberSelect');
const collectionSummary = document.getElementById('collectionSummary');
const navButtons = document.querySelectorAll('.nav-btn');
const viewPanels = document.querySelectorAll('.view-panel');

if (window.AuthFeature) {
  window.AuthFeature.bind({
    loginForm,
    signupForm: document.getElementById('signupForm'),
    signupBtn,
    backToLoginBtn: document.getElementById('backToLoginBtn'),
    authMessage,
    loginInput: document.getElementById('loginInput'),
    passwordInput: document.getElementById('passwordInput'),
    signupUsername: document.getElementById('signupUsername'),
    signupPassword: document.getElementById('signupPassword'),
    signupConfirmPassword: document.getElementById('signupConfirmPassword'),
    signupMobile: document.getElementById('signupMobile'),
    signupTeamName: document.getElementById('signupTeamName'),
  });
}

if (window.DashboardFeature) {
  window.DashboardFeature.bind({
    navButtons,
    viewPanels,
    viewTitle,
    menuToggle,
    sidebar,
    onViewChange: setActiveView,
  });
}

if (window.TeamMembersFeature) {
  window.TeamMembersFeature.bind({
    teamForm,
    teamNameInput,
    teamHeadInput,
    memberForm,
    memberNameInput,
    onCreateTeam: handleCreateTeam,
    onAddMember: handleAddMember,
  });
}

if (window.TeamFeature) {
  window.TeamFeature.bind({
    teamList,
    memberForm,
  });
}

if (window.MoneyCollectionFeature) {
  window.MoneyCollectionFeature.bind({
    collectionTeamSelect,
    collectionMemberSelect,
    collectionSummary,
  });
}

if (window.LanguageFeature) {
  window.LanguageFeature.bind({
    languageSelect: document.getElementById('languageSelect'),
  });
}

let selectedTeamId = null;
let teams = [];
let currentUser = localStorage.getItem('paisaUser') || '';
let activeView = 'team';

function showSignupForm() {
  if (window.AuthFeature) {
    window.AuthFeature.setMode(true);
    return;
  }

  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.remove('hidden');
}

function showLoginForm() {
  if (window.AuthFeature) {
    window.AuthFeature.setMode(false);
    return;
  }

  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('signupForm').classList.add('hidden');
}

function setAuthMessage(message, isError = false) {
  if (window.AuthFeature) {
    window.AuthFeature.setMessage(message, isError);
    return;
  }

  authMessage.textContent = message;
  authMessage.style.color = isError ? 'var(--danger)' : 'var(--success)';
}

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Logged-In-User': currentUser,
  };
}

function showLoginPage() {
  loginPage.classList.remove('hidden');
  dashboardPage.classList.add('hidden');
  currentUser = '';
  localStorage.removeItem('paisaUser');
  currentUserLabel.textContent = 'User';
  authMessage.textContent = '';
}

function showDashboard() {
  loginPage.classList.add('hidden');
  dashboardPage.classList.remove('hidden');
  currentUserLabel.textContent = currentUser;
  fetchTeams();
}

function setActiveView(viewName) {
  activeView = viewName;
  if (window.DashboardFeature) {
    window.DashboardFeature.setActiveView(viewName);
    return;
  }

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewName);
  });
  viewPanels.forEach((panel) => {
    const isActive = panel.id === `${viewName}View`;
    panel.classList.toggle('active', isActive);
  });

  const titles = {
    team: 'Team',
    collection: 'Money Collection',
  };
  viewTitle.textContent = titles[viewName] || 'Dashboard';
}

async function fetchTeams() {
  if (!currentUser) {
    showLoginPage();
    return;
  }

  try {
    const response = await fetch('/api/teams', {
      headers: getAuthHeaders(),
    });

    if (response.status === 401) {
      showLoginPage();
      setAuthMessage('Please log in to continue.', true);
      return;
    }

    const data = await response.json();
    teams = data.teams || [];

    if (window.TeamFeature) {
      window.TeamFeature.updateTeams(teams, selectedTeamId);
    } else {
      renderTeams();
    }

    if (window.MoneyCollectionFeature) {
      window.MoneyCollectionFeature.updateTeams(teams, selectedTeamId);
    } else {
      renderCollectionOptions();
    }
  } catch (error) {
    setAuthMessage('Unable to load teams.', true);
  }
}

function renderTeams() {
  if (window.TeamFeature) {
    window.TeamFeature.updateTeams(teams, selectedTeamId);
    return;
  }

  if (!teams.length) {
    teamList.innerHTML = '<p class="empty-message">No teams created yet. Create your first team and add members.</p>';
    memberForm.classList.add('hidden');
    return;
  }

  const activeTeam = teams.find((team) => team.id === selectedTeamId) || teams[0];
  selectedTeamId = activeTeam.id;
  memberForm.classList.remove('hidden');

  teamList.innerHTML = teams
    .map(
      (team) => `
        <div class="team-item" data-id="${team.id}">
          <h4>${team.name}</h4>
          <p><strong>Head:</strong> ${team.headName}</p>
          <ul class="member-list">
            ${(team.members || []).length ? team.members.map((member) => `<li>${member}</li>`).join('') : '<li>No members added yet</li>'}
          </ul>
        </div>
      `
    )
    .join('');

  teamList.querySelectorAll('.team-item').forEach((card) => {
    card.addEventListener('click', () => {
      selectedTeamId = card.dataset.id;
      renderCollectionOptions();
      renderTeams();
    });
  });
}

function renderCollectionOptions() {
  if (window.MoneyCollectionFeature) {
    window.MoneyCollectionFeature.updateTeams(teams, selectedTeamId);
    return;
  }

  if (!teams.length) {
    collectionTeamSelect.innerHTML = '<option value="">No teams</option>';
    collectionMemberSelect.innerHTML = '<option value="">No members</option>';
    collectionSummary.innerHTML = '<p class="empty-message">Create a team to begin collecting money.</p>';
    return;
  }

  const selectedTeam = teams.find((team) => team.id === selectedTeamId) || teams[0];
  selectedTeamId = selectedTeam.id;

  collectionTeamSelect.innerHTML = teams
    .map(
      (team) => `<option value="${team.id}" ${team.id === selectedTeam.id ? 'selected' : ''}>${team.name}</option>`
    )
    .join('');

  collectionMemberSelect.innerHTML = (selectedTeam.members || [])
    .map((member) => `<option value="${member}">${member}</option>`)
    .join('') || '<option value="">No members</option>';

  renderCollectionSummary(selectedTeam);
}

function renderCollectionSummary(team) {
  if (window.MoneyCollectionFeature) {
    window.MoneyCollectionFeature.renderCollectionSummary(team);
    return;
  }

  if (!team || !team.collections || !team.collections.length) {
    collectionSummary.innerHTML = '<p class="empty-message">No collections recorded yet.</p>';
    return;
  }

  const total = team.collections.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  collectionSummary.innerHTML = `
    <div class="collection-item">
      <h4>${team.name}</h4>
      <p><strong>Total collected:</strong> ${total.toFixed(2)}</p>
      <ul class="member-list">
        ${team.collections
          .map(
            (item) => `<li>${item.memberName} paid ${Number(item.amount).toFixed(2)} for ${item.eventName}</li>`
          )
          .join('')}
      </ul>
    </div>
  `;
}

async function handleLogin({ login, password }) {
  if (!login || !password) {
    setAuthMessage('Please enter both login and password.', true);
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      setAuthMessage(result.detail || 'Login failed. Please create an account first.', true);
      return;
    }

    currentUser = login;
    localStorage.setItem('paisaUser', currentUser);
    setAuthMessage(result.message || 'Login successful.');
    setActiveView('team');
    showDashboard();
  } catch (error) {
    setAuthMessage('Login failed. Please try again.', true);
  }
}

async function handleSignup({ username, password, confirmPassword, mobileNumber, teamName }) {
  if (!username || !password || !confirmPassword || !mobileNumber || !teamName) {
    setAuthMessage('Please fill in username, password, mobile number, and team name.', true);
    return;
  }

  if (password !== confirmPassword) {
    setAuthMessage('Passwords do not match.', true);
    return;
  }

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, confirmPassword, mobileNumber, teamName }),
    });

    const result = await response.json();
    if (!response.ok) {
      setAuthMessage(result.detail || 'Sign up failed.', true);
      return;
    }

    document.getElementById('signupUsername').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
    document.getElementById('signupMobile').value = '';
    document.getElementById('signupTeamName').value = '';

    setAuthMessage(result.message || 'Account created. Please login.');
    showLoginForm();
  } catch (error) {
    setAuthMessage('Sign up failed. Please try again.', true);
  }
}

if (window.AuthFeature) {
  window.AuthFeature.setHandlers({
    onLogin: handleLogin,
    onSignup: handleSignup,
    onShowSignup: showSignupForm,
    onShowLogin: showLoginForm,
  });
}

async function handleCreateTeam({ name, headName }) {
  try {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, headName, members: [] }),
    });

    const result = await response.json();
    if (!response.ok) {
      setAuthMessage(result.detail || 'Unable to create team.', true);
      return;
    }

    teamNameInput.value = '';
    teamHeadInput.value = '';
    setAuthMessage(`Team created: ${result.team.name}`);
    fetchTeams();
  } catch (error) {
    setAuthMessage('Unable to create team.', true);
  }
}

async function handleAddMember({ memberName }) {
  if (!selectedTeamId) {
    setAuthMessage('Create a team first.', true);
    return;
  }

  try {
    const response = await fetch(`/api/teams/${selectedTeamId}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ memberName }),
    });

    const result = await response.json();
    memberNameInput.value = '';
    if (!response.ok) {
      setAuthMessage(result.detail || 'Member could not be added.', true);
      return;
    }

    setAuthMessage(`Member added to ${result.team.name}`);
    fetchTeams();
  } catch (error) {
    setAuthMessage('Member could not be added.', true);
  }
}

if (window.TeamMembersFeature) {
  window.TeamMembersFeature.setMemberFormVisible(Boolean(selectedTeamId));
}

collectionTeamSelect.addEventListener('change', (event) => {
  selectedTeamId = event.target.value;
  if (window.TeamMembersFeature) {
    window.TeamMembersFeature.setMemberFormVisible(Boolean(selectedTeamId));
  }
  if (window.MoneyCollectionFeature) {
    window.MoneyCollectionFeature.setSelectedTeamId(selectedTeamId);
    return;
  }
  renderCollectionOptions();
});

collectionForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!selectedTeamId) {
    setAuthMessage('Select a team first.', true);
    return;
  }

  const eventName = document.getElementById('eventName').value.trim();
  const memberName = collectionMemberSelect.value;
  const amount = document.getElementById('collectionAmount').value;

  try {
    const response = await fetch(`/api/teams/${selectedTeamId}/collections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ eventName, memberName, amount }),
    });

    const result = await response.json();
    if (!response.ok) {
      setAuthMessage(result.detail || 'Collection failed.', true);
      return;
    }

    document.getElementById('eventName').value = '';
    document.getElementById('collectionAmount').value = '';
    setAuthMessage(`Money collected from ${memberName}`);
    fetchTeams();
  } catch (error) {
    setAuthMessage('Collection failed.', true);
  }
});

logoutBtn.addEventListener('click', () => {
  showLoginPage();
  setAuthMessage('Logged out successfully.');
});

if (!currentUser) {
  showLoginPage();
} else {
  showDashboard();
}
