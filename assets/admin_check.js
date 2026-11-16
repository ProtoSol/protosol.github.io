const assert = require("assert");
const {
  slugify,
  buildPost,
  parsePost,
  encodeBase64,
  decodeBase64,
  filenameFor,
} = require("./admin.js");

assert.strictEqual(slugify("Hello World!"), "hello-world");
assert.strictEqual(
  slugify("Creation of the Portfolio Website"),
  "creation-of-the-portfolio-website",
);
assert.strictEqual(slugify("???"), "");

const raw = buildPost({
  title: 'Say "hi"',
  categories: "Notes",
  date: "2026-10-19 09:00:00 +0000",
  published: false,
  body: "Body line\n",
});
assert.ok(raw.startsWith("---\nlayout: post\n"));
assert.ok(raw.includes('title: "Say \\"hi\\""'));
assert.ok(raw.includes("categories: Notes"));
assert.ok(raw.includes("published: false"));

const parsed = parsePost(raw);
assert.strictEqual(parsed.title, 'Say "hi"');
assert.strictEqual(parsed.categories, "Notes");
assert.strictEqual(parsed.date, "2026-10-19 09:00:00 +0000");
assert.strictEqual(parsed.published, false);
assert.strictEqual(parsed.body, "Body line\n");

const publishedRaw = buildPost({
  title: "Live",
  categories: "",
  date: "2026-10-19 09:00:00 +0000",
  published: true,
  body: "Up",
});
assert.ok(!publishedRaw.includes("categories:"));
assert.ok(!publishedRaw.includes("published:"));
const published = parsePost(publishedRaw);
assert.strictEqual(published.published, true);
assert.strictEqual(published.categories, "");
assert.strictEqual(published.body, "Up\n");

const existing = parsePost(
  [
    "---",
    "layout: post",
    'title:  "Creation of the Portfolio Website"',
    "date:   2025-12-08 22:17:23 +0000",
    "categories: Technical Project",
    "---",
    "",
    "### Website",
    "",
  ].join("\n"),
);
assert.strictEqual(existing.title, "Creation of the Portfolio Website");
assert.strictEqual(existing.date, "2025-12-08 22:17:23 +0000");
assert.strictEqual(existing.categories, "Technical Project");
assert.strictEqual(existing.published, true);

assert.strictEqual(decodeBase64(encodeBase64("héllo — café")), "héllo — café");
assert.strictEqual(
  filenameFor("2026-10-19 09:00:00 +0000", "Hello World!"),
  "_posts/2026-10-19-hello-world.md",
);

console.log("admin checks ok");
