// Admin dashboard script

(function(){
  const USERNAME = 'admin';
  // SHA-256 hash of strong password 'Sp0tiDeals!2025' (hex)
  const PWD_HASH = '4e3b5c7364a2abaf7b9f2e5a4dcaad419acf680cfb9fc5f3867be3c7eca7123d';

  const qs = sel => document.querySelector(sel);
  const qsa = sel => [...document.querySelectorAll(sel)];

  const loginCard = qs('#login-card');
  const dash = qs('#dashboard');
  const loginBtn = qs('#login-btn');
  const errMsg = qs('#login-error');

  // ===================== Auth =====================
  async function sha256(str){
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function doLogin(){
    const user = qs('#user').value.trim();
    const pass = qs('#pass').value;
    const hash = await sha256(pass);
    if(user===USERNAME && hash===PWD_HASH){
      sessionStorage.setItem('sdAdmin','ok');
      renderDashboard();
    }else{
      errMsg.style.display='block';
    }
  }
  loginBtn?.addEventListener('click',e=>{e.preventDefault();doLogin();});
  qs('#pass')?.addEventListener('keyup',e=>{if(e.key==='Enter') doLogin();});

  if(sessionStorage.getItem('sdAdmin')==='ok'){
    renderDashboard();
  }

  // =================== Dashboard ==================
  function renderDashboard(){
    loginCard.style.display='none';
    dash.style.display='block';
    loadTable();
  }

  // CONFIG - constants
  const API_URL = '/airtable'; // Cloudflare Worker proxy
  const EMAIL_SERVICE  = 'service_ajkhda1';
  const EMAIL_TEMPLATE = 'commande_status';

  /* small helper to respect Airtable 5 req/s limit */
  const sleep = ms => new Promise(r=>setTimeout(r, ms));

  /* Remote fetch – Airtable proxy */
  async function fetchOrdersRemote(){
    try{
      const r = await fetch(API_URL);
      if(!r.ok) throw new Error('API err');
      const json = await r.json();
      return json.records.map(rec=>({id:rec.id,...rec.fields}));
    }catch(e){
      console.warn('Airtable offline, fallback localStorage');
      return null;
    }
  }

  /* LocalStorage fallback */
  function fetchOrdersLocal(){
    const arr=[];
    Object.keys(localStorage).forEach(k=>{
      if(!k.startsWith('SD-')) return;
      try{arr.push({id:k,...JSON.parse(localStorage.getItem(k))});}catch{}
    });
    return arr;
  }

  async function getOrders(){
    const remote = await fetchOrdersRemote();
    const orders = remote ?? fetchOrdersLocal();
    orders.sort((a,b)=> new Date(b.date)-new Date(a.date));
    return orders;
  }

  function loadTable(){
    const tbody = qs('#orders-table tbody');
    tbody.innerHTML='';
    const filterVal = qs('#filter').value;
    getOrders().forEach(o=>{
      if(filterVal!=='all' && o.status!==filterVal) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${o.id}</td><td>${o.nom||'-'}</td><td>${o.email||'-'}</td>
        <td><span class="status-badge ${o.status.replace(' ','_')}">${o.status}</span></td>
        <td>${new Date(o.date).toLocaleString()}</td>
        <td class="actions"></td>`;
      const actionsTd = tr.querySelector('.actions');
      ['Livré','Remboursé'].forEach(act=>{
        const btn=document.createElement('button');
        btn.textContent=act;
        btn.addEventListener('click',()=>updateStatus(o.id,act,o.email));
        actionsTd.appendChild(btn);
      });
      tbody.appendChild(tr);
    });
  }

  async function updateStatus(id,status,email){
    await sleep(250);
    try{
      await fetch(API_URL,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({records:[{id,fields:{status}}]})
      });
    }catch(e){
      // fallback local
      const obj = JSON.parse(localStorage.getItem(id)||'{}');
      obj.status=status;
      localStorage.setItem(id,JSON.stringify(obj));
    }
    sendEmail(id,email,status);
    loadTable();
  }

  /* Example createOrder (not used directly in dashboard) */
  async function createOrderAirtable(fields){
    await sleep(250);
    return fetch(API_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({records:[{fields}]})
    });
  }

  // =================== EmailJS (optional) ===================
  function sendEmail(id,email,status){
    if(!window.emailjs) return; // SDK not loaded or not init
    emailjs.send(EMAIL_SERVICE,EMAIL_TEMPLATE,{
      order_id: id,
      client_email: email,
      status: status
    }).catch(console.error);
  }

  // =================== Filters & export ===================
  qs('#filter').addEventListener('change',loadTable);
  qs('#export-btn').addEventListener('click',exportCSV);
  function exportCSV(){
    const rows = [['ID','Nom','Email','Statut','Date']];
    getOrders().forEach(o=> rows.push([o.id,o.nom||'',o.email||'',o.status,new Date(o.date).toISOString()]));
    const csv = rows.map(r=>r.map(v=>`"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download='orders.csv';a.click();
    URL.revokeObjectURL(url);
  }

  // =================== Logout ===================
  qs('#logout-btn').addEventListener('click',()=>{
    sessionStorage.removeItem('sdAdmin');
    location.reload();
  });
})(); 