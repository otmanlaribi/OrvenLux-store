import fs from "fs";
import path from "path";

function walk(d) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      r = r.concat(walk(p));
    } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) {
      r.push(p);
    }
  }
  return r;
}

const patterns = ["getOrders", "getProducts", "@/lib/supabase", "legacyOrderStatusSchema"];
for (const f of walk(".")) {
  const c = fs.readFileSync(f, "utf8");
  const l = c.split(/\r?\n/);
  l.forEach((line, i) => {
    for (const p of patterns) {
      if (line.includes(p)) {
        console.log(`${f}:${i + 1}:[${p}] ${line.trim()}`);
        break;
      }
    }
  });
}