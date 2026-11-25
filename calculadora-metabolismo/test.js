/* Calculadora metabólica (palabra clave METABOLISMO)
   Objetivo: enseñar cuántas calorías MÁS podría comer perdiendo grasa si su metabolismo funcionara bien,
   frente a las que come ahora. «Lo que podrías comer» = su gasto con un metabolismo sano (moviéndose a diario
   y entrenando fuerza, como en el programa) con un margen pequeño para perder grasa. Nunca se le pide comer menos. */
var PAGINAS = [
  {titulo: 'Tus datos', sub: 'Los necesito para calcular tu gasto real.', preguntas: [
    {id:'sexo', tipo:'una', t:'Eres…', obligatoria: true, ops:[['h','Hombre'],['m','Mujer']], errorTxt:'Dime si eres hombre o mujer para calcular tu gasto.'},
    {id:'datos', tipo:'datos', t:'Edad, peso y altura', obligatoria: true, errorTxt:'Revisa tu edad, peso (kg) y altura (cm): los necesito para el cálculo.', campos:[
      {id:'edad', label:'Edad', ph:'35', min:16, max:90},
      {id:'peso', label:'Peso (kg)', ph:'82', min:35, max:250},
      {id:'altura', label:'Altura (cm)', ph:'178', min:130, max:225, full:true}]}
  ]},
  {titulo: 'Tu día a día', preguntas: [
    {id:'trabajo', tipo:'una', t:'¿Cómo es tu trabajo?', ops:[['sentado','Sentado casi todo el día'],['mixto','Sentado, pero me muevo algo'],['activo','De pie o con bastante movimiento']]},
    {id:'pasos', tipo:'una', t:'¿Cuántos pasos das al día?', ops:[['p1','Menos de 4.000'],['p2','4.000-7.000'],['p3','7.000-10.000'],['p4','Más de 10.000']], noSe: true,
      ciego: ['Cuánto te mueves', 'Sin saber cuánto caminas no sabes cuánta energía gastas fuera del gimnasio, y es donde más se nota.', 'cuánto me muevo']},
    {id:'entreno', tipo:'una', t:'¿Cuántos días entrenas fuerza a la semana?', ops:[['e0','Ninguno'],['e1','1-2 días'],['e2','3-4 días'],['e3','5 o más']]},
    {id:'horas', tipo:'una', t:'¿Cuántas horas duermes?', ops:[['s1','Menos de 6'],['s2','6-7'],['s3','7-8'],['s4','Más de 8']]},
    {id:'estres', tipo:'freq', t:'Vas estresado en tu día a día.'}
  ]},
  {titulo: 'Cómo comes', preguntas: [
    {id:'kcal', tipo:'una', t:'¿Cuántas calorías comes al día?', ops:[['exacto','Lo sé: te digo la cifra'],['k1','Menos de 1.500'],['k2','1.500-1.900'],['k3','1.900-2.300'],['k4','2.300-2.700'],['k5','Más de 2.700']], noSe: 'No sé cuánto como',
      ciego: ['Cuánto comes', 'No sabes cuánta energía le das a tu cuerpo, así que no sabes si le estás dando motivos para gastar o para ahorrar.', 'cuánto como']},
    {id:'kcalNum', tipo:'datos', t:'Escribe la cifra', soloSi:function(R){ return R.kcal === 'exacto'; }, campos:[{id:'kcalN', label:'Calorías al día', ph:'2100', min:800, max:6000, full:true}]},
    {id:'comida', tipo:'una', t:'Entonces, ¿cómo describirías lo que comes?', soloSi:function(R){ return R.kcal === JG.NS; }, ops:[['c1','Poco: me salto comidas o platos pequeños'],['c2','Controlado: siempre "a dieta"'],['c3','Normal: como hasta quedarme bien'],['c4','Bastante: picoteo y como mucho']]},
    {id:'tiempo', tipo:'una', t:'¿Cuánto tiempo llevas intentando perder grasa?', ops:[['t1','Menos de 3 meses'],['t2','3 meses - 1 año'],['t3','1-3 años'],['t4','Más de 3 años']]},
    {id:'hidratos', tipo:'una', t:'¿Qué haces con los hidratos (fruta, miel, patata, arroz, pan…)?', ops:[['h1','Los evito'],['h2','Como algo, con miedo'],['h3','Los como sin problema']]},
    {id:'proteina', tipo:'una', t:'¿Y con la proteína?', ops:[['pr1','Muchísima: pollo, batidos, claras…'],['pr2','Suficiente, sin obsesionarme'],['pr3','Poca, no me fijo']]},
    {id:'practicas', tipo:'multi', t:'¿Haces alguna de estas cosas?', ayuda:'Marca solo las que hagas.', ops:[['ayuno','Ayunos'],['cafe','Café nada más despertar'],['cardio','Cardio casi a diario'],['cardioayunas','Cardio en ayunas'],['frio','Duchas frías, hielo o sauna'],['finde','Estricto entre semana y sin control el finde'],['ninguna','Ninguna']]}
  ]},
  {titulo: 'Tu cuerpo te habla', preguntas: [
    {id:'senales', tipo:'multi', t:'¿Te pasa alguna de estas cosas a menudo?', ayuda:'Marca todas las que te suenen.', ops:[['fria','Manos o pies fríos'],['cansancio','Bajón de energía a media tarde'],['sueno','Duermes mal o te despiertas de madrugada'],['dulce','Antojo de dulce por la noche'],['digestion','Hinchazón o digestiones pesadas'],['libido','Pocas ganas o poca libido'],['foco','Te cuesta concentrarte'],['ninguna','Ninguna']]}
  ]}
];

