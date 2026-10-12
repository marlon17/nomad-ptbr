// Extrai "frases montadas": elementos JSX cujo conteúdo mistura texto e variáveis,
// ex.: <p>Found {count} new {label}.</p>  ->  "Found {0} new {1}."
// No navegador isso vira vários nós de texto ("Found ", "3", " new ", "files", "."),
// e o tradutor junta tudo para traduzir a frase inteira com a gramática certa.
// Uso: node tools/extract-frases.js <pasta admin/inertia> <saida.json>
const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default

const [, , srcDir, outFile] = process.argv
const frases = new Map()

function scan(file) {
  const rel = path.relative(srcDir, file).replace(/\\/g, '/')
  let ast
  try {
    ast = parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['typescript', 'jsx', 'decorators-legacy'] })
  } catch {
    return
  }
  traverse(ast, {
    JSXElement(p) {
      const kids = p.node.children
      let temTexto = false
      let temExpr = false
      let i = 0
      let partes = ''
      for (const k of kids) {
        if (k.type === 'JSXText') {
          if (/[A-Za-z]/.test(k.value)) temTexto = true
          partes += k.value
        } else if (k.type === 'JSXExpressionContainer') {
          if (k.expression.type === 'JSXEmptyExpression') continue // comentário
          // String fixa dentro de {} vira texto normal
          if (k.expression.type === 'StringLiteral') {
            partes += k.expression.value
            continue
          }
          temExpr = true
          partes += `{${i++}}`
        } else {
          return // tem elementos filhos (<b>, <a>...): não dá para juntar como um bloco de texto
        }
      }
      if (!temTexto || !temExpr) return
      const s = partes.replace(/\s+/g, ' ').trim()
      if (!/[A-Za-z]{2,}.*[A-Za-z]{2,}/.test(s.replace(/\{\d+\}/g, ''))) return
      if (/^\{\d+\}$/.test(s)) return
      const e = frases.get(s) || new Set()
      e.add(rel)
      frases.set(s, e)
    },
  })
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (/\.tsx$/.test(f)) scan(p)
  }
}

walk(srcDir)
const out = {}
for (const [s, files] of [...frases.entries()].sort((a, b) => a[0].localeCompare(b[0]))) out[s] = [...files].slice(0, 3).join(', ')
fs.writeFileSync(outFile, JSON.stringify(out, null, 1))
console.log(`${Object.keys(out).length} frases montadas`)
