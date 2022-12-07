const fs = require('fs-extra'), path = require('path');
const shorts = JSON.parse(fs.readFileSync(path.join(process.cwd(),'shorts.json'),'utf-8'))
const template = require('html-minifier').minify(fs.readFileSync(path.join(process.cwd(),'template.html'),'utf-8'),{
  collapseWhitespace:true,
  preserveLineBreaks: false,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true
})
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
  let linkTemplate = template;
  for (const subIdx in val) {
    linkTemplate = linkTemplate.split(subIdx.toUpperCase()).join(val[subIdx])
  }
  // yes u can directory escape idc
  fs.ensureDirSync(path.join(process.cwd(),'_pages',idx))
  fs.writeFileSync(path.join(process.cwd(),'_pages',idx,'index.html'),linkTemplate)
}
