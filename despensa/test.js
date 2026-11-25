/* Checklist: Revisa tu despensa (palabra clave COMIDA). Basado en las pautas generales de Joan:
   el problema no es el azúcar (fruta, miel, dátiles y zumo natural son aliados), son los aceites de semillas
   (también escondidos en envasados), los edulcorantes, lo light, el alcohol y los tóxicos de la cocina. */
var FILTRO = 'https://tu-compra-con-ciencia.lovable.app';
/* [id, texto, por qué, cámbialo por] */
var MALOS = [
  ['semillas', 'Aceite de girasol, soja, maíz o colza, u oliva a secas, para cocinar', 'Son grasas que se oxidan con el calor e inflaman.', 'Aceite de oliva virgen extra, mantequilla ecológica o ghee.'],
  ['envasados', 'Envasados con aceite de girasol en la etiqueta: pan de molde o incluso de masa madre, salsas, hummus, patatas de bolsa…', 'Aunque tú cocines con AOVE, el aceite de girasol se te cuela por aquí. Muchos panes "buenos" lo llevan.', 'Mira la etiqueta: pan de masa madre sin aceites de semillas, salsas caseras con AOVE.'],
  ['bolleria', 'Bollería, galletas o cereales de desayuno', 'Casi todos están hechos con aceites refinados.', 'Fruta, miel, dátiles, chocolate negro o repostería casera con mantequilla.'],
  ['margarina', 'Margarina o cremas para untar', 'Son aceites vegetales refinados y procesados.', 'Mantequilla de verdad.'],
  ['precocinados', 'Precocinados, pizzas congeladas o fritos de paquete', 'Vienen hechos o fritos con aceites de semillas.', 'Comida sencilla hecha en casa: patata, arroz, huevos, carne o pescado.'],
  ['zero', 'Refrescos zero o light, bebidas energéticas o edulcorantes', 'Los edulcorantes alteran tu flora intestinal.', 'Zumo de naranja natural, agua con limón o, de forma puntual, un refresco normal.'],
  ['light', 'Productos light, 0 % o desnatados', 'Les quitan la grasa que tu cuerpo necesita para fabricar hormonas.', 'Lácteos enteros, huevos enteros y queso de verdad.'],
  ['barritas', 'Barritas, snacks o batidos "proteicos"', 'Ultraprocesados con edulcorantes: proteína de más y comida de verdad de menos.', 'Fruta, un vaso de leche entera o un trozo de queso.'],
  ['alcohol', 'Alcohol en casa', 'Juega en contra de tus hormonas y de tu recuperación.', 'Agua de calidad o zumo natural.'],
  ['grifo', 'Agua del grifo sin filtrar para beber o cocinar', 'Puede llevar cloro, metales y microplásticos.', 'Un filtro de agua o agua embotellada, y guárdala en cristal.'],
  ['sarten', 'Sartenes de teflón o de aluminio', 'Pasan tóxicos a la comida, sobre todo cuando están rayadas o muy calientes.', 'Acero inoxidable, hierro o cerámica.'],
  ['plastico', 'Táperes o botellas de plástico', 'Al calentarse pueden soltar disruptores endocrinos.', 'Vidrio.']
];
/* [id, texto, para qué] */
var BUENOS = [
  ['fruta', 'Fruta madura, zumo de naranja natural, miel o dátiles', 'El azúcar de verdad es la energía más rápida para tu metabolismo. No le tengas miedo.'],
  ['hidratos', 'Patata, boniato, arroz o pan de masa madre', 'Tu hidrato de cada comida, también en la cena para dormir mejor.'],
  ['huevos', 'Huevos enteros', 'Proteína completa y la grasa con la que tu cuerpo fabrica hormonas.'],
  ['carne', 'Carne roja: ternera, cordero… (mejor de pasto)', 'Proteína de calidad con mejor perfil de grasas que el pollo o el cerdo.'],
  ['pescado', 'Pescado azul salvaje y marisco', 'DHA y minerales que casi nadie come suficiente.'],
  ['lacteos', 'Lácteos enteros: leche, yogur natural, queso', 'Proteína, calcio y saciedad sin productos light.'],
  ['caldo', 'Caldo de huesos, gelatina o vísceras (hígado, corazón…)', 'Equilibran los aminoácidos de la carne y aportan colágeno.'],
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
    {id:'noche', tipo:'una', t:'Por la noche, cuando te entra antojo de dulce, ¿qué tienes a mano?', ops:[['paquete','Algo de paquete: galletas, chocolatinas, snacks…'],['nada','Nada: me aguanto y evito comprarlo para no comérmelo'],['real','Fruta, yogur, miel, dátiles o algo de verdad']]},
    {id:'etiquetas', tipo:'una', t:'¿Miras las etiquetas de lo que compras?', ops:[['si','Sí'],['aveces','A veces'],['no','No']], noSe: 'No sé qué mirar',
      ciego: ['Qué mirar en una etiqueta', 'Si no sabes leer una etiqueta, los aceites de semillas y los edulcorantes se te cuelan en casi todo lo que compras.']}
  ]}
];

