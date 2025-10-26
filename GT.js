// --- Hàm bỏ dấu tiếng Việt để tạo ID dễ đọc ---
function slugVN(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');
}

// ============================
//  MỤC LỤC TỰ ĐỘNG (H2–H4) — <ol> lồng nhau
// ============================

// Bỏ dấu TV để tạo slug ID
function slugVN(str) {
  return (str || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

// Gán ID duy nhất cho heading
function ensureId(el) {
  if (el.id && el.id.trim()) return el.id;
  const base = slugVN(el.textContent || el.innerText || "muc");
  let id = base || "muc", i = 2;
  while (document.getElementById(id)) id = `${base}-${i++}`;
  el.id = id; return id;
}

function buildTOC() {
  const content =
    document.getElementById("ftwp-postcontent") ||
    document.querySelector(".entry-content.single-page") ||
    document.querySelector(".post");
  if (!content) return;

  // Tạo/ghi đè nav#toc ngay trước nội dung
  let toc = document.getElementById("toc");
  if (!toc) {
    toc = document.createElement("nav");
    toc.id = "toc";
    content.parentNode.insertBefore(toc, content);
  } else {
    toc.innerHTML = "";
  }

  const title = document.createElement("h3");
  title.textContent = "Mục lục";
  toc.appendChild(title);

  const headings = Array.from(content.querySelectorAll("h2, h3, h4"));
  if (!headings.length) return;

  // Danh sách gốc (ứng với H2)
  const rootOl = document.createElement("ol");
  rootOl.className = "toc-list";
  toc.appendChild(rootOl);

  // Stack quản lý <ol> theo cấp: index 0 = H2
  const stack = [rootOl];
  let currentLevel = 2;

  headings.forEach(h => {
    let level = parseInt(h.tagName.slice(1), 10);
    if (level < 2) level = 2;
    if (level > 4) level = 4;

    const id = ensureId(h);

    // Nếu nhảy lên cấp (H2→H4…), tạo dần các <ol> con
    while (currentLevel < level) {
      const parentOl = stack[stack.length - 1];
      let lastLi = parentOl.lastElementChild;
      if (!lastLi) { // nếu chưa có mục cha, tạo mục rỗng giữ chỗ
        lastLi = document.createElement("li");
        parentOl.appendChild(lastLi);
      }
      const newOl = document.createElement("ol");
      lastLi.appendChild(newOl);
      stack.push(newOl);
      currentLevel++;
    }

    // Nếu lùi cấp (H4→H3…), pop stack
    while (currentLevel > level && stack.length > 1) {
      stack.pop();
      currentLevel--;
    }

    // Tạo mục
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = (h.textContent || "").replace(/\s+/g, " ").trim();
    li.appendChild(a);

    stack[stack.length - 1].appendChild(li);
  });

  // Cuộn mượt
  toc.addEventListener("click", e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", link.getAttribute("href"));
  });
}

document.addEventListener("DOMContentLoaded", buildTOC);
