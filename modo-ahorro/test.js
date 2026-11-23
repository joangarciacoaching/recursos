/* Test: ¿Tu cuerpo está en modo ahorro? (palabra clave ENERGÍA) */
var AREAS = [
  {id:'nutricion', nombre:'Nutrición'},
  {id:'sueno', nombre:'Sueño y luz solar'},
  {id:'hormonas', nombre:'Hormonas y testosterona'},
  {id:'estres', nombre:'Estrés y estimulantes'},
  {id:'entreno', nombre:'Entreno y movimiento'}
];
function f(id, area, t){ return {id: id, area: area, tipo: 'freq', t: t}; }

var PAGINAS = [
  {titulo: 'Cómo comes y te mueves', preguntas: [
    f('nut1', 'nutricion', 'Pasas la mayor parte del año a dieta o intentando bajar de peso.'),
    f('nut2', 'nutricion', 'Quitas o reduces los hidratos (pan, arroz, patata, fruta) para no engordar.'),
    f('nut3', 'nutricion', 'Haces ayunos o te saltas comidas para comer menos.'),
    f('ent1', 'entreno', 'Pasas casi todo el día sentado y te mueves poco.'),
    f('ent2', 'entreno', 'El entreno te deja reventado el resto del día o tu rendimiento lleva tiempo bajando.'),
    f('ent3', 'entreno', 'Haces mucho cardio o entrenas en ayunas para quemar más.')
  ]},
  {titulo: 'Cómo duermes y vives el día', preguntas: [
    {id:'horas', area:'sueno', tipo:'una', t:'¿Cuántas horas duermes de verdad?', ops:[['3','Menos de 6'],['2','Entre 6 y 7'],['0','Entre 7 y 8'],['0b','Más de 8']], noSe: true,
      ciego: ['Cuánto duermes de verdad', 'Sin saber cuánto descansas, no sabes si tu cuerpo tiene tiempo para recuperarse y fabricar hormonas.']},
    f('sue2', 'sueno', 'Te acuestas después de las 23:30, normalmente con el móvil en la mano.'),
    f('sue3', 'sueno', 'Pasas casi todo el día en interiores y apenas ves la luz del sol por la mañana.'),
    f('est1', 'estres', 'Necesitas café u otros estimulantes para funcionar durante el día.'),
    f('est2', 'estres', 'Pasas el día con prisas, estrés o sin desconectar del trabajo.'),
    f('est3', 'estres', 'Miras el móvil justo antes de dormir y nada más despertar.')
  ]},
  {titulo: 'Tu energía y tus hormonas', preguntas: [
    f('hor1', 'hormonas', 'Tienes menos ganas, menos libido o menos empuje que hace unos años.'),
    f('hor2', 'hormonas', 'Te cuesta ganar fuerza o músculo aunque entrenes.'),
    f('hor3', 'hormonas', 'Te notas más "blando": grasa en la barriga y el pecho aunque no estés gordo.'),
    {id:'temp', tipo:'una', t:'¿Sabes cuál es tu temperatura al despertar?', ayuda:'Medida con un termómetro, nada más abrir los ojos.', ops:[['baja','Sí, por debajo de 36,5 °C'],['normal','Sí, 36,5 °C o más']], noSe: true,
      ciego: ['Tu temperatura al despertar', 'Es la señal más clara de cómo funciona tu metabolismo y no la estás mirando.']},
    {id:'senales', tipo:'multi', t:'¿Te pasa alguna de estas cosas a menudo?', ayuda:'Marca todas las que te suenen.', ops:[
      ['fria','Manos o pies fríos, o frío cuando otros están bien'],
      ['cansado','Te levantas cansado aunque duermas'],
      ['bajon','Bajones de energía a media tarde'],
      ['foco','Te cuesta concentrarte o rendir en el trabajo'],
      ['recupera','Te cuesta recuperarte de los entrenos'],
      ['piel','Piel seca o cambios en el pelo'],
      ['digestion','Estreñimiento o digestiones lentas'],
      ['dulce','Ansia por el dulce o picoteo por la noche'],
      ['ninguna','Ninguna de estas']]}
  ]}
];