JG.iniciar({
  recurso: 'despensa',
  nombre: 'checklist de la despensa',
  paginas: PAGINAS,
  cargando: ['Revisando tu despensa…', 'Buscando qué te sabotea…', 'Preparando tu lista de la compra…'],
  calcular: function(R){
    var malos = (R.malos || []).filter(function(x){ return x !== 'ninguna'; });
    var buenos = (R.buenos || []).filter(function(x){ return x !== 'ninguna'; });
    var p = 50 + buenos.length * 6 - malos.length * 5 + ({lista:6, marcha:0, pedido:-8})[R.compra || 'marcha'] + ({real:6, nada:-2, paquete:-6})[R.noche || 'nada'] + (({si:4, aveces:0, no:-4})[R.etiquetas] || 0);
    p = Math.max(5, Math.min(98, Math.round(p)));
    var titulo, color, texto;
    if(p >= 75){ titulo = 'Despensa de 10'; color = '#7fb36e'; texto = 'Tu cocina juega a tu favor. Si aun así no pierdes barriga, el problema no está en lo que compras sino en cuánto comes, cuándo y cómo lo combinas.'; }
    else if(p >= 50){ titulo = 'Despensa mejorable'; color = '#f0a020'; texto = 'Tienes una buena base, pero hay cosas en casa que te sabotean sin que lo notes y te faltan alimentos clave.'; }
    else { titulo = 'Tu despensa te está saboteando'; color = '#d70438'; texto = 'Ahora mismo tu cocina te lo pone muy difícil. No es falta de fuerza de voluntad: es lo que hay en casa.'; }

    var fuera = MALOS.filter(function(m){ return malos.indexOf(m[0]) > -1; });
    var faltan = BUENOS.filter(function(b){ return buenos.indexOf(b[0]) === -1; });
    var fueraHTML = fuera.length
      ? '<ul class="errores">' + fuera.map(function(m){ return '<li><b>❌ ' + m[1] + '</b>' + m[2] + '<br><span style="color:var(--verde);font-weight:700">Cámbialo por:</span> ' + m[3] + '</li>'; }).join('') + '</ul>'
      : '<p class="muted">No tienes ningún saboteador en casa. 👏</p>';
    var faltanHTML = faltan.length
      ? '<ul class="errores">' + faltan.map(function(b){ return '<li class="bien"><b>🛒 ' + b[1] + '</b>' + b[2] + '</li>'; }).join('') + '</ul>'
      : '<p class="muted">No te falta nada básico. 👏</p>';
    var extra = [];
    if(malos.indexOf('envasados') === -1 && malos.indexOf('semillas') === -1) extra.push('Aunque cocines con AOVE, revisa la etiqueta del pan, las salsas y los snacks: el aceite de girasol se esconde en muchos envasados.');
    if(R.compra !== 'lista') extra.push('Haz la compra con lista una vez por semana: así entra en casa lo que te ayuda.');
    if(R.noche === 'nada') extra.push('No hace falta aguantarte: el antojo de dulce por la noche suele ser tu cuerpo pidiendo energía. Ten fruta, miel o dátiles a mano y cómetelos sin culpa.');
    else if(R.noche === 'paquete') extra.push('Cambia lo de paquete por fruta, yogur natural entero, miel o dátiles: el antojo de dulce por la noche suele ser falta de energía, no de fuerza de voluntad.');
    extra.push('No le tengas miedo al dulce de verdad: la fruta, la miel y los dátiles son tus aliados. Lo que tienes que sacar son los aceites refinados y los edulcorantes.');
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
