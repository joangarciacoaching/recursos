/* Checklist: Revisa tu despensa (palabra clave COMIDA). Basado en las pautas generales de Joan:
   el problema no es el azúcar (miel, fruta y chocolate son aliados), son los aceites de semillas,
   los edulcorantes, lo light, el alcohol y los tóxicos de la cocina. */
var FILTRO = 'https://tu-compra-con-ciencia.lovable.app';
/* [id, texto, por qué, cámbialo por] */
var MALOS = [
  ['semillas', 'Aceite de girasol, soja, maíz u "oliva" a secas', 'Se oxidan con el calor y estropean tu producción de energía.', 'Aceite de oliva virgen extra, mantequilla ecológica o ghee.'],
  ['bolleria', 'Bollería, galletas o snacks de paquete', 'Casi todos están hechos con esos aceites refinados.', 'Fruta, miel, chocolate negro o repostería casera con mantequilla.'],
  ['zero', 'Refrescos zero o light y bebidas energéticas', 'Los edulcorantes alteran tu flora intestinal.', 'Zumo natural, agua con sal marina y limón, o un refresco normal de forma puntual.'],
  ['light', 'Productos light, 0 % o "fit"', 'Les quitan la grasa que tu cuerpo necesita para fabricar hormonas.', 'Lácteos enteros, huevos enteros y queso de verdad.'],
  ['barritas', 'Barritas y snacks proteicos', 'Ultraprocesados disfrazados de sanos: proteína de más y comida de verdad de menos.', 'Fruta, un vaso de leche o un trozo de queso.'],
  ['alcohol', 'Alcohol en casa', 'Juega en contra de tus hormonas y de tu recuperación.', 'Agua filtrada o zumo natural.'],
  ['sarten', 'Sartenes de teflón o aluminio', 'Pasan tóxicos a la comida, sobre todo cuando están rayadas.', 'Acero inoxidable, hierro o cerámica.'],
  ['plastico', 'Táperes o botellas de plástico', 'Al calentarse pueden soltar disruptores endocrinos.', 'Vidrio.']
];
/* [id, texto, para qué] */
var BUENOS = [
  ['hidratos', 'Fruta, miel, arroz y patata', 'Tus hidratos: la gasolina que mantiene tu metabolismo encendido.'],
  ['huevos', 'Huevos enteros', 'Proteína completa y la grasa con la que tu cuerpo fabrica hormonas.'],
  ['carne', 'Carne de pasto o de rumiantes (ternera, cordero)', 'Proteína de calidad con mejor perfil de grasas.'],
  ['pescado', 'Pescado azul salvaje o marisco', 'DHA y minerales que casi nadie come suficiente.'],
  ['lacteos', 'Lácteos enteros: leche, yogur natural, queso', 'Proteína, calcio y saciedad sin productos light.'],
  ['caldo', 'Caldo de huesos o vísceras', 'Equilibran los aminoácidos cuando comes mucha carne.'],
  ['cruciferas', 'Brócoli, coliflor u otras crucíferas', 'Ayudan a tus hormonas.'],
  ['grasas', 'AOVE, mantequilla o ghee, y sal marina sin refinar', 'Para cocinar con grasas estables y salar bien.']
];

var PAGINAS = [
  {titulo: 'Lo que te puede estar saboteando', preguntas: [
    {id:'malos', tipo:'multi', t:'¿Cuáles de estos tienes en casa?', ayuda:'Marca todos los que tengas, aunque los uses poco.', ops: MALOS.map(function(m){ return [m[0], m[1]]; }).concat([['ninguna','Ninguno de estos']])}
  ]},
  {titulo: 'Lo que debería haber', preguntas: [
    {id:'buenos', tipo:'multi', t:'¿Cuáles de estos tienes siempre a mano?', ayuda:'Marca solo lo que suele haber en tu cocina.', ops: BUENOS.map(function(b){ return [b[0], b[1]]; }).concat([['ninguna','Ninguno de estos']])}
  ]},
  {titulo: 'Cómo haces la compra', preguntas: [
    {id:'compra', tipo:'una', t:'¿Cómo sueles hacer la compra?', ops:[['lista','Con lista y lo justo para la semana'],['marcha','Sobre la marcha, lo que me apetece'],['pedido','Pido comida o como fuera casi siempre']]},
    {id:'noche', tipo:'una', t:'Por la noche, cuando te entra hambre o ansiedad, ¿qué tienes a mano?', ops:[['paquete','Algo de paquete: galletas, snacks…'],['nada','Nada: aguanto y al final pico lo que pillo'],['real','Fruta, yogur, miel o algo de verdad']]},
    {id:'etiquetas', tipo:'una', t:'¿Miras las etiquetas de lo que compras?', ops:[['si','Sí'],['aveces','A veces'],['no','No']], noSe: 'No sé qué mirar',
      ciego: ['Qué mirar en una etiqueta', 'Si no sabes leer una etiqueta, los aceites de semillas y los edulcorantes se te cuelan en casi todo lo que compras.']}
  ]}
];

