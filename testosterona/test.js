/* Test: ¿Qué está bajando tu testosterona? (palabra clave TESTOSTERONA)
   Cada opción vale 0 (como un hombre de hace 50 años), 1 (a medio camino) o 2 (como uno de ahora).
   Basado en la guía de testosterona de Joan: energía disponible, calidad de la comida, sol y sueño, estrés, fuerza y tóxicos. */
function q(id, area, t, ops, extra){ var o = {id: id, area: area, tipo: 'una', t: t, ops: ops}; for(var k in extra || {}) o[k] = extra[k]; return o; }
var FREQ_MALO = [['0','Nunca'],['1','A veces'],['2','Casi siempre'],['2b','Siempre']];

var PAGINAS = [
  {titulo: 'Tus días', preguntas: [
    q('sol', 'sol', '¿Cuánto sol directo te da al día?', [['2','Casi nada: casa, coche y oficina'],['1','Un rato, 10-30 minutos'],['0','Más de 30 minutos al aire libre']]),
    q('acostar', 'sol', '¿A qué hora te sueles acostar?', [['2','Después de las 00:30'],['1','Entre las 23:00 y las 00:30'],['0','Antes de las 23:00']]),
    q('horas', 'sueno', '¿Cuántas horas duermes de verdad?', [['2','Menos de 6'],['1','Entre 6 y 7'],['0','7 o más']]),
    q('movil', 'sueno', 'El móvil es lo último que miras antes de dormir.', FREQ_MALO),
    q('estres', 'estres', 'Vas estresado: trabajo, familia y poco tiempo para ti.', FREQ_MALO),
    q('cafe', 'estres', '¿Cuánto café o bebidas energéticas tomas?', [['2','3 o más al día, o energéticas'],['1','1-2 cafés'],['0','Uno por la mañana o ninguno']])
  ]},
  {titulo: 'Tu comida', preguntas: [
    q('dieta', 'energia', 'Estás a dieta o comiendo menos para bajar de peso.', FREQ_MALO),
    q('ayuno', 'energia', 'Haces ayunos o te saltas comidas.', FREQ_MALO),
    q('hidratos', 'energia', 'Quitas o reduces los hidratos (fruta, miel, pan, arroz, patata).', FREQ_MALO),
    q('grasas', 'comida', '¿Comes huevos enteros, carne roja y lácteos enteros?', [['2','Los evito: claras, pechuga, todo light'],['1','A veces'],['0','Sí, con normalidad']], {ayuda:'Tu cuerpo fabrica la testosterona a partir del colesterol.'}),
    q('aceite', 'comida', '¿Con qué aceite se cocina lo que comes?', [['2','Girasol u oliva a secas'],['1','Depende, un poco de todo'],['0','Oliva virgen extra, mantequilla o ghee']]),
    q('paquete', 'comida', '¿Cuánto de lo que comes viene de paquete (bollería, snacks, salsas, precocinados)?', [['2','Bastante'],['1','Algo'],['0','Casi nada']]),
    q('alcohol', 'toxicos', 'Bebes alcohol durante la semana.', FREQ_MALO)
  ]},
  {titulo: 'Tu cuerpo y tus señales', preguntas: [
    q('fuerza', 'fuerza', '¿Cuántos días entrenas fuerza a la semana?', [['2','Ninguno'],['1','1-2 días'],['0','3-4 días'],['1b','5 o más']]),
    q('sentado', 'fuerza', '¿Cuántas horas pasas sentado al día?', [['2','Más de 8'],['1','Entre 5 y 8'],['0','Menos de 5']]),
    q('plastico', 'toxicos', 'Calientas comida en táperes de plástico o bebes de botellas de plástico.', FREQ_MALO),
    {id:'senales', tipo:'multi', t:'¿Notas alguna de estas cosas?', ayuda:'Marca todas las que te suenen.', ops:[
      ['libido','Menos libido o menos erecciones por la mañana que antes'],
      ['energia','Poca energía o desgana durante el día'],
      ['musculo','Te cuesta ganar fuerza o músculo'],
      ['grasa','Grasa en la barriga o el pecho que no se va'],
      ['animo','Irritabilidad, desmotivación o poca confianza'],
      ['sueno','Te levantas sin haber descansado'],
      ['recupera','Tardas mucho en recuperarte de los entrenos'],
      ['ninguna','Ninguna de estas']]},
    {id:'analitica', tipo:'una', t:'¿Te has hecho una analítica de testosterona en el último año?', ops:[['bajo','Sí, y salía baja o justa'],['normal','Sí, y salía bien'],['no','No']], noSe: true,
      ciego: ['Tu testosterona real', 'Estás intentando mejorar algo que no conoces. Una analítica te dice de dónde partes.', 'mi testosterona real']}
  ]}
];

