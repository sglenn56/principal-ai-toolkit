function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderToolCard(tool) {
  return `
    <article class="tool-card">
      <div class="tool-meta">
        <span class="pill">${escapeHtml(tool.category)}</span>
      </div>
      <h3>${escapeHtml(tool.title)}</h3>
      <p class="muted">${escapeHtml(tool.subtitle || "")}</p>
      <p class="small">${escapeHtml(tool.purpose)}</p>
      <a class="btn" href="./tool.html?id=${encodeURIComponent(tool.id)}">Open tool</a>
    </article>
  `;
}

function buildCategoryOptions(tools) {
  const sel = document.getElementById("categorySelect");
  if (!sel) return;

  const cats = Array.from(new Set(tools.map(t => t.category))).sort();
  for (const c of cats) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  }
}

function filterTools(tools, query, category) {
  const q = (query || "").trim().toLowerCase();
  return tools.filter(t => {
    const matchesCategory = category === "all" || t.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;

    const hay = [
      t.title, t.subtitle, t.category, t.purpose,
      ...(t.whenToUse || []), ...(t.whatYouNeed || []),
    ].join(" ").toLowerCase();

    return hay.includes(q);
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

function toolPageHtml(tool) {
  const when = (tool.whenToUse || []).map(i => `<li>${escapeHtml(i)}</li>`).join("");
  const need = (tool.whatYouNeed || []).map(i => `<li>${escapeHtml(i)}</li>`).join("");
  const get = (tool.whatYouGet || []).map(i => `<li>${escapeHtml(i)}</li>`).join("");
  const pitfalls = (tool.pitfalls || []).map(i => `<li>${escapeHtml(i)}</li>`).join("");

  const adjustments = (tool.adjustments || []).map((a, idx) => `
    <div class="adjust-row">
      <div class="adjust-label">${escapeHtml(a.label)}</div>
      <div class="adjust-actions">
        <code class="inline-code" id="adj-${idx}">${escapeHtml(a.text)}</code>
        <button class="btn tiny secondary" data-copy="${escapeHtml(a.text)}">Copy</button>
      </div>
    </div>
  `).join("");

  return `
    <section class="card">
      <div class="tool-title">
        <div>
          <h1>${escapeHtml(tool.title)}</h1>
          <p class="muted">${escapeHtml(tool.subtitle || "")}</p>
        </div>
        <span class="pill">${escapeHtml(tool.category)}</span>
      </div>

      <h2>Purpose</h2>
      <p>${escapeHtml(tool.purpose)}</p>

      <h2>When to Use This Tool</h2>
      <ul>${when}</ul>

      <h2>What You Need to Get Started</h2>
      <ul>${need}</ul>

      <div class="callout">
        <strong>FERPA Reminder:</strong>
        <div class="small">${escapeHtml(tool.ferpaNote || "")}</div>
      </div>
    </section>

    <section class="card">
      <div class="row-between">
        <h2>${escapeHtml(tool.promptTitle || "Copy & Paste Prompt")}</h2>
        <button class="btn secondary" id="copyPromptBtn">Copy prompt</button>
      </div>

      <pre class="prompt" id="promptBox">${escapeHtml(tool.promptText || "")}</pre>
      <div class="small muted">Tip: Review the output and personalize it before sending.</div>
    </section>

    <section class="card">
      <h2>What You'll Get</h2>
      <ul>${get}</ul>
      <div class="small"><strong>Estimated time saved:</strong> ${escapeHtml(tool.timeSaved || "")}</div>
    </section>

    <section class="card">
      <h2>Adjust the Output</h2>
      <p class="muted small">Copy a refinement line and paste it after the draft you generate.</p>
      <div class="adjustments">
        ${adjustments}
      </div>
    </section>

    <section class="card">
      <details>
        <summary><strong>Example Output (Optional)</strong></summary>
        <pre class="example">${escapeHtml(tool.exampleOutput || "")}</pre>
      </details>
    </section>

    <section class="card">
      <h2>Common Pitfalls to Avoid</h2>
      <ul>${pitfalls}</ul>
    </section>

    <section class="card">
      <h2>Where This Fits in Your Day</h2>
      <p>${escapeHtml(tool.whereItFits || "")}</p>
    </section>
  `;
}

function renderRelatedTools(tool, tools) {
  const holder = document.getElementById("relatedTools");
  if (!holder) return;

  const ids = tool.relatedToolIds || [];
  if (!ids.length) {
    holder.innerHTML = `<p class="muted small">Related tools will appear here as you add more.</p>`;
    return;
  }

  const related = tools.filter(t => ids.includes(t.id));
  holder.innerHTML = related.map(t => `
    <a class="related-link" href="./tool.html?id=${encodeURIComponent(t.id)}">
      <div><strong>${escapeHtml(t.title)}</strong></div>
      <div class="small muted">${escapeHtml(t.subtitle || t.category)}</div>
    </a>
  `).join("");
}

function initIndexPage() {
  const tools = window.PRINCIPAL_AI_TOOLS || [];
  const grid = document.getElementById("toolGrid");
  if (!grid) return;

  buildCategoryOptions(tools);

  const input = document.getElementById("searchInput");
  const sel = document.getElementById("categorySelect");

  function update() {
    const filtered = filterTools(tools, input.value, sel.value);
    grid.innerHTML = filtered.map(renderToolCard).join("") || `
      <div class="card subtle">
        <p class="muted">No tools found. Try a different search term.</p>
      </div>
    `;
  }

  input.addEventListener("input", update);
  sel.addEventListener("change", update);
  update();
}

function initToolPage() {
  const tools = window.PRINCIPAL_AI_TOOLS || [];
  const id = qs("id");
  const tool = tools.find(t => t.id === id);

  const host = document.getElementById("toolPage");
  if (!host) return;

  if (!tool) {
    host.innerHTML = `
      <section class="card">
        <h1>Tool not found</h1>
        <p class="muted">Return to the homepage and select a tool.</p>
        <a class="btn" href="./index.html">Back to tools</a>
      </section>
    `;
    return;
  }

  document.title = `Tool | ${tool.title}`;
  host.innerHTML = toolPageHtml(tool);

  const promptBtn = document.getElementById("copyPromptBtn");
  const promptBox = document.getElementById("promptBox");

  promptBtn.addEventListener("click", async () => {
    const ok = await copyToClipboard(tool.promptText || "");
    promptBtn.textContent = ok ? "Copied" : "Copy failed";
    setTimeout(() => (promptBtn.textContent = "Copy prompt"), 1200);
  });

  // Copy buttons for adjustments
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      const ok = await copyToClipboard(text);
      btn.textContent = ok ? "Copied" : "Copy failed";
      setTimeout(() => (btn.textContent = "Copy"), 1200);
    });
  });

  renderRelatedTools(tool, tools);
}

function initShared() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initShared();
  initIndexPage();
  initToolPage();
});

