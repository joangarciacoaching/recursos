/* Test: ¿Tu barriga es grasa o hinchazón? (palabra clave CAMBIO10)
   Sin medirse: la comparación mañana/noche se hace por cómo la notas y cómo te queda la ropa. */
function f(id, eje, t, extra){ var o = {id: id, eje: eje, tipo: 'freq', t: t}; for(var k in extra || {}) o[k] = extra[k]; return o; }
var PAGINAS = [
  {titulo: 'Tu barriga en el día a día', preguntas: [
    f('h1', 'h', 'Por la noche notas la barriga más dura o hinchada que al despertar.', {noSe: 'No me he fijado',
      ciego: ['Cómo cambia tu barriga durante el día', 'Fíjate mañana al despertar y por la noche, sin medirte: solo cómo la notas y cómo te queda la ropa. Si cambia mucho, gran parte es hinchazón, no grasa.', 'cómo cambia mi barriga durante el día']}),
    f('h2', 'h', 'La ropa te aprieta más por la noche que por la mañana.'),
    f('h3', 'h', 'Tienes gases o digestiones pesadas.'),
    f('h4', 'h', 'Vas irregular al baño.'),
    f('h5', 'h', 'La barriga te cambia mucho de un día a otro según lo que comes o tu estrés.')
  ]},
  {titulo: 'Tu energía', preguntas: [
    f('a1', 'a', 'Te levantas cansado aunque duermas 7-8 horas.'),
    f('a2', 'a', 'Tienes las manos o los pies fríos.'),
    f('a3', 'a', 'Tienes bajones de energía a media tarde.'),
    f('a4', 'a', 'Te entra antojo de dulce por la noche.'),
    {id:'recortes', tipo:'multi', t:'Para bajar la barriga, ¿qué has hecho en los últimos meses?', ayuda:'Marca solo lo que hayas hecho.', ops:[['poco','Comer menos o estar a dieta'],['ayuno','Hacer ayunos'],['hidratos','Quitar o reducir los hidratos'],['cardio','Hacer cardio para quemar'],['ninguna','Nada de esto']]},
    {id:'fuerza', tipo:'una', t:'¿Cuántos días entrenas fuerza a la semana?', ops:[['0','Ninguno'],['1','1-2 días'],['2','3-4 días'],['3','5 o más']]}
  ]}
];

var HIDRATOS = 'Prioriza los hidratos en cada comida (fruta madura, patata, arroz, pan de masa madre, miel): es lo que mantiene tu metabolismo encendido, baja el estrés y mejora tu digestión y tu descanso.';
var ACC_H = ['Muévete 10-15 minutos después de cada comida: ayuda a la digestión y baja la hinchazón.',
  'Termina de cenar 2-3 horas antes de dormir, y bebe el agua durante el día, no de golpe por la noche.',
  'Quita los aceites de semillas (girasol, soja, maíz), también los que van escondidos en envasados: inflaman.'];
var ACC_A = ['Deja de recortar: come suficiente en cada comida, también en la cena.',
  'Aparca los ayunos y el cardio para quemar: tu cuerpo necesita sentir que la energía no falta.',
  'Entrena fuerza 3-4 días con pocos ejercicios bien hechos, y duerme 7-8 horas.'];
var PERFIL = {
  A: {t:'Tu barriga es sobre todo hinchazón', yo:'Mi barriga es sobre todo hinchazón', p:['Buena noticia: buena parte de lo que ves en el espejo no es grasa, es hinchazón. Viene de cómo digieres, del estrés y de lo que comes (y cuándo).', 'Esto se puede bajar rápido, sin pasar hambre.'], acc: [HIDRATOS, ACC_H[0], ACC_H[1], ACC_H[2]]},
  B: {t:'Tu barriga es sobre todo grasa, y tu cuerpo está en modo ahorro', yo:'Mi barriga es sobre todo grasa y mi cuerpo está en modo ahorro', p:['Tu barriga no cambia mucho durante el día: es grasa. Y no baja porque llevas tiempo dándole a tu cuerpo poca energía, y eso le dice una cosa: ahorra. Por eso vas a medio gas, con frío o cansado.', 'No necesitas recortar más. En mi método se pierde grasa comiendo más, no menos: dándole a tu cuerpo razones para volver a gastar.'], acc: [HIDRATOS, ACC_A[0], ACC_A[1], ACC_A[2]]},
  C: {t:'Tu barriga es mitad hinchazón, mitad grasa', yo:'Mi barriga es mitad hinchazón, mitad grasa', p:['Parte de tu barriga es hinchazón (digestión, estrés, comida) y parte es grasa que no baja porque tu cuerpo está algo en modo ahorro.', 'La clave es atacar las dos cosas a la vez, sin dietas extremas.'], acc: [HIDRATOS, ACC_H[0], ACC_H[1], ACC_A[1]]},
  D: {t:'Tu barriga es sobre todo grasa, pero tu cuerpo responde bien', yo:'Mi barriga es sobre todo grasa, pero mi cuerpo responde bien', p:['Ni tienes mucha hinchazón ni señales claras de modo ahorro: tu cuerpo responde bien.', 'Así que lo que queda es afinar: qué comes, cuándo y cómo entrenas, sin recortar a lo loco.'], acc: [HIDRATOS, ACC_A[2], ACC_H[2]]}
};

