const fs = require('fs'), path = require('path');
const shorts = JSON.parse(fs.readFileSync(path.join(process.cwd(),'shorts.json'),'utf-8'))
const template = fs.readFileSync(path.join(process.cwd(),'template.html'),'utf-8');
for (const idx in shorts) {
  let val = shorts[idx];
  if (typeof val === 'string')
    val = {
      "target": val,
    };
  val = {
    "target": "https://github.com/YieldingExploiter/ur-short",
    "title": `Short URL | ${val}`,
    "description": `This link goes to ${val}`,
    "icon": "",
    "themecolor": "#1a1a1a",
    ...val,
  }
  for (const subIdx in val) {
    template = template.split(subIdx.toUpperCase()).join(val[subIdx])
  }
}