var AREAS = {
  energia: {nombre:'Energía disponible', error:['Le das a tu cuerpo señales de escasez', 'Dietas, ayunos y pocos hidratos le dicen a tu cuerpo que falta energía. Y cuando falta energía, una de las primeras cosas que recorta es la producción de hormonas.'], accion:'Come suficiente y sin miedo al azúcar de verdad: fruta madura en cada comida, algo de miel durante el día e hidrato (patata, arroz, pan de masa madre) en cada plato.'},
  comida: {nombre:'Calidad de lo que comes', error:['A tus hormonas les falta materia prima', 'Huir de las yemas, la carne roja y los lácteos enteros, y comer aceites de semillas (girasol, soja, maíz), que van en casi todo lo envasado, deja a tus hormonas sin materia prima y con más inflamación.'], accion:'Huevos enteros, carne roja, pescado y marisco, y lácteos enteros. Cocina con AOVE, mantequilla o ghee, y fuera los aceites de semillas, también los escondidos en envasados.'},
  sol: {nombre:'Sol y ritmos', error:['Vives desregulado del sol', 'Los hombres de antes vivían con la luz del día. Poca luz por la mañana y acostarte tarde desajustan tu reloj interno, que es el que marca cuándo se fabrican tus hormonas.'], accion:'Nada más despertar, 5-10 minutos a la luz del sol sin gafas, y ve adelantando la hora de acostarte hacia las 22:00-23:00.'},
  sueno: {nombre:'Sueño', error:['Duermes poco o mal', 'Gran parte de la testosterona se fabrica mientras duermes. Con pocas horas y el móvil hasta el último minuto, tu cuerpo no llega a producirla.'], accion:'Duerme 7-8 horas, deja el móvil fuera de la habitación y cena con hidratos (patata, arroz o fruta): dormirás más profundo.'},
  estres: {nombre:'Estrés y estimulantes', error:['Vives en alerta', 'Estrés todo el día y café para aguantar: tu cuerpo vive tirando de cortisol y adrenalina, y eso frena la testosterona.'], accion:'Toma el primer café al menos 1 hora después de despertarte, nada de cafeína por la tarde y busca un rato al día sin pantallas.'},
  fuerza: {nombre:'Fuerza y movimiento', error:['Le das pocos motivos a tu cuerpo', 'Muchas horas sentado y poca fuerza bien hecha: tu cuerpo no tiene motivo para fabricar músculo ni testosterona.'], accion:'Entrena fuerza 3-4 días con pocos ejercicios y series intensas, y camina: acércate a los 10.000 pasos al día.'},
  toxicos: {nombre:'Tóxicos del día a día', error:['Alcohol y plásticos en tu día a día', 'El alcohol y los plásticos, sobre todo calientes, son disruptores endocrinos: juegan en contra de tus hormonas.'], accion:'Pasa a vidrio para guardar y calentar la comida, y deja el alcohol fuera de tu semana.'}
};

