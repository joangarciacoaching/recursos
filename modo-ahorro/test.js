/* Test: ¿Tu cuerpo está en modo ahorro? (palabra clave ENERGÍA)
   Cada respuesta vale de 0 (bien) a 3 (te frena). Un área cuenta si tiene al menos 2 respuestas. */
var AREAS = [
  {id:'nutricion', nombre:'Nutrición'},
  {id:'sueno', nombre:'Sueño y luz solar'},
  {id:'hormonas', nombre:'Señales hormonales'},
  {id:'estres', nombre:'Estrés y estimulantes'},
  {id:'entreno', nombre:'Entreno y movimiento'}
];
function f(id, area, t){ return {id: id, area: area, tipo: 'freq', t: t}; }
function u(id, area, t, ops){ return {id: id, area: area, tipo: 'una', t: t, ops: ops}; }

var PAGINAS = [
  {titulo: 'Cómo comes y te mueves', preguntas: [
    u('nut1', 'nutricion', '¿Cuánto tiempo del año pasas a dieta o intentando bajar de peso?', [['0','Nunca o casi nunca'],['1','Alguna temporada'],['2','Buena parte del año'],['3','Casi todo el año']]),
    u('nut2', 'nutricion', '¿Quitas o reduces los hidratos (fruta, pan, arroz, patata) para no engordar?', [['0','No, los como sin problema'],['1','A veces, según el día'],['2','Los reduzco bastante'],['3','Casi no los como']]),
    u('nut3', 'nutricion', '¿Haces ayunos o te saltas comidas?', [['0','No'],['1','De vez en cuando'],['2','Varias veces por semana'],['3','Casi todos los días']]),
    u('ent1', 'entreno', '¿Cuántas horas pasas sentado al día?', [['0','Menos de 5 horas'],['1','Entre 5 y 7 horas'],['2','Entre 8 y 10 horas'],['3','Más de 10 horas']]),
    f('ent2', 'entreno', 'El entreno te deja reventado el resto del día.'),
    u('ent3', 'entreno', '¿Cuántos días a la semana haces cardio para quemar calorías?', [['0','Ninguno o solo camino'],['1','1-2 días'],['2','3-4 días'],['3','5 o más']])
  ]},
  {titulo: 'Cómo duermes y vives el día', preguntas: [
    {id:'horas', area:'sueno', tipo:'una', t:'¿Cuántas horas duermes de verdad?', ops:[['3','Menos de 6'],['2','Entre 6 y 7'],['0','Entre 7 y 8'],['0b','Más de 8']], noSe: true,
      ciego: ['Cuánto duermes de verdad', 'Sin saber cuánto descansas, no sabes si tu cuerpo tiene tiempo para recuperarse y fabricar hormonas.', 'cuánto duermo de verdad']},
    u('sue2', 'sueno', '¿A qué hora te sueles acostar?', [['0','Antes de las 23:00'],['1','Entre las 23:00 y las 23:30'],['2','Entre las 23:30 y las 00:30'],['3','Después de las 00:30']]),
    u('sue3', 'sueno', '¿Te da la luz del sol por la mañana?', [['0','Sí, casi todos los días'],['1','Algunos días'],['2','Pocas veces'],['3','Casi nunca']]),
    u('est1', 'estres', '¿Cuántos cafés o estimulantes necesitas para funcionar?', [['0','Ninguno'],['1','1 al día'],['2','2-3 al día'],['3','Más de 3, o bebidas energéticas']]),
    f('est2', 'estres', 'Pasas el día con prisas, estrés o sin desconectar del trabajo.'),
    f('est3', 'estres', 'Miras el móvil en la cama, antes de dormir o nada más despertar.')
  ]},
  {titulo: 'Tu energía y tus hormonas', preguntas: [
    {id:'hor1', area:'hormonas', tipo:'una', t:'Comparado con hace unos años, tus ganas, tu libido y tu empuje están…', ops:[['0','Igual o mejor'],['2','Algo más bajos'],['3','Mucho más bajos']]},
    {id:'hor2', area:'hormonas', tipo:'una', t:'Cuando entrenas fuerza, ¿cómo vas ganando fuerza y músculo?', ops:[['0','Progreso bien'],['2','Me cuesta, voy muy lento'],['3','Llevo tiempo estancado'],['nf','No entreno fuerza']]},
    {id:'hor3', area:'hormonas', tipo:'una', t:'¿Te notas más "blando", con grasa en la barriga y el pecho aunque no estés gordo?', ops:[['3','Sí'],['1','Un poco'],['0','No']]},
    {id:'temp', tipo:'una', t:'¿Sabes cuál es tu temperatura al despertar?', ayuda:'Medida con un termómetro, nada más abrir los ojos.', ops:[['baja','Sí, por debajo de 36,5 °C'],['normal','Sí, 36,5 °C o más']], noSe: true,
      ciego: ['Tu temperatura al despertar', 'Es la señal más clara de cómo funciona tu metabolismo y no la estás mirando.', 'mi temperatura al despertar']},
    {id:'senales', tipo:'multi', t:'¿Te pasa alguna de estas cosas a menudo?', ayuda:'Marca todas las que te suenen.', ops:[
      ['fria','Manos o pies fríos, o frío cuando otros están bien'],
      ['cansado','Te levantas cansado aunque duermas'],
      ['bajon','Bajones de energía a media tarde'],
      ['foco','Te cuesta concentrarte o rendir en el trabajo'],
      ['recupera','Te cuesta recuperarte de los entrenos'],
      ['piel','Piel seca o cambios en el pelo'],
      ['digestion','Estreñimiento o digestiones lentas'],
      ['dulce','Antojo de dulce o picoteo por la noche'],
      ['ninguna','Ninguna de estas']]}
  ]}
];

