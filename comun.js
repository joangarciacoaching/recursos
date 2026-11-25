/* Motor común de los recursos de Joan García · Fuerte Sin Estrés (v2)
   - Test por páginas (un bloque por página), sin preguntas obligatorias salvo las marcadas.
   - «No lo sé» cuenta como información: sale en «Tus puntos ciegos».
   - Sin pedir datos de contacto: pantalla «Tu resultado está listo» y un único botón de WhatsApp con el diagnóstico escrito.
   - Guarda cada resultado y cada inicio para el resumen diario. */
var JG = (function(){
  var CONFIG = {
    WHATSAPP: '34624993458',                 // tu número de WhatsApp (con prefijo, sin +)
    SUPA_URL: 'https://yrklbjiitlrbapdyvyzc.supabase.co',
    SUPA_KEY: 'sb_publishable_7jJtQUKGTmTiT2xnNefgJA_LVx8WJ8n' // clave pública (solo permite AÑADIR datos)
  };
  var FREQ = [['0','Nunca'],['1','A veces'],['2','Casi siempre'],['3','Siempre']];
  var NS = 'ns';

  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* ---------- Envío a la base de datos ---------- */
  function enviar(tabla, cuerpo){
    try{
      return fetch(CONFIG.SUPA_URL + '/rest/v1/' + tabla, {
        method: 'POST', keepalive: true,
        headers: {'apikey': CONFIG.SUPA_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'},
        body: JSON.stringify(cuerpo)
      }).catch(function(){});
    }catch(e){ return Promise.resolve(); }
  }
  function guardar(d){
    return enviar('recursos_resultados', {
      recurso: String(d.recurso || '').slice(0,60),
      nombre: d.nombre ? String(d.nombre).slice(0,100) : null,
      telefono: d.contacto ? String(d.contacto).slice(0,30) : null,
      resultado: d.resultado ? String(d.resultado).slice(0,300) : null,
      puntuacion: (typeof d.puntuacion === 'number' && isFinite(d.puntuacion)) ? Math.round(d.puntuacion) : null,
      datos: d.datos || {}
    });
  }
  function evento(recurso, ev){ return enviar('recursos_eventos', {recurso: recurso, evento: ev}); }

  function urlWhatsApp(texto){ return 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(texto); }

  /* Bloque final: un único botón de WhatsApp */
  function cta(o){
    return '<div class="cta"><h3>¿Quieres que revise tu caso?</h3>' +
      '<p>Mándame tu resultado y te digo por dónde empezar.</p>' +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + urlWhatsApp(o.mensaje) + '">Envíame tu resultado por WhatsApp →</a>' +
      '<small>Se abre WhatsApp con tu resultado ya escrito. Solo tienes que darle a enviar.</small></div>';
  }

  /* ---------- Motor de tests por páginas ---------- */
  var T = null, R = {}, pag = 0, empezado = false;

  function iniciar(cfg){ T = cfg; }
  function mostrar(id){ ['intro','quiz','cargando','resultado'].forEach(function(s){ var el = $(s); if(el) el.classList.toggle('oculto', s !== id); }); window.scrollTo({top:0, behavior:'smooth'}); }
  function empezar(){
    pag = 0; R = {}; mostrar('quiz'); pintar();
    if(!empezado){ empezado = true; evento(T.recurso, 'inicio'); }
  }
  function totalPags(){ return T.paginas.length + 1; }
  function visibles(p){ return p.preguntas.filter(function(q){ return !q.soloSi || q.soloSi(R); }); }

  function opcionesHTML(q){
    var ops = q.tipo === 'freq' ? FREQ : q.ops;
    if(q.noSe) ops = ops.concat([[NS, q.noSe === true ? 'No lo sé' : q.noSe]]);
    var multi = q.tipo === 'multi', val = R[q.id] || (multi ? [] : null);
    return '<div class="opciones' + (q.tipo === 'freq' ? ' grid' : '') + '">' + ops.map(function(o){
      var sel = multi ? val.indexOf(o[0]) > -1 : val === o[0];
      return '<button type="button" class="opcion ' + (multi ? 'multi ' : '') + (sel ? 'sel ' : '') + (o[0] === NS ? 'ns' : '') + '" onclick="JG.elegir(\'' + q.id + '\',\'' + o[0] + '\')"><span class="check">' + (sel ? '✓' : '') + '</span>' + o[1] + '</button>';
    }).join('') + '</div>';
  }
  function preguntaHTML(q, n){
    var h = '<div class="preg" id="q_' + q.id + '"><p class="preg-t"><span class="num">' + n + '</span>' + q.t + (q.obligatoria ? ' <span class="oblig">*</span>' : '') + '</p>' + (q.ayuda ? '<p class="ayuda">' + q.ayuda + '</p>' : '');
    if(q.tipo === 'datos'){
      var d = R[q.id] || {};
      h += '<div class="campos">' + q.campos.map(function(c){
        return '<div class="campo' + (c.full ? ' full' : '') + '"><label>' + c.label + '</label><input id="c_' + c.id + '" type="number" inputmode="decimal" placeholder="' + (c.ph || '') + '" value="' + (d[c.id] == null ? '' : d[c.id]) + '" oninput="JG.dato(\'' + q.id + '\',\'' + c.id + '\',this.value)"></div>';
      }).join('') + '</div>';
      if(q.noSe){ var nsSel = R[q.id + '_ns'] === NS; h += '<button type="button" class="opcion ns' + (nsSel ? ' sel' : '') + '" style="margin-top:-6px" onclick="JG.elegir(\'' + q.id + '_ns\',\'' + NS + '\')"><span class="check">' + (nsSel ? '✓' : '') + '</span>' + (q.noSe === true ? 'No lo sé' : q.noSe) + '</button>'; }
    } else { h += opcionesHTML(q); }
    return h + '</div>';
  }

  function pintar(){
    var tot = totalPags();
    $('barra').style.width = ((pag + 1) / tot * 100) + '%';
    $('atras').style.visibility = pag === 0 ? 'hidden' : 'visible';
    $('error').textContent = '';
    if(pag >= T.paginas.length){ return pintarLead(); }
    var p = T.paginas[pag];
    $('paso').textContent = 'Bloque ' + (pag + 1) + ' de ' + T.paginas.length + ' · menos de 2 minutos';
    var n = 0;
    $('pregunta').innerHTML = '<h2>' + p.titulo + '</h2>' + (p.sub ? '<p class="ayuda">' + p.sub + '</p>' : '<p class="ayuda">Contesta lo que sepas. Puedes dejar en blanco lo que no.</p>') +
      visibles(p).map(function(q){ n++; return preguntaHTML(q, n); }).join('');
    $('siguiente').textContent = 'Siguiente →';
  }
  function repintarConScroll(){ var y = window.scrollY; pintar(); window.scrollTo(0, y); }

  function elegir(id, v){
    var q = buscar(id.replace(/_ns$/, ''));
    if(/_ns$/.test(id)){ R[id] = R[id] === NS ? undefined : NS; return repintarConScroll(); }
    if(q && q.tipo === 'multi'){
      var a = R[id] || [];
      if(v === 'ninguna') a = a.indexOf('ninguna') > -1 ? [] : ['ninguna'];
      else { a = a.filter(function(x){ return x !== 'ninguna'; }); a = a.indexOf(v) > -1 ? a.filter(function(x){ return x !== v; }) : a.concat([v]); }
      R[id] = a;
    } else { R[id] = R[id] === v ? undefined : v; }
    repintarConScroll();
  }
  function dato(qid, cid, v){ var d = R[qid] || {}; var n = parseFloat(String(v).replace(',', '.')); d[cid] = isNaN(n) ? null : n; R[qid] = d; }
  function buscar(id){ var r = null; T.paginas.forEach(function(p){ p.preguntas.forEach(function(q){ if(q.id === id) r = q; }); }); return r; }

  function siguiente(){
    if(pag >= T.paginas.length){ return verResultado(); }
    var p = T.paginas[pag], falta = null;
    visibles(p).forEach(function(q){
      if(!q.obligatoria || falta) return;
      if(q.tipo === 'datos'){
        var d = R[q.id] || {};
        q.campos.forEach(function(c){ var n = d[c.id]; if(!(n >= c.min && n <= c.max)) falta = q; });
      } else if(!R[q.id]) falta = q;
    });
    if(falta){ $('error').textContent = falta.errorTxt || 'Esta pregunta es necesaria para calcular tu resultado.'; var el = $('q_' + falta.id); if(el) el.scrollIntoView({behavior:'smooth', block:'center'}); return; }
    pag++; pintar(); window.scrollTo({top:0, behavior:'smooth'});
  }
  function atras(){ if(pag > 0){ pag--; pintar(); window.scrollTo({top:0, behavior:'smooth'}); } }

  function pintarLead(){
    $('paso').textContent = 'Listo';
    $('barra').style.width = '100%';
    $('pregunta').innerHTML = '<div class="listo"><div class="listo-ico">✓</div><h2>Tu resultado está listo</h2></div>';
    $('siguiente').textContent = 'Ver mi resultado →';
  }

  function verResultado(){
    mostrar('cargando');
    var textos = T.cargando || ['Analizando tus respuestas…', 'Calculando tu resultado…', 'Preparando tu diagnóstico…'];
    var t = 0, iv = setInterval(function(){ t++; if(t < textos.length) $('cargaTxt').textContent = textos[t]; }, 800);
    var res;
    try { res = T.calcular(R); } catch(e){ console.error(e); res = {html: '<p>Ha habido un error calculando tu resultado. Recarga la página e inténtalo de nuevo.</p>', resumen: ''}; }
    if(res.vacio){
      setTimeout(function(){ clearInterval(iv);
        $('resultado').innerHTML = '<div class="res-bloque"><h2>Necesito un poco más de información</h2><p>Has dejado casi todas las preguntas sin contestar, así que no puedo darte un diagnóstico fiable. Contesta las que sepas (no hace falta todas) y lo tendrás en un minuto.</p></div><button class="btn btn-rojo" onclick="location.reload()">Volver a empezar →</button>';
        mostrar('resultado'); }, 1200);
      return;
    }
    var ciegos = puntosCiegos();
    guardar({recurso: T.recurso, resultado: res.resumen, puntuacion: res.puntuacion, datos: {respuestas: R, ciegos: ciegos.map(function(c){ return c[0]; }), extra: res.extra || null}});
    var mensaje = 'Hola Joan. He hecho tu ' + T.nombre + '. ' + res.resumen + (ciegos.length ? ' No sé: ' + ciegos.map(function(c){ return c[2] || c[0].toLowerCase(); }).join(', ') + '.' : '') + ' ¿Por dónde empiezo?';
    var html = res.html + (ciegos.length ? bloqueCiegos(ciegos) : '') + cta({mensaje: mensaje});
    setTimeout(function(){
      clearInterval(iv);
      $('resultado').innerHTML = html + '<button class="btn btn-sec" style="margin-top:14px" onclick="location.reload()">↺ Repetir</button>';
      mostrar('resultado');
    }, 2200);
  }

  function puntosCiegos(){
    var out = [];
    T.paginas.forEach(function(p){ p.preguntas.forEach(function(q){
      if(q.ciego && (R[q.id] === NS || R[q.id + '_ns'] === NS)) out.push(q.ciego);
    }); });
    return out;
  }
  function bloqueCiegos(c){
    return '<div class="res-bloque"><h3>Tus puntos ciegos</h3><p class="muted" style="margin-bottom:12px">Lo que no conoces de tu cuerpo no lo puedes ajustar. Esto es justo lo que trabajo con mis clientes en la Lectura Metabólica.</p>' +
      '<ul class="errores">' + c.map(function(x){ return '<li class="ciego"><b>👁 ' + x[0] + '</b>' + x[1] + '</li>'; }).join('') + '</ul></div>';
  }

  /* ---------- Utilidades de resultado ---------- */
  function val(v){ return v == null || v === NS ? null : parseInt(v, 10); }
  function anillo(valor, color, titulo, etiqueta, unidad){
    return '<div class="score"><div class="anillo" style="background:conic-gradient(' + color + ' ' + (Math.min(100, valor) * 3.6) + 'deg,#2a2a2a 0)"><div class="num"><b>' + valor + '</b><small>' + (unidad || 'de 100') + '</small></div></div>' +
      '<div><div class="etiqueta" style="color:' + color + '">' + etiqueta + '</div><h2>' + titulo + '</h2></div></div>';
  }
  function barra(label, pct, nota, color){
    return '<div class="barra"><div class="l"><span>' + label + '</span><span>' + nota + '</span></div><div class="t"><div style="width:' + Math.max(3, Math.min(100, pct)) + '%;background:' + (color || 'var(--rojo)') + '"></div></div></div>';
  }
  function lista(items){
    if(!items.length) return '<ul class="errores"><li class="bien"><b>✅ No vemos errores graves</b>Vas por buen camino; lo que te falta es afinar.</li></ul>';
    return '<ul class="errores">' + items.map(function(e){ return '<li><b>❌ ' + e[0] + '</b>' + e[1] + '</li>'; }).join('') + '</ul>';
  }
  function acciones(items){ return '<ol class="acciones">' + items.map(function(t, k){ return '<li><i>' + (k + 1) + '</i><span>' + t + '</span></li>'; }).join('') + '</ol>'; }

  return {CONFIG: CONFIG, FREQ: FREQ, NS: NS, guardar: guardar, evento: evento, cta: cta, urlWhatsApp: urlWhatsApp,
    iniciar: iniciar, empezar: empezar, elegir: elegir, dato: dato, siguiente: siguiente, atras: atras,
    val: val, anillo: anillo, barra: barra, lista: lista, acciones: acciones, esc: esc};
})();