JG.iniciar({
  recurso: 'barriga',
  nombre: 'test de la barriga',
  paginas: PAGINAS,
  cargando: ['Analizando tus respuestas…', 'Separando hinchazón y grasa…', 'Preparando tu resultado…'],
  calcular: function(R){
    function suma(eje){
      var vals = [];
      PAGINAS.forEach(function(p){ p.preguntas.forEach(function(x){ if(x.eje === eje && R[x.id] != null && R[x.id] !== JG.NS) vals.push(parseInt(R[x.id], 10) / 3); }); });
      if(eje === 'a' && R.recortes && R.recortes.length){
        var r = R.recortes.filter(function(x){ return x !== 'ninguna'; }).length;
        vals.push(Math.min(r, 3) / 3);
      }
      return {n: vals.length, pct: vals.length ? vals.reduce(function(x, y){ return x + y; }, 0) / vals.length : null};
    }
    var h = suma('h'), a = suma('a');
    if(h.n + a.n < 2) return {vacio: true};
    var hp = h.pct || 0, ap = a.pct || 0;
    /* Hinchazón = la barriga cambia durante el día y con la digestión. Modo ahorro = señales de poca energía y recortes.
       Gana el eje que destaca claramente; si los dos están parejos y altos, mitad y mitad; si los dos están bajos, grasa con un cuerpo que responde. */
    var perfil = (hp < .35 && ap < .35) ? 'D' : (hp - ap >= .15 ? 'A' : (ap - hp >= .15 ? 'B' : 'C'));
    var c = PERFIL[perfil];
    var fz = R.fuerza;
    var train = fz === '0' ? 'Ahora mismo no entrenas fuerza. Empezar con 2-3 días a la semana va a cambiar mucho cómo responde tu cuerpo.'
      : fz === '1' ? 'Entrenas fuerza 1-2 días. Subir a 3 días es de lo que más te va a ayudar.'
      : fz === '2' ? 'Entrenas fuerza 3-4 días: es una buena base. Ahora el foco está en comer y descansar acorde a ese entreno.'
      : fz === '3' ? (ap >= .4 ? 'Entrenas fuerza 5 días o más y tu cuerpo da señales de modo ahorro: seguramente entrenas más de lo que puedes recuperar. Con 3-4 días bien hechos avanzarías más.' : 'Entrenas fuerza 5 días o más. Si notas que no te recuperas, con 3-4 días bien hechos avanzarías más.')
      : '';
    function nota(x){ return x.pct == null ? 'Sin datos' : x.pct >= .55 ? 'Alto' : x.pct >= .3 ? 'Medio' : 'Bajo'; }

    var resumen = c.yo + '. Hinchazón ' + nota(h).toLowerCase() + ', modo ahorro ' + nota(a).toLowerCase() + '.';
    var html =
      '<div class="res-bloque"><p class="eyebrow">Tu resultado</p><h2 style="font-size:26px">' + c.t + '</h2>' +
      '<div class="barras" style="margin-top:16px">' + JG.barra('Hinchazón', (h.pct || 0) * 100, nota(h), '#f0a020') + JG.barra('Modo ahorro (grasa que tu cuerpo protege)', (a.pct || 0) * 100, nota(a), '#d70438') + '</div>' +
      '<p class="muted" style="margin-top:12px;font-size:14px">Si tu barriga cambia mucho de la mañana a la noche y con las digestiones, es hinchazón. Si está igual todo el día y vas con frío, cansado o comiendo poco, es grasa que tu cuerpo está protegiendo.</p></div>' +
      '<div class="res-bloque">' + c.p.map(function(t){ return '<p style="margin-bottom:10px">' + t + '</p>'; }).join('') + (train ? '<p class="muted">' + train + '</p>' : '') + '</div>' +
      '<div class="res-bloque"><h3>Por dónde empezar</h3>' + JG.acciones(c.acc) + '</div>';
    return {html: html, resumen: resumen, puntuacion: null, extra: {perfil: perfil, hinchazon: h, ahorro: a, recortes: R.recortes || []}};
  }
});
