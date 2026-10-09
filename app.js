 function tab(id, btn) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.style.display = "none";
  });

  document.querySelectorAll(".tab-btn").forEach(el => {
    el.classList.remove("active");
  });

  const page = document.getElementById(id);
  if (page) page.style.display = "block";
  if (btn) btn.classList.add("active");
}

function getMembers() {
  try {
    return JSON.parse(localStorage.getItem("ktaMembers") || "[]");
  } catch {
    return [];
  }
}

function saveMembers(members) {
  localStorage.setItem("ktaMembers", JSON.stringify(members));
}

function daftar(e) {
  if (e) e.preventDefault();

  const form = e?.target;
  if (!form) return false;

  const data = new FormData(form);
  const nama = String(
    data.get("nama") || data.get("name") || ""
  ).trim();
  const username = String(
    data.get("username") || data.get("email") || ""
  ).trim().toLowerCase();
  const password = String(data.get("password") || "").trim();

  if (!nama || !username || !password) {
    alert("Lengkapi nama, username/email, dan password.");
    return false;
  }

  const members = getMembers();

  if (members.some(m => m.username === username)) {
    alert("Username atau email sudah terdaftar.");
    return false;
  }

  const nomor = "PIB-" + Date.now().toString().slice(-8);

  members.push({
    nama,
    username,
    password,
    nomor,
    tanggal: new Date().toLocaleDateString("id-ID")
  });

  saveMembers(members);
  alert("Pendaftaran berhasil. Silakan login.");
  form.reset();

  return false;
}

function login(e) {
  if (e) e.preventDefault();

  const form = e?.target;
  if (!form) return false;

  const data = new FormData(form);
  const username = String(
    data.get("username") || data.get("email") || ""
  ).trim().toLowerCase();
  const password = String(data.get("password") || "").trim();

  const member = getMembers().find(m =>
    m.username === username && m.password === password
  );

  if (!member) {
    alert("Login gagal. Periksa username dan password.");
    return false;
  }

  sessionStorage.setItem("ktaSession", member.username);
  tampilkanKartu(member);
  alert("Login berhasil. Selamat datang, " + member.nama + "!");

  return false;
}

function tampilkanKartu(member) {
  const target = document.getElementById("kartuAnggota")
    || document.getElementById("hasilKartu")
    || document.getElementById("memberCard");

  if (!target) {
    alert("Login berhasil, tetapi area kartu belum tersedia di HTML.");
    return;
  }

  const bars = Array.from(member.nomor).map((char, i) => {
    const lebar = (char.charCodeAt(0) % 3) + 1;
    return `<span style="display:inline-block;width:${lebar}px;height:34px;background:#111;margin-right:2px"></span>`;
  }).join("");

  target.innerHTML = `
    <div style="background:#111;color:white;border:3px solid #c62828;
      border-radius:14px;padding:20px;max-width:420px;
      font-family:Arial,sans-serif;text-align:center">
      <div style="color:#fff;font-size:12px;letter-spacing:2px">
        PI NETWORK BALI
      </div>
      <h2 style="margin:12px 0;color:#fff">KARTU TANDA ANGGOTA</h2>
      <div style="background:#c62828;height:4px;margin:12px 0"></div>
      <div style="font-size:12px;color:#ddd">NAMA ANGGOTA</div>
      <h3>${escapeHTML(member.nama)}</h3>
      <div style="font-size:12px;color:#ddd">NOMOR ID</div>
      <p>${escapeHTML(member.nomor)}</p>
      <div style="background:white;padding:8px;display:inline-block">
        ${bars}
      </div>
      <p style="font-size:10px;color:#ddd">ANGGOTA PI NETWORK BALI</p>
    </div>`;

  target.style.display = "block";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function logout() {
  sessionStorage.removeItem("ktaSession");
  alert("Anda telah logout.");
  location.reload();
}
