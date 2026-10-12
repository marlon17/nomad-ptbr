/* Tradução PT-BR do Project NOMAD (camada de tradução, não oficial).
 * Troca os textos em inglês da Central de Comando pelos equivalentes em português.
 * Dicionários embutidos por tools/build.js:
 *   window.__NOMAD_PTBR_DICT   textos e modelos com {0}, {1}...
 *   window.__NOMAD_PTBR_FRASES frases que o React monta em vários pedaços (texto + variáveis) */
;(function () {
  'use strict'

  // ---- Datas e números no formato brasileiro ----
  // Partes do NOMAD formatam com 'en-US' fixo; troca por 'pt-BR' (só afeta a exibição).
  function fixLocale(l) {
    var first = Array.isArray(l) ? l[0] : l
    if (first === undefined || (typeof first === 'string' && /^en(-|$)/i.test(first))) return 'pt-BR'
    return l
  }
  function wrapIntl(name) {
    var Orig = Intl[name]
    if (!Orig) return
    var W = function (l, o) {
      return new Orig(fixLocale(l), o)
    }
    W.prototype = Orig.prototype
    W.supportedLocalesOf = Orig.supportedLocalesOf
    Intl[name] = W
  }
  try {
    wrapIntl('DateTimeFormat')
    wrapIntl('NumberFormat')
    wrapIntl('RelativeTimeFormat')
    ;[
      [Date.prototype, 'toLocaleString'],
      [Date.prototype, 'toLocaleDateString'],
      [Date.prototype, 'toLocaleTimeString'],
      [Number.prototype, 'toLocaleString'],
    ].forEach(function (pair) {
      var orig = pair[0][pair[1]]
      pair[0][pair[1]] = function (l, o) {
        return orig.call(this, fixLocale(l), o)
      }
    })
  } catch (e) {}

  // ---- Dicionários ----
  function norm(s) {
    return s.replace(/\s+/g, ' ').trim()
  }
  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  // Nas frases montadas uma variável pode render vazio (ex.: sufixo de plural ''), por isso '*'.
  function buildPatterns(src, exactMap, permiteVazio) {
    var grupo = permiteVazio ? '([\\s\\S]*?)' : '([\\s\\S]+?)'
    var list = []
    Object.keys(src).forEach(function (en) {
      var pt = src[en]
      if (!pt || pt === en) return
      if (/\{\d+\}/.test(en)) {
        var order = []
        var re = escapeRe(en).replace(/\\\{(\d+)\\\}/g, function (_, n) {
          order.push(n)
          return grupo
        })
        list.push({
          re: new RegExp('^' + re + '$'),
          order: order,
          pt: pt,
          // padrões com mais texto fixo são mais específicos e são testados primeiro
          weight: en.replace(/\{\d+\}/g, '').length,
        })
      } else if (exactMap) {
        exactMap.set(en, pt)
      }
    })
    list.sort(function (a, b) {
      return b.weight - a.weight
    })
    return list
  }
  function applyPattern(list, key, mapValue) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i].re.exec(key)
      if (!m) continue
      var vals = {}
      list[i].order.forEach(function (n, idx) {
        vals[n] = mapValue ? mapValue(m[idx + 1]) : m[idx + 1]
      })
      return list[i].pt.replace(/\{(\d+)\}/g, function (_, n) {
        return vals[n] !== undefined ? vals[n] : ''
      })
    }
    return null
  }

  var exact = new Map()
  var patterns = buildPatterns(window.__NOMAD_PTBR_DICT || {}, exact, false)
  var frases = buildPatterns(window.__NOMAD_PTBR_FRASES || {}, null, true)
  var cache = new Map()
  var produced = new Set(exact.values())

  function translate(text) {
    var key = norm(text)
    if (!key || !/[A-Za-z]/.test(key) || produced.has(key)) return null
    if (exact.has(key)) return exact.get(key)
    if (cache.has(key)) return cache.get(key)
    var out = applyPattern(patterns, key)
    if (cache.size > 5000) cache.clear()
    cache.set(key, out)
    if (out) produced.add(norm(out))
    return out
  }

  // ---- Nós de texto ----
  // Guarda o texto original (inglês) de cada nó e o último valor que nós escrevemos,
  // para saber quando foi o React que mudou o texto (ex.: um contador atualizou).
  var original = new WeakMap()
  var escrito = new WeakMap()
  function orig(node) {
    if (!escrito.has(node) || node.nodeValue !== escrito.get(node)) original.set(node, node.nodeValue)
    return original.get(node)
  }
  function write(node, value) {
    escrito.set(node, value)
    if (node.nodeValue !== value) node.nodeValue = value
  }
  function keepSpaces(src, t) {
    return src.match(/^\s*/)[0] + t + src.match(/\s*$/)[0]
  }

  // Conteúdo digitado ou gerado pelo usuário/IA não deve ser traduzido.
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, TEXTAREA: 1, NOSCRIPT: 1, KBD: 1, SAMP: 1 }
  function skipNode(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      if (SKIP_TAGS[n.tagName]) return true
      if (n.isContentEditable) return true
      if (n.hasAttribute && n.hasAttribute('data-no-translate')) return true
    }
    return false
  }

  // Frase montada: elemento cujos filhos são todos nós de texto ("Found ", "3", " new files").
  function doPhrase(el) {
    if (!frases.length) return false
    var kids = el.childNodes
    if (kids.length < 2) return false
    for (var i = 0; i < kids.length; i++) if (kids[i].nodeType !== 3) return false
    var partes = []
    for (var j = 0; j < kids.length; j++) partes.push(orig(kids[j]))
    var juntos = partes.join('')
    // Pedaços variáveis que também são textos conhecidos ("Show", "stop") são traduzidos junto.
    var t = applyPattern(frases, norm(juntos), function (v) {
      var tv = v && /[A-Za-z]/.test(v) ? translate(v) : null
      return tv === null ? v : keepSpaces(v, tv)
    })
    if (t === null) return false
    write(kids[0], keepSpaces(juntos, t))
    for (var k = 1; k < kids.length; k++) write(kids[k], '')
    return true
  }

  function doText(node) {
    var parent = node.parentElement
    if (!parent || skipNode(parent)) return
    if (doPhrase(parent)) return
    var v = orig(node)
    if (!v || !/[A-Za-z]/.test(v)) {
      if (node.nodeValue !== v) write(node, v) // desfaz frase que não casa mais
      return
    }
    var t = translate(v)
    write(node, t === null ? v : keepSpaces(v, t))
  }

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt']
  function doAttrs(el) {
    if (skipNode(el)) return
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i])
      if (!v) continue
      var t = translate(v)
      if (t !== null && t !== v) el.setAttribute(ATTRS[i], t)
    }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && el.value) {
      var tv = translate(el.value)
      if (tv !== null) el.value = tv
    }
  }

  function walk(root) {
    if (root.nodeType === 3) return doText(root)
    if (root.nodeType !== 1) return
    doAttrs(root)
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
    var n
    while ((n = tw.nextNode())) {
      if (n.nodeType === 3) doText(n)
      else doAttrs(n)
    }
  }

  // Títulos como "Content Explorer | Project NOMAD - Project NOMAD": traduz cada parte.
  function doTitle() {
    var parts = document.title.split(/( [-|] )/)
    var changed = false
    for (var i = 0; i < parts.length; i += 2) {
      var t = translate(parts[i])
      if (t !== null) {
        parts[i] = t
        changed = true
      }
    }
    var nt = parts.join('')
    if (changed && nt !== document.title) document.title = nt
  }

  // Traduz direto no callback do MutationObserver (microtarefa, antes da tela ser pintada),
  // assim não pisca inglês e funciona mesmo com a aba em segundo plano.
  function start() {
    document.documentElement.setAttribute('lang', 'pt-BR')
    walk(document.body)
    doTitle()
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i]
        if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) if (m.addedNodes[j].isConnected) walk(m.addedNodes[j])
          // nó removido de uma frase montada: refaz a frase com o que sobrou
          if (m.removedNodes.length && m.target.nodeType === 1) doPhrase(m.target)
        } else if (m.target.isConnected) {
          walk(m.target)
        }
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS.concat(['value']),
    })
    // O Inertia troca o <title> inteiro a cada página: observa o <head> todo.
    new MutationObserver(doTitle).observe(document.head, { childList: true, characterData: true, subtree: true })
  }

  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start)
})()
