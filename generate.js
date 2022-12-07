const fs = require('fs-extra'), path = require('path');
const shorts = JSON.parse(fs.readFileSync(path.join(process.cwd(),'shorts.json'),'utf-8'))
const min = require('html-minifier').minify,
  minOpt = {
    collapseWhitespace:true,
    preserveLineBreaks: false,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  }
const pages = path.join(process.cwd(),'_pages');
const template = min(fs.readFileSync(path.join(process.cwd(),'template.html'),'utf-8'),minOpt)
const prohibited = ['links','404']
const errors = [];
for (const idx in shorts) {
  let val = shorts[idx];
  const idxFile = path.join(pages,idx,'index.html')
  const jsonFile = path.join(pages,idx+'.json')
  if (prohibited.includes(idx.toLowerCase())) 
    errors.push(new Error('Prohibited Short URL: '+val))
  else if (fs.existsSync(idxFile))
    errors.push(new Error('Path already exists: ' + idxFile))
  else if (fs.existsSync(jsonFile))
    errors.push(new Error('Path already exists: ' + jsonFile))
  else {
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
      "twittercard": "",
      ...val,
    }
    let linkTemplate = template;
    for (const subIdx in val) {
      linkTemplate = linkTemplate.split(subIdx.toUpperCase()).join(val[subIdx])
    }
    // yes u can directory escape idc
    fs.ensureDirSync(path.join(pages,idx))
    fs.writeFileSync(idxFile,linkTemplate)
    fs.writeFileSync(jsonFile,JSON.stringify(val))
  }
}
if (errors.length > 0) {
  errors.forEach(console.error)
  process.exit(1)
}
fs.writeFileSync(path.join(pages, '404.html'),min(fs.readFileSync(path.join(process.cwd(),'404.html'),'utf-8'),minOpt))

const links = Object.keys(shorts).sort((a,b)=>a-b).map(v=>({
  route: v,
  ...shorts[v]
}))
fs.writeFileSync(path.join(pages, 'links.json'), JSON.stringify(links))
