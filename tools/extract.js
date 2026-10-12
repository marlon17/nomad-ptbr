// Extrai os textos visiveis (em ingles) das telas do NOMAD para montar o dicionario PT-BR.
// Uso: node extract.js <pasta admin/inertia> <saida.json>
const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default

const [, , srcDir, outFile] = process.argv

// Atributos JSX que nunca sao texto para o usuario.
const SKIP_ATTRS = new Set([
  'className', 'key', 'href', 'to', 'type', 'id', 'name', 'variant', 'size', 'icon', 'color',
  'src', 'target', 'rel', 'method', 'as', 'role', 'htmlFor', 'autoComplete', 'inputMode',
  'value', 'defaultValue', 'style', 'width', 'height', 'viewBox', 'fill', 'stroke', 'd',
  'queryKey', 'mode', 'align', 'side', 'position', 'direction', 'accept', 'pattern', 'step',
  'min', 'max', 'data-testid', 'tabIndex', 'xmlns', 'strokeWidth', 'strokeLinecap',
  'strokeLinejoin', 'lang', 'download', 'loading', 'sizes', 'srcSet', 'iconName', 'buttonType',
])
// Propriedades de objeto que costumam conter texto para o usuario.
const TEXT_PROPS = new Set([
  'title', 'label', 'description', 'message', 'text', 'placeholder', 'subtitle', 'helpText',
  'tooltip', 'heading', 'body', 'confirmText', 'cancelText', 'emptyText', 'summary', 'detail',
  'details', 'hint', 'caption', 'name', 'header', 'friendly_name', 'content', 'error', 'warning', 'info',
])
// Funcoes cujos argumentos de texto aparecem na tela.
const TEXT_CALLS = /^(toast|addNotification|notify|showNotification|showToast|alert|confirm|setError|setMessage|setStatus)$/

const strings = new Map()

function add(raw, file) {
  if (typeof raw !== 'string') return
  const s = raw.replace(/\s+/g, ' ').trim()
  if (!s || s.length < 2) return
  if (!/[A-Za-z]{2}/.test(s)) return
  if (/^[a-z0-9_\-./:]+$/.test(s)) return // identificadores, rotas, chaves
  if (/^[A-Z0-9_]+$/.test(s)) return // CONSTANTES
  if (/^(https?:|\/|#|\.\/|[\w-]+\.(tsx?|js|json|png|svg|zim|webp))/.test(s)) return
  if (/[{}<>;=]/.test(s) && !/[A-Za-z]{3,} [A-Za-z]{2,}/.test(s)) return
  if (/^[\w-]+(\s[\w-]+:[\w-]+)+$/.test(s)) return // classes tailwind
  if (/^(bg|text|border|flex|grid|w|h|p|m|px|py|mt|mb)-/.test(s)) return
  const entry = strings.get(s) || { files: new Set() }
  entry.files.add(file)
  strings.set(s, entry)
}

function addTemplate(node, file) {
  // `Installed (${n})` vira "Installed ({0})" para o tradutor tratar como padrao.
  let i = 0
  const text = node.quasis.map((q, idx) => q.value.cooked + (idx < node.expressions.length ? `{${i++}}` : '')).join('')
  if (node.expressions.length === 0) add(text, file)
  else if (/[A-Za-z]{3,} [A-Za-z]{2,}/.test(text.replace(/\{\d+\}/g, ''))) add(text, file)
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (/\.(tsx|ts)$/.test(f) && !/\.(spec|test|d)\.ts$/.test(f)) scan(p)
  }
}

function scan(file) {
  const rel = path.relative(srcDir, file).replace(/\\/g, '/')
  const code = fs.readFileSync(file, 'utf8')
  let ast
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx', 'decorators-legacy'] })
  } catch (e) {
    console.error('Falha ao ler', rel, e.message)
    return
  }
  traverse(ast, {
    JSXText(p) { add(p.node.value, rel) },
    JSXAttribute(p) {
      const name = p.node.name.name
      if (typeof name !== 'string' || SKIP_ATTRS.has(name) || /^on[A-Z]/.test(name)) return
      const v = p.node.value
      if (!v) return
      if (v.type === 'StringLiteral') add(v.value, rel)
      else if (v.type === 'JSXExpressionContainer') {
        const e = v.expression
        if (e.type === 'StringLiteral') add(e.value, rel)
        else if (e.type === 'TemplateLiteral') addTemplate(e, rel)
        else if (e.type === 'ConditionalExpression') {
          for (const b of [e.consequent, e.alternate]) {
            if (b.type === 'StringLiteral') add(b.value, rel)
            else if (b.type === 'TemplateLiteral') addTemplate(b, rel)
          }
        }
      }
    },
    JSXExpressionContainer(p) {
      if (p.parent.type === 'JSXAttribute') return
      const e = p.node.expression
      if (e.type === 'StringLiteral') add(e.value, rel)
      else if (e.type === 'TemplateLiteral') addTemplate(e, rel)
      else if (e.type === 'ConditionalExpression' || e.type === 'LogicalExpression') {
        for (const b of [e.consequent, e.alternate, e.right]) {
          if (!b) continue
          if (b.type === 'StringLiteral') add(b.value, rel)
          else if (b.type === 'TemplateLiteral') addTemplate(b, rel)
        }
      }
    },
    ObjectProperty(p) {
      const k = p.node.key.name || p.node.key.value
      if (!TEXT_PROPS.has(k)) return
      const v = p.node.value
      if (v.type === 'StringLiteral') add(v.value, rel)
      else if (v.type === 'TemplateLiteral') addTemplate(v, rel)
      else if (v.type === 'ConditionalExpression') {
        for (const b of [v.consequent, v.alternate]) {
          if (b.type === 'StringLiteral') add(b.value, rel)
          else if (b.type === 'TemplateLiteral') addTemplate(b, rel)
        }
      }
    },
    CallExpression(p) {
      const c = p.node.callee
      const name = c.type === 'Identifier' ? c.name : c.type === 'MemberExpression' ? (c.property.name || '') : ''
      const obj = c.type === 'MemberExpression' && c.object.type === 'Identifier' ? c.object.name : ''
      if (!TEXT_CALLS.test(name) && obj !== 'toast') return
      for (const a of p.node.arguments) {
        if (a.type === 'StringLiteral') add(a.value, rel)
        else if (a.type === 'TemplateLiteral') addTemplate(a, rel)
      }
    },
  })
}

walk(srcDir)
const out = {}
for (const [s, e] of [...strings.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  out[s] = [...e.files].sort()
}
fs.writeFileSync(outFile, JSON.stringify(out, null, 2))
console.log(`${Object.keys(out).length} textos extraidos de ${srcDir}`)
