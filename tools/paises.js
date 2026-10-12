// Gera traducao/paises.json: nomes de países do NOMAD (Natural Earth) -> nomes em pt-BR.
// Usa o código ISO de cada país com Intl.DisplayNames('pt-BR'); se não houver código, usa NAME_PT.
// Uso: node tools/paises.js <caminho do project-nomad>
const fs = require('fs')
const path = require('path')

const nomad = process.argv[2] || path.join(__dirname, '..', '..', 'project-nomad')
const geo = JSON.parse(
  fs.readFileSync(path.join(nomad, 'admin', 'resources', 'geodata', 'ne_50m_admin_0_countries.geojson'), 'utf8')
)
const nomes = new Intl.DisplayNames(['pt-BR'], { type: 'region' })

const out = {}
for (const f of geo.features) {
  const p = f.properties
  const codigos = [p.ISO_A2, p.ISO_A2_EH].filter((c) => typeof c === 'string' && /^[A-Z]{2}$/.test(c))
  let pt = null
  for (const c of codigos) {
    const n = nomes.of(c)
    if (n && n !== c) {
      pt = n
      break
    }
  }
  pt = pt || p.NAME_PT
  if (!pt) continue
  for (const k of ['NAME', 'NAME_LONG']) {
    const en = p[k]
    if (en && en !== pt) out[en] = pt
  }
}
const ordenado = Object.fromEntries(Object.entries(out).sort((a, b) => a[0].localeCompare(b[0])))
fs.writeFileSync(path.join(__dirname, '..', 'traducao', 'paises.json'), JSON.stringify(ordenado, null, 1))
console.log(`${Object.keys(ordenado).length} nomes de países`)
