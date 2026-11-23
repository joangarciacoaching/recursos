/* Test: ¿Tu barriga es grasa o hinchazón? (palabra clave CAMBIO10)
   Funciona sin medirse. La cintura es un extra opcional. */
function f(id, eje, t){ return {id: id, eje: eje, tipo: 'freq', t: t}; }
var PAGINAS = [
  {titulo: 'Tu barriga en el día a día', preguntas: [
    f('h1', 'h', 'Por la tarde-noche notas la barriga más dura o hinchada que al despertar.'),
    f('h2', 'h', 'La ropa te aprieta más por la noche que por la mañana.'),
    f('h3', 'h', 'Tienes gases, digestiones pesadas o vas irregular al baño.'),
    f('h4', 'h', 'La barriga te cambia mucho de un día a otro según lo que comes o tu estrés.')
  ]},
  {titulo: 'Tu energía', preguntas: [
    f('a1', 'a', 'Te levantas cansado aunque duermas 7-8 horas.'),
    f('a2', 'a', 'Tienes las manos o los pies fríos.'),
    f('a3', 'a', 'Llevas meses comiendo poco, haciendo ayunos o quitando hidratos y la barriga no se va.'),
    f('a4', 'a', 'Tienes bajones de energía a media tarde o ansia por el dulce por la noche.'),
    {id:'fuerza', tipo:'una', t:'¿Cuántos días entrenas fuerza a la semana?', ops:[['0','Ninguno'],['1','1-2 días'],['2','3 o más']]}
  ]},
  {titulo: 'Tu cintura (opcional)', sub: 'Si tienes una cinta métrica a mano, mídete ahora. Si no, marca «No lo sé» y sigue.', preguntas: [
    {id:'cintura', tipo:'datos', t:'¿Cuánto mide tu cintura a la altura del ombligo?', ayuda:'De pie, relajado, sin meter barriga y sin apretar la cinta.', campos:[{id:'cm', label:'Cintura (cm)', ph:'92', full:true}], noSe: true,
      ciego: ['Tu cintura', 'La cintura dice más de tu progreso que la báscula, y no la estás midiendo.']}
  ]}
];

var ACC_H = ['Muévete 10-15 minutos después de cada comida: ayuda a la digestión y baja la hinchazón.',
  'Reparte la comida y los hidratos durante el día en vez de llegar con hambre y darte el atracón por la noche.',
  'Apunta durante una semana qué comes y cómo está tu barriga por la noche: verás qué te hincha.'];
var ACC_A = ['Deja de recortar y come suficiente, con hidratos alrededor del entreno.',
  'Entrena fuerza 3-4 días a la semana, sesiones de menos de una hora.',
  'Prioriza dormir 7-8 horas: sin descanso tu cuerpo sigue en modo ahorro.'];
var PERFIL = {
  A: {t:'Tu barriga tiene mucho de hinchazón', p:['Buena noticia: parte de lo que ves en el espejo no es grasa, es hinchazón. Viene de cómo digieres, del estrés y de lo que comes (y cuándo).', 'Esto se puede bajar rápido, sin pasar hambre.'], acc: ACC_H},
  B: {t:'Tu barriga es grasa y tu cuerpo está en modo ahorro', p:['Llevas tiempo comiendo cada vez menos, y eso le dice a tu cuerpo una cosa: ahorra energía. Por eso vas a medio gas, con frío, cansado y con la barriga ahí.', 'No necesitas recortar más. Necesitas darle a tu cuerpo razones para gastar.'], acc: ACC_A},
  C: {t:'Tienes un poco de las dos', p:['Parte de tu barriga es hinchazón (digestión, estrés, comida) y parte es grasa que no baja porque tu cuerpo está algo en modo ahorro.', 'La clave es atacar las dos cosas a la vez, sin dietas extremas.'], acc: [ACC_H[0], ACC_H[1], ACC_A[0], ACC_A[1]]}
};

JG.iniciar({
  recurso: 'barriga',
  nombre: 'test de la barriga',
  paginas: PAGINAS,
  cargando: ['Analizando tus respuestas…', 'Separando hinchazón y grasa…', 'Preparando tu resultado…'],
  ctaTexto: 'Mándame tu resultado y te digo por dónde empezaría yo contigo.',
  calcular: function(R){
    function suma(eje){ var s = 0, n = 0; PAGINAS.forEach(function(p){ p.preguntas.forEach(function(x){ if(x.eje === eje && R[x.id] != null){ s += parseInt(R[x.id], 10); n++; } }); }); return {s: s, n: n, pct: n ? s / (n * 3) : null}; }
    var h = suma('h'), a = suma('a');
    var hp = h.pct || 0, ap = a.pct || 0;
    var perfil = (hp >= .55 && hp >= ap) ? 'A' : (ap >= .55 ? 'B' : (hp >= .55 ? 'A' : 'C'));
    var c = PERFIL[perfil];
    var fz = R.fuerza;
    var train = fz === '0' ? 'Ahora mismo no entrenas fuerza. Empezar con 2-3 días a la semana va a cambiar mucho cómo responde tu cuerpo.'
      : fz === '1' ? 'Entrenas fuerza 1-2 días. Subir a 3 días es de lo que más te va a ayudar.'
      : fz === '2' ? 'Ya entrenas fuerza 3 días o más: bien. Ahora el foco está en comer y descansar acorde a ese entreno.' : '';
    var cm = R.cintura && R.cintura.cm >= 50 && R.cintura.cm <= 200 ? R.cintura.cm : null;
    var cintura = cm ? '<div class="destacado" style="margin-top:14px">Tu cintura hoy: <b>' + cm + ' cm</b>. Mídetela mañana nada más despertar, en el mismo sitio: si baja 3 cm o más, gran parte de lo que ves es hinchazón.</div>' : '';
    function nota(x){ return x.pct == null ? 'Sin datos' : x.pct >= .55 ? 'Alto' : x.pct >= .3 ? 'Medio' : 'Bajo'; }

    var resumen = c.t + '. Hinchazón ' + nota(h).toLowerCase() + ', modo ahorro ' + nota(a).toLowerCase() + '.' + (cm ? ' Mi cintura: ' + cm + ' cm.' : '');
    var html =
      '<div class="res-bloque"><p class="eyebrow">Tu resultado</p><h2 style="font-size:26px">' + c.t + '</h2>' +
      '<div class="barras" style="margin-top:16px">' + JG.barra('Hinchazón', (h.pct || 0) * 100, nota(h), '#f0a020') + JG.barra('Modo ahorro', (a.pct || 0) * 100, nota(a), '#d70438') + '</div>' + cintura + '</div>' +
      '<div class="res-bloque">' + c.p.map(function(t){ return '<p style="margin-bottom:10px">' + t + '</p>'; }).join('') + (train ? '<p class="muted">' + train + '</p>' : '') + '</div>' +
      '<div class="res-bloque"><h3>Por dónde empezar</h3>' + JG.acciones(c.acc) + '</div>';
    return {html: html, resumen: resumen, puntuacion: null, extra: {perfil: perfil, hinchazon: h, ahorro: a, cintura: cm}};
  }
});
