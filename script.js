let users = JSON.parse(localStorage.getItem('users')) || [
  { id: '70062', name: 'Musab Ali', role: 'admin', site: 'غياثي' }
];
let sites = JSON.parse(localStorage.getItem('sites')) || ['غياثي'];
let animals = JSON.parse(localStorage.getItem('animals')) || ['خروف'];
let cuttings = JSON.parse(localStorage.getItem('cuttings')) || ['عزيمة'];
let prices = JSON.parse(localStorage.getItem('prices')) || {};
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
let currentUser = null;

window.onload = () => {
  setTimeout(() => showSection('login'), 2000);
  renderLists();
  loadLogo();
};

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function login() {
  let id = document.getElementById('employeeId').value;
  let u = users.find(x => x.id === id);
  if (!u) { alert('خطأ'); return; }
  currentUser = u;
  document.getElementById('username').innerText = u.name;
  fillSelects();
  renderUsers();
  renderReport();
  showSection('dashboard');
}

function logout() { currentUser = null; showSection('login'); }
function closeProgram() { alert('شكرا'); window.close(); }

function addUser() {
  let id = document.getElementById('newUserId').value;
  let name = document.getElementById('newUserName').value;
  let role = document.getElementById('newUserRole').value;
  let site = document.getElementById('newUserSite').value;
  users.push({ id, name, role, site });
  save();
  renderUsers();
}
function login() {
  const empId = document.getElementById("employeeId").value.trim();
  if (!empId) {
    alert("الرجاء إدخال الرقم الوظيفي");
    return;
  }
  const user = users.find(u => u.id === empId);
  if (!user) {
    alert("المستخدم غير موجود");
    return;
  }
  currentUser = user;
  document.getElementById("username").textContent = currentUser.name;
  setupDataEntrySite();

  }

  showSection("dashboard");
  clearDataEntryForm();
}
function renderUsers() {
  let t = document.getElementById('usersTable'); t.innerHTML = '';
  users.forEach(u => {
    let row = `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.role}</td><td>${u.site}</td></tr>`;
    t.innerHTML += row;
  });
}

function addSite() { sites.push(document.getElementById('newSite').value); save(); renderLists(); }
function addAnimal() { animals.push(document.getElementById('newAnimal').value); save(); renderLists(); }
function addCutting() { cuttings.push(document.getElementById('newCutting').value); save(); renderLists(); }
function setPrice() {
  let a = document.getElementById('priceAnimal').value;
  let c = document.getElementById('priceCutting').value;
  prices[a + c] = parseFloat(document.getElementById('priceValue').value);
  save();
}

function uploadLogo() {
  let f = document.getElementById('logoUpload').files[0];
  let r = new FileReader();
  r.onload = e => { localStorage.setItem('logo', e.target.result); loadLogo(); };
  r.readAsDataURL(f);
}

function loadLogo() {
  let l = localStorage.getItem('logo');
  if (l) document.getElementById('splashLogo').src = l;
}

function fillSelects() {
  ['priceAnimal', 'animalType'].forEach(id => fill(id, animals));
  ['priceCutting', 'cuttingType'].forEach(id => fill(id, cuttings));
  fill('newUserSite', sites);
}

function fill(id, arr) {
  let s = document.getElementById(id);
  s.innerHTML = ''; arr.forEach(x => s.innerHTML += `<option>${x}</option>`);
}

function saveData() {
  let inv = {
    name: document.getElementById('clientName').value,
    phone: document.getElementById('phone').value,
    invoice: Date.now(),
    animal: document.getElementById('animalType').value,
    cutting: document.getElementById('cuttingType').value,
    qty: document.getElementById('quantity').value,
    total: document.getElementById('totalPrice').value
  };
  invoices.push(inv); save(); renderReport();
}

function updatePrice() {
  let a = document.getElementById('animalType').value;
  let c = document.getElementById('cuttingType').value;
  let qty = document.getElementById('quantity').value;
  let u = prices[a + c] || 0;
  document.getElementById('unitPrice').value = u;
  document.getElementById('totalPrice').value = u * qty;
}

function renderReport() {
  let t = document.getElementById('reportTable'); t.innerHTML = '';
  invoices.forEach(x => {
    t.innerHTML += `<tr><td>${x.name}</td><td>${x.phone}</td><td>${x.invoice}</td><td>${x.animal}</td><td>${x.cutting}</td><td>${x.qty}</td><td>${x.total}</td></tr>`;
  });
}

function renderLists() { fillSelects(); renderUsers(); renderReport(); }
function save() {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('sites', JSON.stringify(sites));
  localStorage.setItem('animals', JSON.stringify(animals));
  localStorage.setItem('cuttings', JSON.stringify(cuttings));
  localStorage.setItem('prices', JSON.stringify(prices));
  localStorage.setItem('invoices', JSON.stringify(invoices));
  
  // 🔒 اخفاء الازرار غير المسموحة حسب الدور
  if (currentUser.role === "admin") {
    document.getElementById("settingsBtn").style.display = "inline-block";
    document.getElementById("manageUsersBtn").style.display = "inline-block";
  } else {
    document.getElementById("settingsBtn").style.display = "none";
    document.getElementById("manageUsersBtn").style.display = "none";
}