/* Por qué te frena cada área (sin hablar de las demás, para que el resultado sea coherente) */
var EXPLICA = {
  nutricion: 'Cuando comes poco durante mucho tiempo, quitas hidratos o ayunas, tu cuerpo entiende que hay escasez: tira de hormonas del estrés, gasta menos y la barriga no se mueve. No necesitas recortar más: necesitas darle energía, empezando por los hidratos, para que vuelva a gastar.',
  sueno: 'Vivimos desregulados del sol: poca luz por la mañana, pantallas hasta tarde y menos horas de sueño. Sin ese descanso tu cuerpo no se recupera: tienes más hambre, menos energía y, con el tiempo, también lo acaban pagando tus hormonas.',
  hormonas: 'Menos ganas, menos empuje, más grasa en la barriga y el pecho y menos progreso en el gimnasio son señales de que tus hormonas van justas. Casi siempre es consecuencia de cómo vives, no de la edad.',
  estres: 'Vivir con prisas, tirar de café y no soltar el móvil le dice a tu cuerpo que está en alerta permanente. Vive a base de cortisol y adrenalina, y la grasa de la barriga es la primera en notarlo.',
  entreno: 'Pasar el día sentado y entrenar de forma que te destroza, o reventarte a cardio para quemar, hace que tu cuerpo gaste menos el resto del día y se recupere peor. Más no es mejor.'
};
/* Lo que mejor llevas: frase positiva por área */
var MEJOR = {
  nutricion: 'Tu forma de comer no es lo que más te frena: es tu punto fuerte.',
  sueno: 'Tu descanso es tu punto fuerte: mantenlo mientras corriges lo demás.',
  hormonas: 'Tus señales hormonales todavía aguantan bien: es el momento de corregir lo demás antes de que se resientan.',
  estres: 'Llevas bien el estrés: es tu punto fuerte.',
  entreno: 'Tu forma de entrenar y moverte es tu punto fuerte.'
};
/* Siempre va primero: los hidratos son la prioridad del método */
var HIDRATOS = '<b>Los hidratos son tu salida del modo ahorro</b>: fruta, miel o zumo natural por la mañana y entre horas, y arroz, patata o pan de masa madre en comida y cena. Con energía disponible tu cuerpo deja de ahorrar, baja el estrés, se acelera y duerme mejor.';
var ACCIONES = {
  nutricion: ['Deja de recortar: come suficiente en cada comida, también en la cena.', 'Deja los ayunos por ahora: tu cuerpo necesita sentir que la energía no falta.'],
  sueno: ['Nada más despertar, 5-10 minutos a la luz del sol, sin gafas.', 'Acuéstate entre las 22:00 y las 23:00 y cena con hidratos 2-3 horas antes: dormirás más profundo.'],
  hormonas: ['Entrena fuerza 3-4 días con pocos ejercicios y cada serie con intensidad real.', 'Cocina con AOVE, mantequilla o ghee, quita los aceites de semillas y prioriza carne roja, huevos y pescado.'],
  estres: ['Toma el primer café al menos 1 hora después de despertarte, y después de desayunar.', 'La primera media hora del día, sin móvil.'],
  entreno: ['Camina 10-15 minutos después de las comidas y acércate a los 10.000 pasos al día.', 'Entrena fuerza con pocos ejercicios bien hechos y con hidratos antes y durante el entreno (por ejemplo, miel en el agua), nunca en ayunas.']
};

