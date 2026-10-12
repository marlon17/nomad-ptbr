// Gera dist/ptbr.js a partir de traducao/pt-BR.json + src/ptbr-runtime.js.
// Uso: node tools/build.js
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const fonte = JSON.parse(fs.readFileSync(path.join(root, 'traducao', 'pt-BR.json'), 'utf8'))
const textosEn = JSON.parse(fs.readFileSync(path.join(root, 'traducao', 'textos-en.json'), 'utf8'))

const norm = (s) => s.replace(/\s+/g, ' ').trim()
const ph = (s) => (s.match(/\{\d+\}/g) || []).sort().join(',')

const dict = {}
const problemas = []
for (const [en, pt] of Object.entries(fonte)) {
  if (typeof pt !== 'string') continue
  if (ph(en) !== ph(pt)) {
    problemas.push(`placeholders diferentes: ${JSON.stringify(en)} -> ${JSON.stringify(pt)}`)
    continue
  }
  dict[norm(en)] = norm(pt)
}

const faltando = Object.keys(textosEn).filter((k) => !(norm(k) in dict))
const runtime = fs.readFileSync(path.join(root, 'src', 'ptbr-runtime.js'), 'utf8')
fs.mkdirSync(path.join(root, 'dist'), { recursive: true })
fs.writeFileSync(path.join(root, 'dist', 'ptbr.js'), 'window.__NOMAD_PTBR_DICT=' + JSON.stringify(dict) + ';\n' + runtime)

const traduzidas = Object.entries(dict).filter(([k, v]) => k !== v).length
console.log(`dicionario: ${Object.keys(dict).length} entradas (${traduzidas} traduzidas)`)
console.log(`textos extraidos sem traducao: ${faltando.length}`)
faltando.slice(0, 30).forEach((k) => console.log('  - ' + k))
problemas.forEach((p) => console.log('AVISO ' + p))
