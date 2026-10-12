// Varredura ampla: pega qualquer string do código que pareça texto em inglês para o usuário
// (frases e palavras capitalizadas), para cobrir o que o extract.js não pega.
// Uso: node extract-loose.js <saida.json> <pasta> [<pasta> ...]
const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default

const [, , outFile, ...dirs] = process.argv
const found = new Map()

function add(raw, file) {
  const s = raw.replace(/\s+/g, ' ').trim()
  if (s.length < 3 || s.length > 600) return
  if (!/^[A-Z]/.test(s)) return // texto de interface começa com maiúscula
  if (!/[a-z]/.test(s)) return
  if (/[{}<>=;`$\\]|=>|\(\)|\bnull\b|\bundefined\b/.test(s)) return
  if (/^[A-Z][a-zA-Z]+[A-Z][a-zA-Z]*$/.test(s)) return // PascalCase (componentes, tipos)
  if (/^(GET|POST|PUT|DELETE|PATCH|Content-Type|Bearer|Authorization)\b/.test(s)) return
  if (/^\[[\w\s]+\]/.test(s)) return // prefixos de log: [ZimService]
  if (/\.(tsx?|js|json|md|zim|png|svg|webp)$/.test(s)) return
  if (/^[A-Z][\w.-]*:[\w.-]+/.test(s)) return
  const e = found.get(s) || new Set()
  e.add(file)
  found.set(s, e)
}

function scan(file, root) {
  const rel = path.relative(root, file).replace(/\\/g, '/')
  let ast
  try {
    ast = parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['typescript', 'jsx', 'decorators-legacy'] })
  } catch {
    return
  }
  traverse(ast, {
    StringLiteral(p) {
      // Ignora imports, chaves de objeto e chamadas de log
      if (p.parent.type === 'ImportDeclaration' || p.parent.type === 'ExportNamedDeclaration') return
      if (p.parent.type === 'ObjectProperty' && p.parent.key === p.node) return
      const call = p.findParent((x) => x.isCallExpression())
      if (call) {
        const c = call.node.callee
        const obj = c.type === 'MemberExpression' && c.object.type === 'Identifier' ? c.object.name : ''
        if (obj === 'logger' || obj === 'console') return
      }
      add(p.node.value, rel)
    },
    JSXText(p) {
      add(p.node.value, rel)
    },
    TemplateLiteral(p) {
      if (p.parent.type === 'TaggedTemplateExpression') return
      const call = p.findParent((x) => x.isCallExpression())
      if (call) {
        const c = call.node.callee
        const obj = c.type === 'MemberExpression' && c.object.type === 'Identifier' ? c.object.name : ''
        if (obj === 'logger' || obj === 'console') return
      }
      let i = 0
      const text = p.node.quasis
        .map((q, idx) => q.value.cooked + (idx < p.node.expressions.length ? `{${i++}}` : ''))
        .join('')
      if (/[A-Za-z]{3,} [A-Za-z]{2,}/.test(text.replace(/\{\d+\}/g, ''))) add(text, rel)
    },
  })
}

function walk(dir, root) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p, root)
    else if (/\.(tsx|ts)$/.test(f) && !/\.(spec|test|d)\.ts$/.test(f)) scan(p, root)
  }
}

for (const d of dirs) walk(d, d)
const out = {}
for (const [s, files] of [...found.entries()].sort((a, b) => a[0].localeCompare(b[0]))) out[s] = [...files].slice(0, 3).join(', ')
fs.writeFileSync(outFile, JSON.stringify(out, null, 1))
console.log(Object.keys(out).length + ' strings')