JG.iniciar({
  recurso: 'modo-ahorro',
  nombre: 'test del modo ahorro',
  paginas: PAGINAS,
  cargando: ['Analizando tus respuestas…', 'Puntuando cada área…', 'Detectando tu principal limitante…'],
  calcular: function(R){
    var pts = AREAS.map(function(a){ return {id: a.id, nombre: a.nombre, s: 0, n: 0}; });
    var porId = {}; pts.forEach(function(p){ porId[p.id] = p; });
    PAGINAS.forEach(function(p){ p.preguntas.forEach(function(q){
      if(!q.area) return;
      var v = R[q.id]; if(v == null || v === JG.NS) return;
      var n = parseInt(v, 10); if(isNaN(n)) return;
      porId[q.area].s += n; porId[q.area].n++;
    }); });
    if(R.hor2 === 'nf'){ porId.entreno.s += 2; porId.entreno.n++; }
    pts.forEach(function(p){ p.pct = p.n ? p.s / (p.n * 3) : null; });
    var conDatos = pts.filter(function(p){ return p.n >= 2; });
    var senales = (R.senales || []).filter(function(x){ return x !== 'ninguna'; });
    if(!conDatos.length && !senales.length && R.temp !== 'baja') return {vacio: true};
    var media = conDatos.length ? conDatos.reduce(function(x, p){ return x + p.pct; }, 0) / conDatos.length : 0.3;
    var nivel = Math.round(media * 60 + Math.min(senales.length, 8) * 5 + (R.temp === 'baja' ? 10 : 0));
    nivel = Math.max(3, Math.min(98, nivel));
    var orden = conDatos.slice().sort(function(a, b){ return b.pct - a.pct; });
    var peor = orden[0], mejor = orden[orden.length - 1];

    var titulo, color, texto;
    if(nivel >= 75){ titulo = 'Modo ahorro profundo'; color = '#d70438'; texto = 'Tu cuerpo está claramente ahorrando energía. Por eso te cuesta tanto perder grasa aunque hagas "todo bien". Recortar más solo lo empeoraría: necesitas salir de este estado primero. Si las señales son intensas o duran mucho, consúltalo también con tu médico.'; }
    else if(nivel >= 55){ titulo = 'Modo ahorro activado'; color = '#ff2d5c'; texto = 'Tu cuerpo ha entrado en modo ahorro: gasta lo mínimo para protegerse. No está roto, pero mientras siga así la barriga no se va a mover por mucho que te esfuerces.'; }
    else if(nivel >= 30){ titulo = 'Modo ahorro leve'; color = '#f0a020'; texto = 'Tu cuerpo empieza a ahorrar energía. Si sigues igual, cada vez te costará más perder grasa. Es el mejor momento para corregirlo.'; }
    else { titulo = 'Tu cuerpo no está en modo ahorro'; color = '#7fb36e'; texto = 'Tu metabolismo responde bien. Lo que te falta no es arreglar nada, sino afinar la estrategia para que la grasa baje.'; }

    var barras = pts.slice().sort(function(a, b){ return (b.pct == null ? -1 : b.pct) - (a.pct == null ? -1 : a.pct); }).map(function(p){
      if(p.n < 2) return JG.barra(p.nombre, 3, 'Sin datos suficientes', '#555');
      var c = p.pct >= .55 ? '#d70438' : p.pct >= .3 ? '#f0a020' : '#7fb36e';
      return JG.barra(p.nombre, p.pct * 100, p.pct >= .55 ? 'Te está frenando' : p.pct >= .3 ? 'Mejorable' : 'Bien', c);
    }).join('');

    var foco = orden.filter(function(p){ return p.pct >= .3; }).slice(0, 2);
    if(!foco.length && peor) foco = [peor];
    var acc = [nivel >= 30 ? HIDRATOS : HIDRATOS.replace('Los hidratos son tu salida del modo ahorro', 'Los hidratos mantienen tu metabolismo encendido')];
    foco.forEach(function(p){ acc = acc.concat(ACCIONES[p.id]); });
    if(R.temp !== 'baja' && R.temp !== 'normal') acc.push('Mírate la temperatura nada más despertar un par de días: te dirá mucho de cómo funciona tu metabolismo.');

    var hayMejor = mejor && peor && mejor.id !== peor.id && mejor.pct < .3;
    var resumen = 'Mi nivel de modo ahorro: ' + nivel + '% (' + titulo + ').' + (peor ? ' Lo que más me frena: ' + peor.nombre + '.' : '') + (hayMejor ? ' Lo que mejor llevo: ' + mejor.nombre + '.' : '') + (senales.length ? ' Señales: ' + senales.length + '.' : '');
    var html =
      '<div class="res-bloque">' + JG.anillo(nivel, color, titulo, 'Tu nivel de modo ahorro', '%') + '<p>' + texto + '</p></div>' +
      '<div class="res-bloque"><h3>Qué te está frenando, de más a menos</h3><div class="barras">' + barras + '</div>' +
      (peor ? '<div class="destacado" style="margin-top:16px">Tu principal limitante: <b>' + peor.nombre + '</b>.<br>' + EXPLICA[peor.id] + '</div>' : '') +
      (hayMejor ? '<p class="muted" style="margin-top:12px;font-size:15px">Lo que mejor llevas: <b style="color:var(--texto)">' + mejor.nombre + '</b>. ' + MEJOR[mejor.id] + '</p>' : '') + '</div>' +
      (senales.length || R.temp === 'baja' ? '<div class="res-bloque"><h3>Tu cuerpo te está avisando</h3><p class="muted">' + (R.temp === 'baja' ? 'Tu temperatura al despertar está por debajo de 36,5 °C: es una de las señales más claras de un metabolismo que ahorra energía. ' : '') + (senales.length ? (R.temp === 'baja' ? 'Además marcas ' : 'Marcas ') + senales.length + (senales.length === 1 ? ' señal típica' : ' señales típicas') + ' del modo ahorro: frío, cansancio, bajones, antojo de dulce… No son casualidad.' : '') + '</p></div>' : '') +
      '<div class="res-bloque"><h3>Qué hacer</h3>' + JG.acciones(acc) + '</div>';
    return {html: html, resumen: resumen, puntuacion: nivel, extra: {areas: pts, senales: senales, temp: R.temp || null}};
  }
});