var EXPLICA = {
  nutricion: 'Cuando comes poco durante mucho tiempo, quitas hidratos o ayunas, tu cuerpo entiende que hay escasez: gasta menos, vas a medio gas y la barriga no se mueve. No necesitas recortar más, necesitas darle razones para gastar.',
  sueno: 'Vivimos desregulados del sol: poca luz por la mañana, pantallas hasta tarde y menos horas de sueño. Sin descanso tu cuerpo no se recupera, la testosterona baja, tienes más hambre y menos energía.',
  hormonas: 'La testosterona no ha parado de bajar generación tras generación. No solo afecta al músculo: también a tu energía, tus ganas y dónde acumulas la grasa. Y casi siempre es consecuencia de tus hábitos, no de la edad.',
  estres: 'Vivir con prisas y tirar de café le dice a tu cuerpo que está en alerta permanente. Ese estado te deja a medio gas, sube el cortisol y la grasa abdominal es la primera en notarlo.',
  entreno: 'Pasar el día sentado y entrenar de forma que te destroza (o reventarte a cardio) hace que tu cuerpo gaste menos el resto del día y se recupere peor. Más no es mejor.'
};
var ACCIONES = {
  nutricion: ['Deja de recortar: 3 comidas completas con hidrato en cada una.', 'Pon la mayor parte de los hidratos alrededor del entreno.', 'Olvídate de los ayunos por ahora.'],
  sueno: ['Sal a la luz del sol en la primera hora del día, aunque sean 10 minutos.', 'Fija una hora de acostarte y levantarte, también el fin de semana.', 'Fuera pantallas 30-60 minutos antes de dormir.'],
  hormonas: ['Entrena fuerza 3-4 días con pocos ejercicios y mucha intensidad.', 'Come suficiente: grasa de calidad, hidratos y proteína en cada comida.', 'Duerme 7-8 horas: es cuando más testosterona produces.'],
  estres: ['Retrasa el primer café al menos 1 hora después de despertarte y nada después de las 14:00.', 'Primeros 20 minutos del día sin móvil.', 'Pausas reales de 5 minutos cada hora de trabajo.'],
  entreno: ['Muévete 10-15 minutos después de cada comida.', 'Sesiones de fuerza de menos de una hora: calidad antes que cantidad.', 'Deja el cardio en ayunas y come antes de entrenar.']
};

JG.iniciar({
  recurso: 'modo-ahorro',
  nombre: 'test del modo ahorro',
  paginas: PAGINAS,
  cargando: ['Analizando tus respuestas…', 'Puntuando cada área…', 'Detectando tu principal limitante…'],
  ctaTexto: 'Mándame tu diagnóstico y te digo cuál sería tu primer paso para salir del modo ahorro.',
  calcular: function(R){
    var pts = AREAS.map(function(a){ return {id: a.id, nombre: a.nombre, s: 0, n: 0}; });
    var porId = {}; pts.forEach(function(p){ porId[p.id] = p; });
    PAGINAS.forEach(function(p){ p.preguntas.forEach(function(q){
      if(!q.area) return;
      var v = R[q.id]; if(v == null || v === JG.NS) return;
      porId[q.area].s += parseInt(v, 10); porId[q.area].n++;
    }); });
    pts.forEach(function(p){ p.pct = p.n ? p.s / (p.n * 3) : null; });
    var conDatos = pts.filter(function(p){ return p.n >= 2; });
    var senales = (R.senales || []).filter(function(x){ return x !== 'ninguna'; });
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
    var acc = [];
    foco.forEach(function(p){ acc = acc.concat(ACCIONES[p.id].slice(0, foco.length > 1 ? 2 : 3)); });
    if(R.temp !== 'baja' && R.temp !== 'normal') acc.push('Mídete la temperatura 3 días seguidos nada más despertar: te dirá mucho de tu metabolismo.');

    var resumen = 'Mi nivel de modo ahorro: ' + nivel + '% (' + titulo + ').' + (peor ? ' Lo que más me falla: ' + peor.nombre + '.' : '') + (mejor && peor && mejor.id !== peor.id ? ' Lo que mejor llevo: ' + mejor.nombre + '.' : '') + (senales.length ? ' Señales: ' + senales.length + '.' : '');
    var html =
      '<div class="res-bloque">' + JG.anillo(nivel, color, titulo, 'Tu nivel de modo ahorro', '%') + '<p>' + texto + '</p></div>' +
      '<div class="res-bloque"><h3>Qué te está frenando, de más a menos</h3><div class="barras">' + barras + '</div>' +
      (peor ? '<div class="destacado" style="margin-top:16px">Tu principal limitante: <b>' + peor.nombre + '</b>.<br>' + EXPLICA[peor.id] + '</div>' : '') +
      (mejor && peor && mejor.pct < peor.pct ? '<p class="muted" style="margin-top:12px;font-size:15px">Lo que mejor llevas: <b style="color:var(--texto)">' + mejor.nombre + '</b>. Ahí no necesitas cambiar nada ahora.</p>' : '') + '</div>' +
      (senales.length || R.temp === 'baja' ? '<div class="res-bloque"><h3>Tu cuerpo te está avisando</h3><p class="muted">' + (R.temp === 'baja' ? 'Tu temperatura al despertar está por debajo de 36,5 °C: es una de las señales más claras de un metabolismo que ahorra energía. ' : '') + (senales.length ? 'Además marcas ' + senales.length + (senales.length === 1 ? ' señal' : ' señales') + ' típicas del modo ahorro: frío, cansancio, bajones, ansia por el dulce… No son casualidad.' : '') + '</p></div>' : '') +
      '<div class="res-bloque"><h3>Qué hacer</h3>' + JG.acciones(acc) + '</div>';
    return {html: html, resumen: resumen, puntuacion: nivel, extra: {areas: pts, senales: senales, temp: R.temp || null}};
  }
});
