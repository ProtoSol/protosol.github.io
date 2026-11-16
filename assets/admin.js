const REPO = "ProtoSol/protosol.github.io";
const BRANCH = "main";
const TOKEN_KEY = "protosol-admin-token";

function slugify(title) {
  return String(title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function yamlQuote(value) {
  return '"' + String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function unquote(value) {
  const trimmed = String(value).trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\(.)/g, (_, ch) => ch);
  }
  return trimmed;
}

function readFm(frontMatter, key) {
  const match = frontMatter.match(new RegExp("^" + key + ":\\s*(.*)$", "m"));
  return match ? match[1].trim() : "";
}

function buildPost({ title, categories, date, published, body }) {
  const lines = [
    "---",
    "layout: post",
    "title: " + yamlQuote(title),
    "date: " + date,
  ];
  const cats = (categories || "").trim();
  if (cats) lines.push("categories: " + cats);
  if (published === false) lines.push("published: false");
  lines.push("---", "");
  const text = (body || "").replace(/^\n+/, "").replace(/\s+$/, "");
  return lines.join("\n") + "\n" + text + "\n";
}

function parsePost(markdown) {
  const match = String(markdown).match(
    /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/,
  );
  if (!match) {
    return {
      title: "",
      categories: "",
      date: "",
      published: true,
      body: String(markdown),
    };
  }
  const frontMatter = match[1];
  return {
    title: unquote(readFm(frontMatter, "title")),
    categories: readFm(frontMatter, "categories"),
    date: readFm(frontMatter, "date"),
    published: !/^published:\s*false\s*$/m.test(frontMatter),
    body: match[2].replace(/^\n/, ""),
  };
}

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decodeBase64(encoded) {
  const binary = atob(String(encoded).replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    "-" +
    p(d.getUTCMonth() + 1) +
    "-" +
    p(d.getUTCDate()) +
    " " +
    p(d.getUTCHours()) +
    ":" +
    p(d.getUTCMinutes()) +
    ":" +
    p(d.getUTCSeconds()) +
    " +0000"
  );
}

function filenameFor(dateStr, title) {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(String(dateStr).trim());
  const day = match ? match[1] : nowStamp().slice(0, 10);
  return "_posts/" + day + "-" + slugify(title) + ".md";
}

function contentsPath(path) {
  return (
    "/repos/" +
    REPO +
    "/contents/" +
    path.split("/").map(encodeURIComponent).join("/")
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    slugify,
    buildPost,
    parsePost,
    encodeBase64,
    decodeBase64,
    filenameFor,
  };
}

if (typeof document !== "undefined") {
  const $ = (id) => document.getElementById(id);
  const state = { token: "", path: "", sha: "", busy: false };

  function storedToken() {
    return (
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ""
    );
  }

  function keepToken(token, remember) {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  }

  function forgetToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    state.token = "";
  }

  function commitUrl(data) {
    const url = data && data.commit && data.commit.html_url;
    return typeof url === "string" && url.startsWith("https://github.com/")
      ? url
      : "";
  }

  function setStatus(id, message, link) {
    const el = $(id);
    el.textContent = message || "";
    if (link) {
      el.append(" ");
      const a = document.createElement("a");
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "View commit";
      el.append(a);
    }
  }

  function showApp(login) {
    $("signin").hidden = true;
    $("app").hidden = false;
    $("who").textContent = login;
  }

  function showSignin() {
    $("signin").hidden = false;
    $("app").hidden = true;
    $("who").textContent = "";
  }

  async function gh(path, options) {
    const opts = options || {};
    const headers = {
      Authorization: "Bearer " + state.token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (opts.body) headers["Content-Type"] = "application/json";
    const res = await fetch("https://api.github.com" + path, {
      method: opts.method || "GET",
      headers,
      body: opts.body,
    });
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }
    if (!res.ok) {
      const err = new Error((data && data.message) || res.statusText);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function authFailed(err) {
    if (err.status !== 401) return false;
    forgetToken();
    showSignin();
    setStatus("signin-status", "That token was rejected.");
    return true;
  }

  function fillNew() {
    state.path = "";
    state.sha = "";
    $("title").value = "";
    $("categories").value = "";
    $("date").value = nowStamp();
    $("draft").checked = false;
    $("body").value = "";
    $("delete").disabled = true;
    $("file-label").textContent = "New file. The name is chosen when you save.";
    setStatus("save-status", "");
  }

  function fillEditor(path, sha, post) {
    state.path = path;
    state.sha = sha;
    $("title").value = post.title;
    $("categories").value = post.categories;
    $("date").value = post.date || nowStamp();
    $("draft").checked = post.published === false;
    $("body").value = post.body;
    $("delete").disabled = false;
    $("file-label").textContent = path;
  }

  async function loadList() {
    const list = $("post-list");
    list.textContent = "";
    let items = [];
    try {
      items = await gh(contentsPath("_posts") + "?ref=" + BRANCH);
    } catch (err) {
      if (authFailed(err)) return;
      if (err.status !== 404) {
        setStatus("save-status", err.message);
        return;
      }
    }
    if (!Array.isArray(items)) items = [];
    items
      .filter((item) => item.type === "file" && /\.(md|txt)$/.test(item.name))
      .sort((a, b) => (a.name < b.name ? 1 : -1))
      .forEach((item) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = item.name;
        button.addEventListener("click", () => openPost(item.path));
        li.append(button);
        list.append(li);
      });
  }

  async function openPost(path) {
    if (state.busy) return;
    setStatus("save-status", "Opening…");
    try {
      const file = await gh(contentsPath(path) + "?ref=" + BRANCH);
      if (!file.content)
        throw new Error("That file is too large to edit here.");
      fillEditor(file.path, file.sha, parsePost(decodeBase64(file.content)));
      setStatus("save-status", "");
    } catch (err) {
      if (!authFailed(err)) setStatus("save-status", err.message);
    }
  }

  async function signIn(token, remember) {
    state.token = token.trim();
    setStatus("signin-status", "Checking token…");
    try {
      const user = await gh("/user");
      await gh("/repos/" + REPO);
      keepToken(state.token, remember);
      setStatus("signin-status", "");
      showApp(user.login);
      fillNew();
      await loadList();
    } catch (err) {
      if (err.status === 401) forgetToken();
      state.token = "";
      const message =
        err.status === 401 || err.status === 403
          ? "GitHub refused that token for this repository."
          : err.message;
      setStatus("signin-status", message);
    }
  }

  async function savePost(event) {
    event.preventDefault();
    if (state.busy) return;
    const title = $("title").value.trim();
    const slug = slugify(title);
    if (!slug) {
      setStatus("save-status", "Use a title with letters or numbers.");
      return;
    }
    const date = $("date").value.trim();
    const path = state.path || filenameFor(date, title);
    const markdown = buildPost({
      title,
      categories: $("categories").value,
      date,
      published: !$("draft").checked,
      body: $("body").value,
    });
    const payload = {
      message: (state.sha ? "Update post: " : "Add post: ") + title,
      content: encodeBase64(markdown),
      branch: BRANCH,
    };
    if (state.sha) payload.sha = state.sha;
    state.busy = true;
    setStatus("save-status", "Saving…");
    try {
      const data = await gh(contentsPath(path), {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      state.path = data.content.path;
      state.sha = data.content.sha;
      $("delete").disabled = false;
      $("file-label").textContent = state.path;
      await loadList();
      setStatus(
        "save-status",
        "Saved. The live site updates when the Pages workflow finishes.",
        commitUrl(data),
      );
    } catch (err) {
      if (!authFailed(err)) setStatus("save-status", err.message);
    } finally {
      state.busy = false;
    }
  }

  async function deletePost() {
    if (state.busy || !state.path || !state.sha) return;
    if (!confirm("Delete " + state.path + "?")) return;
    state.busy = true;
    setStatus("save-status", "Deleting…");
    try {
      const data = await gh(contentsPath(state.path), {
        method: "DELETE",
        body: JSON.stringify({
          message: "Delete post: " + state.path.split("/").pop(),
          sha: state.sha,
          branch: BRANCH,
        }),
      });
      fillNew();
      await loadList();
      setStatus(
        "save-status",
        "Deleted. The live site updates when the Pages workflow finishes.",
        commitUrl(data),
      );
    } catch (err) {
      if (!authFailed(err)) setStatus("save-status", err.message);
    } finally {
      state.busy = false;
    }
  }

  $("signin-form").addEventListener("submit", (event) => {
    event.preventDefault();
    signIn($("token").value, $("remember").checked);
  });
  $("logout").addEventListener("click", () => {
    forgetToken();
    showSignin();
    setStatus("signin-status", "Logged out.");
  });
  $("new-post").addEventListener("click", fillNew);
  $("import-file").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      const post = parsePost(await file.text());
      fillNew();
      $("title").value = post.title || file.name.replace(/\.[^.]+$/, "");
      $("categories").value = post.categories;
      $("date").value = post.date || nowStamp();
      $("draft").checked = post.published === false;
      $("body").value = post.body;
      setStatus("save-status", "Imported " + file.name + ". Review it, then Save to publish.");
    } catch (err) {
      setStatus("save-status", err.message);
    }
  });
  $("editor").addEventListener("submit", savePost);
  $("delete").addEventListener("click", deletePost);

  const existing = storedToken();
  if (existing) signIn(existing, Boolean(localStorage.getItem(TOKEN_KEY)));
}
