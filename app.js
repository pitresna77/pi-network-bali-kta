(() => {
  const KEY = "piNetworkBaliKtaDemoMembers";
  const $ = (id) => document.getElementById(id);
  const read = () => { try { const x = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } };
  const status = (id, msg, error=false) => { $(id).textContent=msg; $(id).style.color=error?"#b42318":"#5422a8"; };
  const newId = () => "PIB-" + Math.floor(1000000 + Math.random()*9000000);
  function tab(target) {
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.target===target));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("hidden", p.id!==target));
    status("daftar-status",""); status("login-status","");
  }
  document.querySelectorAll(".tab").forEach(b => b.addEventListener("click",()=>tab(b.dataset.target)));
  function show(member) {
    $("card-nama").textContent=member.nama; $("card-id").textContent=member.id; $("card-domisili").textContent=member.domisili;
    $("card-date").textContent=new Date(member.createdAt).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});
    $("qr-placeholder").title="Ilustrasi untuk ID "+member.id;
    $("kartu-area").classList.remove("hidden"); $("kartu-area").scrollIntoView({behavior:"smooth",block:"start"});
  }
  $("daftar-form").addEventListener("submit", e => {
    e.preventDefault(); if(!e.currentTarget.reportValidity()) return;
    const d=new FormData(e.currentTarget);
    const member={nama:String(d.get("nama")||"").trim(),wa:String(d.get("wa")||"").trim(),email:String(d.get("email")||"").trim().toLowerCase(),domisili:String(d.get("domisili")||"").trim()};
    if(!member.nama||!member.wa||!member.email||!member.domisili){status("daftar-status","Mohon lengkapi semua kolom.",true);return;}
    const list=read();
    if(list.some(m=>m.email===member.email)){status("daftar-status","Email sudah terdaftar di browser ini. Gunakan menu Lihat KTA.",true);tab("login-panel");$("login-email").value=member.email;return;}
    member.id=newId(); member.createdAt=new Date().toISOString(); list.push(member);
    try{localStorage.setItem(KEY,JSON.stringify(list));}catch{status("daftar-status","Penyimpanan browser tidak tersedia.",true);return;}
    e.currentTarget.reset(); status("daftar-status","Berhasil membuat KTA prototipe. Simpan ID Anda: "+member.id); show(member);
  });
  $("login-form").addEventListener("submit", e => {
    e.preventDefault(); const d=new FormData(e.currentTarget); const email=String(d.get("loginEmail")||"").trim().toLowerCase(); const id=String(d.get("loginId")||"").trim().toUpperCase();
    const m=read().find(x=>x.email===email&&x.id.toUpperCase()===id);
    if(!m){status("login-status","Data tidak ditemukan di browser ini. Periksa email dan nomor ID.",true);return;}
    status("login-status","KTA ditemukan."); show(m);
  });
  $("print-card").addEventListener("click",()=>window.print());
  $("hide-card").addEventListener("click",()=>$("kartu-area").classList.add("hidden"));
})();