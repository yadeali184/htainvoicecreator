let currentTemplate = 1;
let items = [{desc:'', qty:1, rate:0}];
let logoDataUrl = null;

const templates = {
    1:{primary:'#1a1a2e',secondary:'#16213e',accent:'#e94560',altRow:'#f8f9fc'},
    2:{primary:'#1d6fa5',secondary:'#154f78',accent:'#f0a500',altRow:'#f0f7ff'},
    3:{primary:'#2d7a4f',secondary:'#1e5235',accent:'#f9a825',altRow:'#f0faf4'}
};

function toggleSidebar(){
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

function handleLogo(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
        logoDataUrl = ev.target.result;
        render();
    };
    reader.readAsDataURL(file);
}

function setTemplate(n){
    currentTemplate = n;
    document.querySelectorAll('.tpl-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('tpl'+n).classList.add('active');
    render();
}

function addItem(){
    items.push({desc:'', qty:1, rate:0});
    renderItems();
    render();
}

function removeItem(i){
    if(items.length > 1){
        items.splice(i,1);
        renderItems();
        render();
    }
}

function renderItems(){
    const c = document.getElementById('items-container');
    c.innerHTML = '';
    items.forEach((item,i) => {
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <input value="${item.desc}" placeholder="Description" oninput="items[${i}].desc=this.value;render()">
            <input type="number" value="${item.qty}" min="1" oninput="items[${i}].qty=this.value;render()">
            <input type="number" value="${item.rate}" min="0" oninput="items[${i}].rate=this.value;render()">
            <button onclick="removeItem(${i})" style="color:red;border:none;background:none;cursor:pointer;font-weight:bold;font-size:16px">×</button>
        `;
        c.appendChild(div);
    });
}

function calcTotals(){
    const discPct = parseFloat(document.getElementById('discount').value) || 0;
    const taxPct  = parseFloat(document.getElementById('tax').value) || 0;
    let sub = 0;
    items.forEach(it => sub += (parseFloat(it.qty)||0) * (parseFloat(it.rate)||0));
    const discAmt = sub * discPct / 100;
    const afterDisc = sub - discAmt;
    const taxAmt = afterDisc * taxPct / 100;
    const total = afterDisc + taxAmt;
    return {sub, discAmt, taxAmt, total};
}

function render(){
    const t = templates[currentTemplate];
    const cur = document.getElementById('currency').value;
    const isPaid = document.getElementById('show-paid').checked;
    const sigName = document.getElementById('sig-name').value;
    const sigTitle = document.getElementById('sig-title').value;
    const termsNotes = document.getElementById('terms-notes').value;
    const payMethod = document.getElementById('pay-method').value;
    const website = document.getElementById('from-web').value;
    const toPhone = document.getElementById('to-phone').value;
    const toEmail = document.getElementById('to-email').value;

    const {sub, discAmt, taxAmt, total} = calcTotals();
    const discPct = parseFloat(document.getElementById('discount').value)||0;
    const taxPct  = parseFloat(document.getElementById('tax').value)||0;

    document.getElementById('sub-disp').innerText   = cur + sub.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    document.getElementById('disc-disp').innerText  = '-'+cur + discAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    document.getElementById('tax-disp').innerText   = cur + taxAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    document.getElementById('total-disp').innerText = cur + total.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

    const fmt = n => cur + parseFloat(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

    const html = `
    <div style="display:flex;flex-direction:column;min-height:1120px;position:relative;font-family:'Segoe UI',Arial,sans-serif;">

        ${isPaid ? `<div style="position:absolute;top:38%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);border:8px solid #2d7a4f;color:#2d7a4f;font-size:clamp(40px,10vw,90px);font-weight:900;padding:10px 30px;opacity:0.12;z-index:100;border-radius:15px;pointer-events:none;white-space:nowrap;">PAID</div>` : ''}

        <!-- HEADER -->
        <div style="background:${t.primary};color:#fff;padding:clamp(25px,5vw,50px) clamp(20px,5vw,40px);display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:15px;-webkit-print-color-adjust:exact;">
            <div style="max-width:60%;min-width:180px;">
                ${logoDataUrl ? `<img src="${logoDataUrl}" style="max-height:60px;max-width:160px;object-fit:contain;margin-bottom:12px;display:block;border-radius:4px;">` : ''}
                <h1 style="margin:0;font-size:clamp(16px,3vw,26px);font-weight:800;color:#fff;">${document.getElementById('from-name').value || 'Your Company Name'}</h1>
                <p style="font-size:clamp(10px,1.5vw,13px);line-height:1.6;margin-top:8px;color:rgba(255,255,255,0.85);">${document.getElementById('from-addr').value.replace(/\n/g,'<br>') || 'Your Address'}</p>
                <p style="font-size:clamp(10px,1.5vw,12px);color:rgba(255,255,255,0.85);margin-top:6px;">
                    ${document.getElementById('from-phone').value || ''} ${document.getElementById('from-phone').value && document.getElementById('from-email').value ? '|' : ''} ${document.getElementById('from-email').value || ''}
                </p>
                ${website ? `<p style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;">${website}</p>` : ''}
            </div>
            <div style="text-align:right;min-width:140px;">
                <h2 style="font-size:clamp(28px,6vw,48px);margin:0;font-weight:900;letter-spacing:2px;color:#fff;">INVOICE</h2>
                <div style="background:${t.accent};color:#fff;display:inline-block;padding:5px 15px;border-radius:4px;font-weight:800;margin-top:10px;font-size:clamp(11px,1.5vw,14px);-webkit-print-color-adjust:exact;">
                    NO: ${document.getElementById('inv-num').value || 'INV-001'}
                </div>
                ${payMethod ? `<p style="font-size:11px;color:rgba(255,255,255,0.8);margin-top:8px;">Payment: ${payMethod}</p>` : ''}
            </div>
        </div>

        <!-- BILL TO + DATES -->
        <div style="padding:clamp(20px,4vw,40px);flex-grow:1;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px;margin-bottom:clamp(20px,4vw,40px);background:#f8f9fc;padding:20px;border-radius:10px;">
                <div>
                    <h4 style="color:${t.primary};text-transform:uppercase;font-size:10px;font-weight:800;margin-bottom:8px;letter-spacing:1px;">Bill To</h4>
                    <p style="font-weight:800;font-size:clamp(14px,2.5vw,18px);color:#1a1a2e;margin:0;">${document.getElementById('to-name').value || 'Client Name'}</p>
                    <p style="font-size:13px;color:#555;margin-top:5px;line-height:1.5;">${document.getElementById('to-addr').value.replace(/\n/g,'<br>') || ''}</p>
                    ${toPhone ? `<p style="font-size:12px;color:#777;margin-top:4px;">📞 ${toPhone}</p>` : ''}
                    ${toEmail ? `<p style="font-size:12px;color:#777;margin-top:2px;">✉ ${toEmail}</p>` : ''}
                </div>
                <div style="text-align:right;min-width:160px;">
                    <div style="margin-bottom:8px;">
                        <span style="font-size:10px;font-weight:800;text-transform:uppercase;color:#999;letter-spacing:1px;">Invoice Date</span><br>
                        <span style="font-size:14px;font-weight:700;color:#1a1a2e;">${document.getElementById('inv-date').value || '—'}</span>
                    </div>
                    <div>
                        <span style="font-size:10px;font-weight:800;text-transform:uppercase;color:#999;letter-spacing:1px;">Due Date</span><br>
                        <span style="font-size:14px;font-weight:700;color:${t.accent};">${document.getElementById('due-date').value || '—'}</span>
                    </div>
                </div>
            </div>

            <!-- TABLE -->
            <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">
                <table style="width:100%;border-collapse:collapse;min-width:380px;">
                    <thead>
                        <tr style="background:${t.secondary};color:#fff;-webkit-print-color-adjust:exact;">
                            <th style="padding:clamp(8px,2vw,14px) clamp(10px,2vw,16px);text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Description</th>
                            <th style="padding:clamp(8px,2vw,14px) 8px;text-align:center;font-size:11px;text-transform:uppercase;width:50px;">Qty</th>
                            <th style="padding:clamp(8px,2vw,14px) 8px;text-align:right;font-size:11px;text-transform:uppercase;width:90px;">Rate</th>
                            <th style="padding:clamp(8px,2vw,14px) clamp(10px,2vw,16px);text-align:right;font-size:11px;text-transform:uppercase;width:100px;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((it,i) => `
                        <tr style="background:${i%2===0?'#fff':t.altRow};border-bottom:1px solid #edf0f5;-webkit-print-color-adjust:exact;">
                            <td style="padding:clamp(8px,2vw,14px) clamp(10px,2vw,16px);font-size:clamp(11px,1.5vw,14px);color:#1a1a2e;font-weight:500;">${it.desc||'—'}</td>
                            <td style="padding:clamp(8px,2vw,14px) 8px;font-size:clamp(11px,1.5vw,13px);text-align:center;color:#555;">${it.qty}</td>
                            <td style="padding:clamp(8px,2vw,14px) 8px;font-size:clamp(11px,1.5vw,13px);text-align:right;color:#555;">${fmt(it.rate)}</td>
                            <td style="padding:clamp(8px,2vw,14px) clamp(10px,2vw,16px);font-size:clamp(11px,1.5vw,14px);text-align:right;font-weight:700;color:#1a1a2e;">${fmt(it.qty*it.rate)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>

            <!-- TOTALS -->
            <div style="display:flex;justify-content:flex-end;margin-top:25px;">
                <div style="width:clamp(220px,40%,300px);">
                    <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #eee;color:#555;">
                        <span>Subtotal</span><span>${fmt(sub)}</span>
                    </div>
                    ${discPct > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #eee;color:#e94560;">
                        <span>Discount (${discPct}%)</span><span>-${fmt(discAmt)}</span>
                    </div>` : ''}
                    ${taxPct > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #eee;color:#555;">
                        <span>Tax (${taxPct}%)</span><span>${fmt(taxAmt)}</span>
                    </div>` : ''}
                    <div style="display:flex;justify-content:space-between;font-weight:800;font-size:clamp(16px,2.5vw,20px);color:${t.primary};padding:10px 0;border-top:3px solid ${t.primary};margin-top:4px;">
                        <span>Total Due</span><span>${fmt(total)}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- FOOTER -->
        <div style="padding:clamp(20px,4vw,40px);border-top:1px solid #eee;background:#fafafa;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:25px;">
                <div style="flex:1;min-width:200px;">
                    <h4 style="font-size:10px;font-weight:800;text-transform:uppercase;color:${t.primary};margin-bottom:8px;letter-spacing:1px;">Terms & Notes</h4>
                    <p style="font-size:12px;line-height:1.7;${termsNotes?'color:#555;':'color:#bbb;font-style:italic;'}">
                        ${termsNotes || 'Add your payment terms, bank details, or notes here...'}
                    </p>
                </div>
                <div style="text-align:center;min-width:180px;">
                    <div style="font-family:'Brush Script MT',cursive;font-size:clamp(22px,4vw,32px);color:#1a1a2e;margin-bottom:6px;min-height:40px;">${sigName||''}</div>
                    <div style="border-top:2px solid #1a1a2e;padding-top:6px;">
                        <div style="font-size:12px;font-weight:800;text-transform:uppercase;color:#1a1a2e;letter-spacing:1px;">Authorized Signature</div>
                        ${sigTitle ? `<div style="font-size:11px;color:#777;margin-top:3px;">${sigTitle}</div>` : ''}
                    </div>
                </div>
            </div>
            <div style="margin-top:25px;text-align:center;font-size:10px;color:#ccc;text-transform:uppercase;letter-spacing:2px;font-weight:600;">
                Generated by HTA Free Invoice Creator
            </div>
        </div>
    </div>`;

    document.getElementById('invoice-preview').innerHTML = html;
}

function downloadPDF(){
    const invNum = document.getElementById('inv-num').value || "INV";
    const clientName = document.getElementById('to-name').value || "Client";
    const orig = document.title;
    document.title = `${invNum} - ${clientName}`;
    window.print();
    setTimeout(()=>{ document.title = orig; }, 100);
}

// INIT
const today = new Date().toISOString().split('T')[0];
document.getElementById('inv-date').value = today;
document.getElementById('due-date').value = today;
renderItems();
render();