JG.iniciar({
  recurso: 'testosterona',
  nombre: 'test de la testosterona',
  paginas: PAGINAS,
  cargando: ['Analizando tus hábitos…', 'Comparándolos con los de un hombre de hace 50 años…', 'Preparando tus prioridades…'],
  calcular: function(R){
    var a = {};
    Object.keys(AREAS).forEach(function(k){ a[k] = {s: 0, max: 0}; });
    PAGINAS.forEach(function(p){ p.preguntas.forEach(function(x){
      if(!x.area) return; var v = R[x.id]; if(v == null || v === JG.NS) return;
      a[x.area].s += parseInt(v, 10); a[x.area].max += 2;
    }); });
    var total = 0, maxTotal = 0;
    Object.keys(a).forEach(function(k){ total += a[k].s; maxTotal += a[k].max; a[k].pct = a[k].max ? a[k].s / a[k].max : null; });
    var senales = (R.senales || []).filter(function(x){ return x !== 'ninguna'; });
    if(maxTotal < 6 && !senales.length) return {vacio: true};
    var pts = Math.round(100 - (maxTotal ? total / maxTotal : 0.4) * 80 - Math.min(senales.length * 3, 20));
    pts = Math.max(5, Math.min(98, pts));

    var titulo, color, texto;
    if(pts >= 75){ titulo = 'Vives como un hombre de antes'; color = '#7fb36e'; texto = 'Tus hábitos juegan a favor de tu testosterona. Te quedan pocos ajustes.'; }
    else if(pts >= 50){ titulo = 'A medio camino'; color = '#f0a020'; texto = 'Tienes cosas de hombre de antes y cosas muy de ahora. Esos hábitos de ahora te están quitando energía, músculo y ganas sin que lo notes.'; }
    else if(pts >= 30){ titulo = 'Estilo de vida de hombre de ahora'; color = '#ff2d5c'; texto = 'Tu día a día se parece mucho más al de un hombre de hoy que al de uno de hace 50 años. Tu testosterona lo está notando: menos energía, más grasa en la barriga y menos ganas.'; }
    else { titulo = 'Tus hábitos están hundiendo tu testosterona'; color = '#d70438'; texto = 'Casi todo en tu día a día juega en contra de tus hormonas. La buena noticia: son hábitos, y los hábitos se cambian.'; }

    var orden = Object.keys(a).filter(function(k){ return a[k].pct != null; }).sort(function(x, y){ return a[y].pct - a[x].pct; });
    var barras = Object.keys(a).sort(function(x, y){ return (a[y].pct == null ? -1 : a[y].pct) - (a[x].pct == null ? -1 : a[x].pct); }).map(function(k){
      if(a[k].pct == null) return JG.barra(AREAS[k].nombre, 3, 'Sin datos', '#555');
      var p = a[k].pct, c = p >= .6 ? '#d70438' : p >= .3 ? '#f0a020' : '#7fb36e';
      return JG.barra(AREAS[k].nombre, 100 - Math.round(p * 100), p >= .6 ? 'Como un hombre de ahora' : p >= .3 ? 'Mejorable' : 'Como uno de antes', c);
    }).join('');
    var errores = orden.filter(function(k){ return a[k].pct >= .5; }).map(function(k){ return AREAS[k].error; });
    if(R.fuerza === '1b') errores.push(['Entrenas 5 días o más', 'Si además comes poco o duermes mal, entrenar tantos días es más estrés que estímulo. Con 3-4 días bien hechos avanzarías más.']);
    var prio = orden.slice(0, 3).filter(function(k){ return a[k].pct > 0; }).map(function(k){ return AREAS[k].accion; });
    if(!prio.length) prio = ['Mantén tus hábitos y céntrate en entrenar con intensidad y comer suficiente.'];

    var aviso = '';
    if(R.analitica === 'bajo') aviso = '<div class="destacado" style="margin-top:14px">Tu analítica ya salía <b>baja o justa</b>. Con tus hábitos actuales tiene sentido: es lo primero que trabajaríamos. Mándamela junto a tu resultado y lo vemos.</div>';
    else if(senales.length >= 3) aviso = '<div class="destacado" style="margin-top:14px">Marcas <b>' + senales.length + ' señales</b> típicas de testosterona baja. Te recomiendo hacerte una analítica con tu médico para ver tus niveles reales.</div>';

    var resumen = 'Mi puntuación de hombre de antes: ' + pts + '/100 (' + titulo + ').' + (orden.length ? ' Lo que más me baja la testosterona: ' + AREAS[orden[0]].nombre + '.' : '') + (senales.length ? ' Señales: ' + senales.length + '.' : '') + (R.analitica === 'bajo' ? ' Mi analítica salía baja.' : '');
    var html =
      '<div class="res-bloque">' + JG.anillo(pts, color, titulo, 'Tu puntuación de hombre de antes') + '<p>' + texto + '</p>' + aviso + '</div>' +
      '<div class="res-bloque"><h3>Tus hábitos, área por área</h3><div class="barras">' + barras + '</div></div>' +
      '<div class="res-bloque"><h3>Lo que más te está bajando la testosterona</h3>' + JG.lista(errores) + '</div>' +
      '<div class="res-bloque"><h3>Tus 3 prioridades</h3>' + JG.acciones(prio) + '</div>';
    return {html: html, resumen: resumen, puntuacion: pts, extra: {areas: a, senales: senales, analitica: R.analitica || null}};
  }
});