JG.iniciar({
  recurso: 'despensa',
  nombre: 'checklist de la despensa',
  paginas: PAGINAS,
  cargando: ['Revisando tu despensa…', 'Buscando qué te sabotea…', 'Preparando tu lista de la compra…'],
  ctaTexto: 'Mándame tu resultado y te digo cómo organizaría tus comidas con lo que tienes en casa.',
  calcular: function(R){
    var malos = (R.malos || []).filter(function(x){ return x !== 'ninguna'; });
    var buenos = (R.buenos || []).filter(function(x){ return x !== 'ninguna'; });
    var p = 50 + buenos.length * 6 - malos.length * 6 + ({lista:6, marcha:0, pedido:-8})[R.compra || 'marcha'] + ({real:6, nada:-3, paquete:-6})[R.noche || 'nada'] + (({si:4, aveces:0, no:-4})[R.etiquetas] || 0);
    p = Math.max(5, Math.min(98, Math.round(p)));
    var titulo, color, texto;
    if(p >= 75){ titulo = 'Despensa de 10'; color = '#7fb36e'; texto = 'Tu cocina juega a tu favor. Si aun así no pierdes barriga, el problema no está en lo que compras sino en cuánto, cuándo y cómo lo combinas.'; }
    else if(p >= 50){ titulo = 'Despensa mejorable'; color = '#f0a020'; texto = 'Tienes una buena base, pero hay cosas en casa que te sabotean sin que lo notes y te faltan alimentos clave.'; }
    else { titulo = 'Tu despensa te está saboteando'; color = '#d70438'; texto = 'Ahora mismo tu cocina te lo pone muy difícil. No es falta de fuerza de voluntad: si lo tienes en casa, te lo acabas comiendo.'; }

    var fuera = MALOS.filter(function(m){ return malos.indexOf(m[0]) > -1; });
    var faltan = BUENOS.filter(function(b){ return buenos.indexOf(b[0]) === -1; });
    var fueraHTML = fuera.length
      ? '<ul class="errores">' + fuera.map(function(m){ return '<li><b>❌ ' + m[1] + '</b>' + m[2] + '<br><span style="color:var(--verde);font-weight:700">Cámbialo por:</span> ' + m[3] + '</li>'; }).join('') + '</ul>'
      : '<p class="muted">No tienes ningún saboteador en casa. 👏</p>';
    var faltanHTML = faltan.length
      ? '<ul class="errores">' + faltan.map(function(b){ return '<li class="bien"><b>🛒 ' + b[1] + '</b>' + b[2] + '</li>'; }).join('') + '</ul>'
      : '<p class="muted">No te falta nada básico. 👏</p>';
    var extra = [];
    if(R.compra !== 'lista') extra.push('Haz la compra con lista una vez por semana: lo que no entra en casa, no te lo comes.');
    if(R.noche !== 'real') extra.push('Ten a mano fruta, yogur natural entero o miel para la noche. El picoteo nocturno suele ser hambre de verdad por no haber comido suficiente durante el día.');
    extra.push('No le tengas miedo al dulce de verdad: la fruta y la miel son tus aliados. Lo que tienes que sacar son los aceites refinados y los edulcorantes.');
    var filtro = (R.etiquetas === 'no' || R.etiquetas === JG.NS || R.etiquetas === 'aveces')
      ? '<div class="destacado" style="margin-top:14px">Para no tener que leer cada etiqueta, usa mi <b>filtro de supermercado</b>: buscas el producto y te dice si encaja con estas pautas. <a href="' + FILTRO + '" target="_blank" rel="noopener" style="color:#fff;font-weight:700">Abrir el filtro →</a></div>' : '';

    var resumen = 'Mi despensa: ' + p + '/100 (' + titulo + '). Tengo ' + fuera.length + ' saboteadores y me faltan ' + faltan.length + ' básicos.';
    var html =
      '<div class="res-bloque">' + JG.anillo(p, color, titulo, 'La nota de tu despensa') + '<p>' + texto + '</p></div>' +
      '<div class="res-bloque"><h3>Saca esto de tu despensa</h3>' + fueraHTML + '</div>' +
      '<div class="res-bloque"><h3>Añade esto a tu lista de la compra</h3>' + faltanHTML + '</div>' +
      '<div class="res-bloque"><h3>Y además</h3>' + JG.acciones(extra) + filtro + '</div>';
    return {html: html, resumen: resumen, puntuacion: p, extra: {saboteadores: malos, faltan: faltan.map(function(b){ return b[0]; })}};
  }
});