function r50(x){ return Math.round(x / 50) * 50; }
function fmt(n){ return n.toLocaleString('es-ES'); }

JG.iniciar({
  recurso: 'calculadora-metabolismo',
  nombre: 'calculadora metabólica',
  paginas: PAGINAS,
  cargando: ['Analizando tus respuestas…', 'Calculando tu gasto real…', 'Comparando con lo que comes…'],
  calcular: function(R){
    var d = R.datos;
    var bmr = 10 * d.peso + 6.25 * d.altura - 5 * d.edad + (R.sexo === 'h' ? 5 : -161);
    /* Lo que podría comer perdiendo grasa con el metabolismo funcionando bien (moviéndose cada día y entrenando fuerza),
       dado como rango para ser prudentes: de un metabolismo que ya funciona (x1,55) a uno a pleno rendimiento (x1,75),
       con un margen pequeño para perder grasa sin pasar hambre (x0,92). */
    var extra = (({sentado:0, mixto:.03, activo:.1})[R.trabajo] || 0) + (R.pasos === 'p4' ? .05 : 0) + (R.entreno === 'e3' ? .05 : 0);
    var potMin = r50(bmr * (1.55 + extra) * 0.92), potMax = r50(bmr * (1.75 + extra) * 0.92);

    var actual = null, tipoActual = null, rangoTxt = '';
    var RANGOS = {k1:[1200, 1500, 'menos de 1.500'], k2:[1500, 1900, 'entre 1.500 y 1.900'], k3:[1900, 2300, 'entre 1.900 y 2.300'], k4:[2300, 2700, 'entre 2.300 y 2.700'], k5:[2700, 3100, 'más de 2.700']};
    var kn = R.kcalNum && R.kcalNum.kcalN;
    if(R.kcal === 'exacto' && kn >= 800 && kn <= 6000){ actual = Math.round(kn); tipoActual = 'exacto'; }
    else if(RANGOS[R.kcal]){ actual = (RANGOS[R.kcal][0] + RANGOS[R.kcal][1]) / 2; tipoActual = 'rango'; rangoTxt = RANGOS[R.kcal][2]; }
    else if(R.comida){ actual = r50(bmr * ({c1:.85, c2:.95, c3:1.25, c4:1.55})[R.comida]); tipoActual = 'estimado'; }
    var incMin = actual == null ? null : potMin - actual, incMax = actual == null ? null : potMax - actual;
    var dif = actual == null ? null : (incMin + incMax) / 2;

    var practicas = (R.practicas || []).filter(function(x){ return x !== 'ninguna'; });
    var senales = (R.senales || []).filter(function(x){ return x !== 'ninguna'; });
    var s = 100;
    if(R.trabajo === 'sentado') s -= 5;
    if(R.pasos === 'p1') s -= 5;
    s -= ({e0:8, e1:2, e2:0, e3:4})[R.entreno] || 0;
    s -= ({t1:0, t2:4, t3:7, t4:10})[R.tiempo] || 0;
    s -= ({h1:12, h2:6, h3:0})[R.hidratos] || 0;
    s -= ({pr1:6, pr2:0, pr3:4})[R.proteina] || 0;
    s -= Math.min(practicas.length * 4, 15);
    s -= Math.min(senales.length * 3, 18);
    s -= ({s1:10, s2:5, s3:0, s4:0})[R.horas] || 0;
    s -= [0, 2, 5, 8][parseInt(R.estres || '0', 10)] || 0;
    s -= ({c1:8, c2:8, c3:0, c4:0})[R.comida] || 0;
    if(dif != null){ if(dif > 700) s -= 20; else if(dif > 400) s -= 12; else if(dif > 200) s -= 6; }
    /* Coherencia: si come muy por debajo de lo que podría, su metabolismo no puede salir «en buena forma» */
    if(dif != null && dif > 400) s = Math.min(s, 60); else if(dif != null && dif > 200) s = Math.min(s, 72);
    s = Math.max(12, Math.min(96, Math.round(s)));

    var titulo, color, texto;
    if(s >= 75){ titulo = 'Metabolismo en buena forma'; color = '#7fb36e'; texto = 'Tu metabolismo responde bien. No necesitas cambios drásticos, sino ajustes bien colocados.'; }
    else if(s >= 50){ titulo = 'Metabolismo frenado'; color = '#f0a020'; texto = 'Tu cuerpo ha empezado a ahorrar energía. Si sigues recortando, cada vez te costará más perder grasa aunque comas menos.'; }
    else if(s >= 30){ titulo = 'Modo ahorro activado'; color = '#ff2d5c'; texto = 'Tu cuerpo está en modo ahorro: gasta lo mínimo para protegerse. Por eso, aunque comas poco, la barriga no se mueve. Bajar más la comida solo lo empeoraría.'; }
    else { titulo = 'Modo supervivencia'; color = '#d70438'; texto = 'Tu cuerpo está en modo supervivencia. Seguir así frena tu pérdida de grasa y también tu energía y tu salud. Si los síntomas son intensos o duran mucho, consúltalo también con tu médico.'; }

    /* Coherencia: si no come por debajo de lo que podría, no decirle que come poco */
    if(actual != null && incMin <= 100) texto = texto.replace('Por eso, aunque comas poco, la barriga no se mueve.', 'Por eso la barriga no se mueve: el freno no es cuánto comes, sino cómo está funcionando tu cuerpo.').replace('Si sigues recortando, cada vez', 'Si sigues igual, cada vez');
    /* Lo que se le enseña: como punto de partida, entre 400 y 600 kcal más de lo que come ahora
       (más si la fórmula sale por encima, en quien come muy poco). No es el techo: con el metabolismo acelerado podrá comer más. */
    var podMin = null, podMax = null;
    if(actual != null){
      podMin = r50(actual + Math.max(400, incMin));
      podMax = r50(actual + Math.max(600, incMax));
      if(podMax < podMin + 200) podMax = podMin + 200;
    } else { podMin = potMin; podMax = potMax; }
    var rangoPot = fmt(podMin) + '-' + fmt(podMax);
    var msg, incHTML = '';
    if(actual == null){
      msg = 'Con tu metabolismo funcionando bien, <b>podrías perder grasa comiendo entre ' + fmt(podMin) + ' y ' + fmt(podMax) + ' kcal al día</b>. Como no sabes cuánto comes ahora, no puedo decirte cuánto te separa de esa cifra: es lo primero que necesitas conocer.';
    } else {
      msg = 'Arreglando lo que te está frenando, <b>podrías estar comiendo entre ' + fmt(podMin) + ' y ' + fmt(podMax) + ' kcal al día y empezar a perder grasa</b>. Y esto es solo el punto de partida: a medida que tu metabolismo se acelera, puedes comer todavía más. Por eso en mi método se pierde grasa comiendo más, no menos.';
    }

    var E = [];
    if(dif != null && incMin > 100) E.push(['Comes por debajo de lo que tu cuerpo podría usar', 'Comiendo poco, tu cuerpo baja el gasto para protegerse: por eso cada vez necesitas comer menos para bajar lo mismo.']);
    if(R.hidratos === 'h1') E.push(['Has quitado los hidratos', 'Son la energía más fácil para tu cuerpo. Sin ellos tira de hormonas del estrés (cortisol, adrenalina) para fabricar glucosa y acaba ahorrando energía.']);
    if(R.hidratos === 'h2') E.push(['Comes hidratos con miedo', 'La fruta, la miel, la patata o el arroz no son el problema: son los que mantienen tu metabolismo encendido. Lo que importa es cuándo y con qué los comes.']);
    if(R.proteina === 'pr1') E.push(['Te pasas con la proteína', 'Más proteína no es más quema. Si te faltan hidratos, parte de esa proteína se usa para fabricar glucosa en vez de para construir músculo.']);
    if(R.tiempo === 't3' || R.tiempo === 't4') E.push(['Llevas demasiado tiempo a dieta', 'Cada dieta que empiezas y dejas enseña a tu cuerpo a gastar menos. Seguir restringiendo ya no funciona: toca primero recuperar el metabolismo.']);
    if(practicas.indexOf('ayuno') > -1) E.push(['Pasas muchas horas sin comer', 'Para un cuerpo que ya va justo de energía, cada ayuno es un estrés más que lo mete más en modo ahorro.']);
    if(practicas.indexOf('cafe') > -1) E.push(['Café nada más despertar', 'Al despertar tu cuerpo ya se activa solo. El café en ese momento te "enciende" con adrenalina, no con energía real: mejor al menos 1 hora después.']);
    if(practicas.indexOf('cardio') > -1 || practicas.indexOf('cardioayunas') > -1) E.push(['Cardio para quemar', 'Con poca comida, el cardio frecuente o en ayunas es otro estrés: tu cuerpo compensa gastando menos el resto del día.']);
    if(practicas.indexOf('frio') > -1) E.push(['Frío o sauna sin estar recuperado', 'Pueden ser útiles, pero si tu cuerpo va justo de energía suman estrés en vez de ayudar.']);
    if(practicas.indexOf('finde') > -1) E.push(['Todo o nada', 'Estricto entre semana y sin control el finde: tu cuerpo vive en una montaña rusa.']);
    if(R.entreno === 'e0') E.push(['No entrenas fuerza', 'Sin músculo que mantener, tu cuerpo no tiene motivo para gastar más. Con 3 días a la semana bien hechos es suficiente.']);
    if(R.horas === 's1' || R.horas === 's2') E.push(['Duermes poco', 'Con menos de 7 horas aumenta el hambre, baja la testosterona y tu cuerpo se agarra a la grasa.']);
    if(senales.length >= 3) E.push(['Tu cuerpo te da ' + senales.length + ' señales de alarma', 'Frío, cansancio, mal sueño, antojo de dulce… Son las señales típicas de un metabolismo que está ahorrando energía.']);

    var ahoraTxt = tipoActual === 'exacto' ? 'unas ' + actual + ' kcal' : tipoActual === 'rango' ? rangoTxt + ' kcal' : tipoActual === 'estimado' ? 'unas ' + actual + ' kcal (estimado)' : '';
    var resumen = 'Puntuación metabólica ' + s + '/100 (' + titulo + '). ' + (actual != null
      ? 'Como ' + ahoraTxt + ' y para empezar podría comer entre ' + podMin + ' y ' + podMax + ' kcal perdiendo grasa.'
      : 'No sé cuánto como; podría comer entre ' + podMin + ' y ' + podMax + ' kcal perdiendo grasa.');

    var acc = ['<b>Sube la comida poco a poco y empieza por los hidratos</b>: un plato de arroz o patata más, fruta madura en el desayuno, miel o zumo natural entre horas. Son las calorías que más rápido ' + (s < 75 ? 'sacan a tu cuerpo del modo ahorro' : 'mantienen tu metabolismo encendido') + ', bajan el estrés y mejoran tu descanso.'];
    if(R.proteina === 'pr1') acc.push('Baja un poco la proteína y las claras, y pásale ese espacio a los hidratos.');
    if(R.horas === 's1' || R.horas === 's2') acc.push('Cena con hidratos 2-3 horas antes de dormir: dormirás más profundo y te recuperarás mejor.');
    if(practicas.indexOf('ayuno') > -1 || practicas.indexOf('cafe') > -1) acc.push('Desayuna algo con hidrato y deja el café para al menos 1 hora después de despertarte.');
    acc.push('Cocina con aceite de oliva virgen extra, mantequilla o ghee, y quita los aceites de semillas (girasol, soja, maíz).');

    var ahoraBig = actual == null ? '¿?' : tipoActual === 'rango' ? (R.kcal === 'k1' ? '<1.500' : R.kcal === 'k5' ? '>2.700' : fmt(RANGOS[R.kcal][0]) + '-' + fmt(RANGOS[R.kcal][1])) : fmt(actual);
    var html =
      '<div class="res-bloque">' + JG.anillo(s, color, titulo, 'Tu puntuación metabólica') + '<p>' + texto + '</p></div>' +
      '<div class="res-bloque"><h3>Tus calorías</h3><div class="kcal">' +
        '<div><small>Lo que comes ahora' + (tipoActual === 'estimado' ? ' (estimado)' : '') + '</small><b' + (tipoActual === 'rango' ? ' style="font-size:21px;white-space:nowrap"' : '') + '>' + ahoraBig + '</b><small>kcal/día</small></div>' +
        '<div class="pot"><small>Lo que podrías comer perdiendo grasa</small><b style="font-size:21px;white-space:nowrap">' + rangoPot + '</b><small>kcal/día</small></div>' +
      '</div>' + incHTML + '<div class="destacado">' + msg + '</div>' +
      '<p class="muted" style="margin-top:10px;font-size:13px">Calculado para tu cuerpo con el metabolismo funcionando bien: moviéndote cada día y entrenando fuerza. Te doy un rango porque cada cuerpo responde distinto, y es solo el punto de partida.</p></div>' +
      '<div class="res-bloque"><h3>Lo que te está frenando</h3>' + JG.lista(E.slice(0, 6)) + '</div>' +
      '<div class="res-bloque"><h3>Por dónde empezar</h3>' + JG.acciones(acc.slice(0, 4)) + '</div>';
    return {html: html, resumen: resumen, puntuacion: s, extra: {actual: actual, tipoActual: tipoActual, podMin: podMin, podMax: podMax}};
  }
});
