/* Tradução PT-BR do Project NOMAD (camada de tradução, não oficial).
 * Troca os textos em inglês da Central de Comando pelos equivalentes em português,
 * usando o dicionário embutido em window.__NOMAD_PTBR_DICT (gerado por tools/build.js). */
(function () {
  'use strict'
  var dict = window.__NOMAD_PTBR_DICT || {}
  var exact = new Map()
  var patterns = []

  function norm(s) {
    return s.replace(/\s+/g, ' ').trim()
  }
  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  Object.keys(dict).forEach(function (en) {
    var pt = dict[en]
    if (!pt || pt === en) return
    if (/\{\d+\}/.test(en)) {
      // "Installed ({0})" vira uma regex com grupos para os valores dinâmicos.
      var order = []
      var src = escapeRe(en).replace(/\\\{(\d+)\\\}/g, function (_, n) {
        order.push(n)
        return '([\\s\\S]+?)'
      })
      patterns.push({ re: new RegExp('^' + src + '$'), order: order, pt: pt })
    } else {
      exact.set(en, pt)
    }
  })

  var cache = new Map()
  var produced = new Set(exact.values())

  function translate(text) {
    var key = norm(text)
    if (!key || !/[A-Za-z]/.test(key) || produced.has(key)) return null
    if (exact.has(key)) return exact.get(key)
    if (cache.has(key)) return cache.get(key)
    var out = null
    for (var i = 0; i < patterns.length; i++) {
      var m = patterns[i].re.exec(key)
      if (!m) continue
      var vals = {}
      patterns[i].order.forEach(function (n, idx) {
        vals[n] = m[idx + 1]
      })
      out = patterns[i].pt.replace(/\{(\d+)\}/g, function (_, n) {
        return vals[n] !== undefined ? vals[n] : ''
      })
      break
    }
    if (cache.size > 5000) cache.clear()
    cache.set(key, out)
    if (out) produced.add(norm(out))
    return out
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

  function doText(node) {
    var v = node.nodeValue
    if (!v || !/[A-Za-z]/.test(v)) return
    var parent = node.parentElement
    if (!parent || skipNode(parent)) return
    var t = translate(v)
    if (t === null) return
    var lead = v.match(/^\s*/)[0]
    var trail = v.match(/\s*$/)[0]
    var nv = lead + t + trail
    if (nv !== v) node.nodeValue = nv
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
  function enqueue(n) {
    if (n.isConnected) walk(n)
  }

  function start() {
    document.documentElement.setAttribute('lang', 'pt-BR')
    walk(document.body)
    doTitle()
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i]
        if (m.type === 'characterData') enqueue(m.target)
        else if (m.type === 'attributes') enqueue(m.target)
        else for (var j = 0; j < m.addedNodes.length; j++) enqueue(m.addedNodes[j])
      }
      doTitle()
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS.concat(['value']),
    })
    new MutationObserver(doTitle).observe(document.querySelector('title') || document.head, {
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start)
})()
