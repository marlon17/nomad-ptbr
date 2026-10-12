// Gera dist/ptbr.js a partir dos dicionários em traducao/ + src/ptbr-runtime.js.
//   pt-BR.json   textos da interface (prioridade máxima)
//   modelos.json descrições dos modelos de IA (catálogo do Ollama)
//   paises.json  nomes de países (gerado por tools/paises.js)
//   frases.json  frases montadas em pedaços pelo React (extraídas por tools/extract-frases.js)
// Uso: node tools/build.js
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const ler = (f) => {
  const p = path.join(root, 'traducao', f)
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}
}

const norm = (s) => s.replace(/\s+/g, ' ').trim()
const ph = (s) => new Set(s.match(/\{\d+\}/g) || [])
const problemas = []

function montar(fontes, { permiteRemover }) {
  const dict = {}
  // A primeira fonte tem prioridade: aplica em ordem inversa para ela sobrescrever as demais.
  for (const [nome, fonte] of [...fontes].reverse()) {
    for (const [en, pt] of Object.entries(fonte)) {
      if (typeof pt !== 'string') continue
      const a = ph(en)
      const b = ph(pt)
      const extras = [...b].filter((x) => !a.has(x))
      const faltam = [...a].filter((x) => !b.has(x))
      if (extras.length || (faltam.length && !permiteRemover)) {
        problemas.push(`${nome}: placeholders diferentes: ${JSON.stringify(en)} -> ${JSON.stringify(pt)}`)
        continue
      }
      dict[norm(en)] = norm(pt)
    }
  }
  return dict
}

const dict = montar(
  [
    ['pt-BR.json', ler('pt-BR.json')],
    ['modelos.json', ler('modelos.json')],
    ['paises.json', ler('paises.json')],
  ],
  { permiteRemover: false }
)
const frases = montar([['frases.json', ler('frases.json')]], { permiteRemover: true })

const textosEn = ler('textos-en.json')
const faltando = Object.keys(textosEn).filter((k) => !(norm(k) in dict))
const runtime = fs.readFileSync(path.join(root, 'src', 'ptbr-runtime.js'), 'utf8')
fs.mkdirSync(path.join(root, 'dist'), { recursive: true })
fs.writeFileSync(
  path.join(root, 'dist', 'ptbr.js'),
  'window.__NOMAD_PTBR_DICT=' + JSON.stringify(dict) + ';\n' +
    'window.__NOMAD_PTBR_FRASES=' + JSON.stringify(frases) + ';\n' +
    runtime
)

const traduzidas = Object.entries(dict).filter(([k, v]) => k !== v).length
console.log(`dicionario: ${Object.keys(dict).length} entradas (${traduzidas} traduzidas)`)
console.log(`frases montadas: ${Object.keys(frases).length}`)
console.log(`textos extraidos sem traducao: ${faltando.length}`)
faltando.slice(0, 30).forEach((k) => console.log('  - ' + k))
problemas.forEach((p) => console.log('AVISO ' + p))
