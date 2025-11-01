// ====== VALIDATION ======
const $ = (s)=>document.querySelector(s);
const notice = $('#notice');
const form = $('#contactForm');

const rules = {
  name: v => v.trim().length >= 2,
  email: v => /^\S+@\S+\.\S+$/.test(v),
  phone: v => /^[0-9()+\-\s]{8,20}$/.test(v),
  subject: v => v.trim().length > 0,
  message: v => v.trim().length > 0
};

function showErr(id, show){
  const el = $('#err-'+id);
  if(!el) return;
  el.style.display = show ? 'block' : 'none';
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  notice.style.display='none';
  const data = Object.fromEntries(new FormData(form).entries());

  // Validate
  let ok = true;
  for (const [key, validate] of Object.entries(rules)){
    const valid = validate(data[key] || '');
    showErr(key, !valid);
    if(!valid) ok = false;
  }
  if(!ok) return;

  // ====== SUBMIT ======
  try{
    // Giả lập gửi dữ liệu
    await new Promise(r=>setTimeout(r,400));

    // Hiển thị thông báo & reset form
    notice.textContent = 'Đã gửi liên hệ thành công! Chúng tôi sẽ phản hồi qua ' + data.email + '.';
    notice.style.display='block';
    form.reset();

    // Nếu có backend thật:
    /*
    const res = await fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('Submit failed');
    */
  }catch(err){
    alert('Xin lỗi, gửi liên hệ chưa thành công. Vui lòng thử lại sau!');
    console.error(err);
  }
});
