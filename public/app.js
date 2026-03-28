const usersList = document.getElementById('usersList');
const statusEl = document.getElementById('status');
const createForm = document.getElementById('createForm');
const refreshBtn = document.getElementById('refreshBtn');
const template = document.getElementById('userItemTemplate');
const searchInput = document.getElementById('searchInput');
const initialFilter = document.getElementById('initialFilter');
const sortFilter = document.getElementById('sortFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const totalUsersEl = document.getElementById('totalUsers');
const visibleUsersEl = document.getElementById('visibleUsers');
const filteredUsersEl = document.getElementById('filteredUsers');

let allUsers = [];

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b42318' : '#0b4f49';
}

function normalizeName(value) {
  return String(value || '').trim().toLowerCase();
}

function updateMetrics(total, visible) {
  totalUsersEl.textContent = String(total);
  visibleUsersEl.textContent = String(visible);
  filteredUsersEl.textContent = String(total - visible);
}

function updateInitialOptions(users) {
  const current = initialFilter.value;
  const initials = Array.from(new Set(
    users
      .map((user) => normalizeName(user.nome).charAt(0).toUpperCase())
      .filter(Boolean)
  )).sort();

  initialFilter.innerHTML = '<option value="">Todas</option>';
  initials.forEach((letter) => {
    const option = document.createElement('option');
    option.value = letter;
    option.textContent = letter;
    initialFilter.appendChild(option);
  });

  if (current && initials.includes(current)) {
    initialFilter.value = current;
  }
}

function applyFilters(users) {
  const search = normalizeName(searchInput.value);
  const initial = initialFilter.value;
  const sort = sortFilter.value;

  let filtered = users.filter((user) => {
    const name = normalizeName(user.nome);
    const searchMatch = !search || name.includes(search);
    const initialMatch = !initial || name.startsWith(initial.toLowerCase());
    return searchMatch && initialMatch;
  });

  filtered = filtered.sort((a, b) => {
    const nameA = normalizeName(a.nome);
    const nameB = normalizeName(b.nome);

    if (sort === 'name-asc') return nameA.localeCompare(nameB);
    if (sort === 'name-desc') return nameB.localeCompare(nameA);
    if (sort === 'id-asc') return String(a._id).localeCompare(String(b._id));
    return String(b._id).localeCompare(String(a._id));
  });

  return filtered;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.erro || 'Falha na requisicao.');
  }

  if (response.status === 204) return null;
  return response.json();
}

function buildUserItem(user) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector('.user-name').textContent = user.nome;
  node.querySelector('.user-id').textContent = user._id;

  node.querySelector('.delete-btn').addEventListener('click', async () => {
    try {
      await requestJson(`/users/${user._id}`, { method: 'DELETE' });
      setStatus('Usuario removido com sucesso.');
      await loadUsers();
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  node.querySelector('.edit-btn').addEventListener('click', async () => {
    const newName = window.prompt('Novo nome:', user.nome);
    if (!newName) return;

    try {
      await requestJson(`/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: newName.trim() })
      });
      setStatus('Usuario atualizado com sucesso.');
      await loadUsers();
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  return node;
}

function renderUsers(users) {
  usersList.innerHTML = '';

  if (!users.length) {
    usersList.innerHTML = '<li>Nenhum usuario encontrado para os filtros atuais.</li>';
    return;
  }

  users.forEach((user) => {
    usersList.appendChild(buildUserItem(user));
  });
}

async function loadUsers() {
  try {
    allUsers = await requestJson('/users');
    updateInitialOptions(allUsers);
    const visibleUsers = applyFilters(allUsers);
    renderUsers(visibleUsers);
    updateMetrics(allUsers.length, visibleUsers.length);
  } catch (error) {
    setStatus(error.message, true);
  }
}

function refreshListFromFilters() {
  const visibleUsers = applyFilters(allUsers);
  renderUsers(visibleUsers);
  updateMetrics(allUsers.length, visibleUsers.length);
}

createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nomeInput = document.getElementById('nome');

  try {
    await requestJson('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomeInput.value.trim() })
    });

    createForm.reset();
    setStatus('Usuario criado com sucesso.');
    await loadUsers();
  } catch (error) {
    setStatus(error.message, true);
  }
});

refreshBtn.addEventListener('click', loadUsers);
searchInput.addEventListener('input', refreshListFromFilters);
initialFilter.addEventListener('change', refreshListFromFilters);
sortFilter.addEventListener('change', refreshListFromFilters);

clearFiltersBtn.addEventListener('click', () => {
  searchInput.value = '';
  initialFilter.value = '';
  sortFilter.value = 'name-asc';
  refreshListFromFilters();
});

loadUsers();
