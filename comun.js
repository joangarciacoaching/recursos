/* Motor común de los recursos de Joan García · Fuerte Sin Estrés
   - Guarda cada resultado en la base de datos (para el resumen diario).
   - Pide nombre y contacto antes de enseñar el resultado.
   - Botón de WhatsApp con el resultado ya escrito. */
var JG = (function(){
  var CONFIG = {
    WHATSAPP: '34624993458',                 // tu número de WhatsApp (con prefijo, sin +)
    INSTAGRAM: 'joangarciacoaching',         // tu usuario de Instagram
    SUPA_URL: 'https://yrklbjiitlrbapdyvyzc.supabase.co',
    SUPA_KEY: 'sb_publishable_7jJtQUKGTmTiT2xnNefgJA_LVx8WJ8n' // clave pública (solo permite AÑADIR resultados)
  };

  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* ---------- Guardar resultado ---------- */
  function guardar(d){
    try{
      var cuerpo = {
        recurso: String(d.recurso || '').slice(0,60),
        nombre: d.nombre ? String(d.nombre).slice(0,100) : null,
        telefono: d.contacto ? String(d.contacto).slice(0,30) : null,
        resultado: d.resultado ? String(d.resultado).slice(0,300) : null,
        puntuacion: (typeof d.puntuacion === 'number' && isFinite(d.puntuacion)) ? Math.round(d.puntuacion) : null,
        datos: d.datos || {}
      };
      return fetch(CONFIG.SUPA_URL + '/rest/v1/recursos_resultados', {
        method: 'POST', keepalive: true,
        headers: {'apikey': CONFIG.SUPA_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'},
        body: JSON.stringify(cuerpo)
      }).catch(function(){});
    }catch(e){ return Promise.resolve(); }
  }

  /* ---------- Avisos y WhatsApp ---------- */
  function aviso(t){
    var el = $('toast');
    if(!el){ el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('on'); setTimeout(function(){ el.classList.remove('on'); }, 2600);
  }
  function urlWhatsApp(texto){ return 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(texto); }
  function urlInstagram(){ return 'https://ig.me/m/' + CONFIG.INSTAGRAM; }

  /* Bloque final de llamada a la acción */
  function cta(o){
    return '<div class="cta"><h3>' + (o.titulo || '¿Quieres que revise tu caso personalmente?') + '</h3>' +
      '<p>' + o.texto + '</p>' +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + urlWhatsApp(o.mensaje) + '">Escribirme por WhatsApp →</a>' +
      '<small>¿Prefieres Instagram? Escríbeme <b>' + o.palabra + '</b> a <a target="_blank" rel="noopener" href="' + urlInstagram() + '">@' + CONFIG.INSTAGRAM + '</a></small></div>';
  }

  /* ---------- Motor de tests ---------- */
  var T = null, R = {}, i = 0, lead = {};

  function visibles(){ return T.preguntas.filter(function(p){ return !p.soloSi || p.soloSi(R); }); }
  function mostrar(id){ ['intro','quiz','cargando','resultado'].forEach(function(s){ var el = $(s); if(el) el.classList.toggle('oculto', s !== id); }); window.scrollTo({top:0, behavior:'smooth'}); }

  function iniciar(cfg){ T = cfg; }
  function empezar(){ i = 0; R = {}; mostrar('quiz'); pintar(); }

  function pintar(){
    var lista = visibles(), total = lista.length + 1;
    $('barra').style.width = (i / total * 100) + '%';
    $('atras').style.visibility = i === 0 ? 'hidden' : 'visible';
    $('error').textContent = '';
    if(i >= lista.length){ return pintarLead(total); }
    var p = lista[i];
    $('paso').textContent = (p.bloque ? p.bloque + ' · ' : '') + 'Pregunta ' + (i + 1) + ' de ' + lista.length;
    var h = '<h2>' + p.t + '</h2>' + (p.ayuda ? '<p class="ayuda">' + p.ayuda + '</p>' : '<div style="height:14px"></div>');
    if(p.tipo === 'datos'){
      var d = R[p.id] || {};
      h += '<div class="campos">' + p.campos.map(function(c){
        return '<div class="campo' + (c.full ? ' full' : '') + '"><label>' + c.label + '</label><input id="c_' + c.id + '" type="number" inputmode="decimal" placeholder="' + (c.ph || '') + '" value="' + (d[c.id] == null ? '' : d[c.id]) + '"></div>';
      }).join('') + '</div>';
    } else {
      var multi = p.tipo === 'multi', val = R[p.id] || (multi ? [] : null);
      h += '<div class="opciones">' + p.ops.map(function(o, k){
        var sel = multi ? val.indexOf(o[0]) > -1 : val === o[0];
        return '<button class="opcion ' + (multi ? 'multi ' : '') + (sel ? 'sel' : '') + '" onclick="JG.elegir(' + k + ')"><span class="check">' + (sel ? '✓' : '') + '</span>' + o[1] + '</button>';
      }).join('') + '</div>';
    }
    $('pregunta').innerHTML = h;
    var sig = $('siguiente'); sig.classList.remove('oculto'); sig.textContent = 'Siguiente';
  }

  function elegir(k){
    var p = visibles()[i], v = p.ops[k][0];
    if(p.tipo === 'multi'){
      var a = R[p.id] || [];
      if(v === 'ninguna') a = a.indexOf('ninguna') > -1 ? [] : ['ninguna'];
      else { a = a.filter(function(x){ return x !== 'ninguna'; }); a = a.indexOf(v) > -1 ? a.filter(function(x){ return x !== v; }) : a.concat([v]); }
      R[p.id] = a; pintar();
    } else { R[p.id] = v; pintar(); setTimeout(siguiente, 220); }
  }

  function siguiente(){
    var lista = visibles();
    if(i >= lista.length){ return enviarLead(); }
    var p = lista[i];
    if(p.tipo === 'datos'){
      var d = {}, ok = true;
      p.campos.forEach(function(c){ var n = parseFloat(String($('c_' + c.id).value).replace(',', '.')); if(!(n >= c.min && n <= c.max)) ok = false; d[c.id] = n; });
      if(!ok){ $('error').textContent = p.errorTxt || 'Revisa los datos.'; return; }
      R[p.id] = d;
    } else if(p.tipo === 'multi'){
      if(!(R[p.id] && R[p.id].length)){ $('error').textContent = 'Marca al menos una opción.'; return; }
    } else if(!R[p.id]){ $('error').textContent = 'Elige una opción para seguir.'; return; }
    i++; pintar();
  }
  function atras(){ if(i > 0){ i--; pintar(); } }

  function pintarLead(total){
    $('paso').textContent = 'Último paso';
    $('barra').style.width = ((total - 1) / total * 100) + '%';
    $('pregunta').innerHTML = '<h2>' + (T.leadTitulo || '¡Listo! ¿A nombre de quién preparo tu resultado?') + '</h2>' +
      '<p class="ayuda">' + (T.leadAyuda || 'Si quieres, después te ayudo a interpretarlo por WhatsApp.') + '</p>' +
      '<div class="campos"><div class="campo full"><label>Tu nombre</label><input id="l_nombre" type="text" autocomplete="given-name" maxlength="100" placeholder="Ej: Carlos" value="' + esc(lead.nombre || '') + '"></div>' +
      '<div class="campo full"><label>Tu WhatsApp o tu usuario de Instagram</label><input id="l_contacto" type="text" autocomplete="tel" maxlength="30" placeholder="Ej: 612 345 678 o @carlos" value="' + esc(lead.contacto || '') + '"></div></div>' +
      '<p class="ayuda" style="font-size:12px">Solo lo uso para enviarte tu resultado y algún consejo. Nada de spam.</p>';
    $('siguiente').textContent = 'Ver mi resultado →';
  }

  function enviarLead(){
    var nombre = ($('l_nombre').value || '').trim(), contacto = ($('l_contacto').value || '').trim();
    if(!nombre){ $('error').textContent = 'Dime tu nombre para preparar tu resultado.'; return; }
    if(contacto.replace(/[\s@+]/g, '').length < 3){ $('error').textContent = 'Déjame tu WhatsApp o tu Instagram.'; return; }
    lead = {nombre: nombre, contacto: contacto};
    mostrar('cargando');
    var textos = T.cargando || ['Analizando tus respuestas…', 'Calculando tu resultado…', 'Preparando tu diagnóstico…'];
    var t = 0, iv = setInterval(function(){ t++; if(t < textos.length) $('cargaTxt').textContent = textos[t]; }, 800);
    var res;
    try { res = T.calcular(R, lead); } catch(e){ console.error(e); res = {html: '<p>Ha habido un error calculando tu resultado. Recarga la página e inténtalo de nuevo.</p>'}; }
    guardar({recurso: T.recurso, nombre: nombre, contacto: contacto, resultado: res.resultado, puntuacion: res.puntuacion, datos: {respuestas: R, extra: res.extra || null}});
    setTimeout(function(){
      clearInterval(iv);
      $('resultado').innerHTML = res.html + '<button class="btn btn-sec" style="margin-top:14px" onclick="location.reload()">↺ Repetir</button>';
      mostrar('resultado');
    }, 2400);
  }

  /* Utilidades de resultado */
  function anillo(valor, color, titulo, etiqueta){
    return '<div class="score"><div class="anillo" style="background:conic-gradient(' + color + ' ' + (valor * 3.6) + 'deg,#2a2a2a 0)"><div class="num"><b>' + valor + '</b><small>de 100</small></div></div>' +
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
  function tiempos(solo, plan){
    return '<div class="tiempos"><div class="tiempo solo"><span>Por tu cuenta, siguiendo como ahora</span><b>' + solo + '</b></div>' +
      '<div class="tiempo plan"><span>Con un plan personalizado por fases</span><b>' + plan + '</b></div></div>';
  }
  function fases(){
    return '<div class="fases">' +
      '<div class="fase"><i>1</i><div><b>Reset Metabólico.</b> Subimos tu energía, tu descanso y tu foco mientras tu cuerpo sale del modo ahorro, y ya empiezas a perder grasa.</div></div>' +
      '<div class="fase"><i>2</i><div><b>Aceleración Metabólica.</b> Con el metabolismo encendido, la grasa baja más rápido comiendo más y entrenando menos días.</div></div>' +
      '<div class="fase"><i>3</i><div><b>Consolidación.</b> Terminas de perder la barriga y aprendes a mantenerlo sin volver a hacer dieta.</div></div></div>';
  }
  function meses(a, b){ return Math.round(a) + '-' + Math.round(b) + ' meses'; }

  return {CONFIG: CONFIG, guardar: guardar, aviso: aviso, cta: cta, urlWhatsApp: urlWhatsApp, iniciar: iniciar, empezar: empezar, elegir: elegir, siguiente: siguiente, atras: atras,
    anillo: anillo, barra: barra, lista: lista, acciones: acciones, tiempos: tiempos, fases: fases, meses: meses, esc: esc};
})();
