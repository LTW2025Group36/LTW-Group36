// ---------- tạo slug không dấu cho id ----------
function slugify(text){
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // bỏ dấu tiếng Việt
    .toLowerCase()
    .replace(/[^a-z0-9\s\-\.]/g,'')                  // bỏ ký tự lạ
    .trim()
    .replace(/\s+/g,'-');                            // khoảng trắng -> gạch
}

// ---------- sinh mục lục tự động cho h2/h3 ----------
function buildTOC(){
  const wrap  = document.getElementById('toc_content');
  const scope = document.getElementById('main-content'); // nơi chứa nội dung
  if(!wrap || !scope) return;

  const headings = scope.querySelectorAll('h2, h3');
  if(!headings.length){
    wrap.innerHTML = '<em>Không có mục nào.</em>';
    return;
  }

  const root = document.createElement('ul');
  let h2i = 0, h3i = 0;              // bộ đếm 1, 1.1 ...
  let currentH2Ul = null;            // danh sách con của H2
  const map = [];                    // dùng cho highlight khi cuộn

  headings.forEach(h => {
    if(!h.id) h.id = slugify(h.textContent);

    // H2
    if(h.tagName === 'H2'){
      h2i++; h3i = 0;

      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = '#'+h.id;
      a.textContent = `${h2i}. ${h.textContent}`;  // số + tiêu đề trên cùng 1 dòng
      li.appendChild(a);
      root.appendChild(li);

      // danh sách con cho các H3 thuộc H2 này
      currentH2Ul = document.createElement('ul');
      li.appendChild(currentH2Ul);

      map.push({ id: h.id, li });
    }
    // H3
    else{
      if(!currentH2Ul) return; // phòng trường hợp h3 đứng đầu
      h3i++;

      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = '#'+h.id;
      a.textContent = `${h2i}.${h3i} ${h.textContent}`;
      li.appendChild(a);
      currentH2Ul.appendChild(li);

      map.push({ id: h.id, li });
    }
  });

  wrap.innerHTML = '';
  wrap.appendChild(root);

  // --- click cuộn mượt + cập nhật URL hash ---
  wrap.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
      history.replaceState(null,'','#'+id);
    });
  });

  // --- highlight mục đang xem khi cuộn ---
  const onScroll = () => {
    let currentId = null;
    map.forEach(({id})=>{
      const el = document.getElementById(id);
      if(el && el.getBoundingClientRect().top - 90 <= 0) currentId = id;
    });
    map.forEach(({id, li}) => li.classList.toggle('active', id === currentId));
  };
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll(); // chạy lần đầu
}

document.addEventListener('DOMContentLoaded', buildTOC);
