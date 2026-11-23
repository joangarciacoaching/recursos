/* Calculadora metabólica (palabra clave CALCULADORA)
   Objetivo: cuántas calorías podría comer perdiendo grasa si su metabolismo funcionara bien, frente a las que come ahora. */
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
      ciego: ['Cuánto te mueves', 'Sin contar tus pasos no sabes cuánta energía gastas fuera del gimnasio, y es donde más se nota.']},
    {id:'entreno', tipo:'una', t:'¿Cuántos días entrenas fuerza a la semana?', ops:[['e0','Ninguno'],['e1','1-2 días'],['e2','3-4 días'],['e3','5 o más']]},
    {id:'horas', tipo:'una', t:'¿Cuántas horas duermes?', ops:[['s1','Menos de 6'],['s2','6-7'],['s3','7-8'],['s4','Más de 8']]},
    {id:'estres', tipo:'freq', t:'Vas estresado en tu día a día.'}
  ]},
  {titulo: 'Cómo comes', preguntas: [
    {id:'kcal', tipo:'una', t:'¿Cuántas calorías comes al día, más o menos?', ops:[['k1','Menos de 1.500'],['k2','1.500-1.900'],['k3','1.900-2.300'],['k4','2.300-2.700'],['k5','Más de 2.700']], noSe: 'No sé cuánto como',
      ciego: ['Cuánto comes', 'No mides lo que comes: no puedes ajustar lo que no conoces.']},
    {id:'comida', tipo:'una', t:'Entonces, ¿cómo describirías lo que comes?', soloSi:function(R){ return R.kcal === JG.NS; }, ops:[['c1','Poco: me salto comidas o platos pequeños'],['c2','Controlado: siempre "a dieta"'],['c3','Normal: como hasta quedarme bien'],['c4','Bastante: picoteo y como mucho']]},
    {id:'tiempo', tipo:'una', t:'¿Cuánto tiempo llevas intentando perder grasa?', ops:[['t1','Menos de 3 meses'],['t2','3 meses - 1 año'],['t3','1-3 años'],['t4','Más de 3 años']]},
    {id:'hidratos', tipo:'una', t:'¿Qué haces con los hidratos (arroz, patata, fruta, pan…)?', ops:[['h1','Los evito'],['h2','Como algo, con miedo'],['h3','Los como sin problema']]},
    {id:'proteina', tipo:'una', t:'¿Y con la proteína?', ops:[['pr1','Muchísima: pollo, batidos, claras…'],['pr2','Suficiente, sin obsesionarme'],['pr3','Poca, no me fijo']]},
    {id:'practicas', tipo:'multi', t:'¿Haces alguna de estas cosas?', ops:[['ayuno','Ayuno o me salto el desayuno'],['cafe','Café en ayunas o varios al día'],['cardio','Mucho cardio o cardio en ayunas'],['frio','Duchas frías, hielo o sauna'],['finde','Estricto entre semana y descontrol el finde'],['ninguna','Ninguna']]}
  ]},
  {titulo: 'Tu cuerpo te habla', preguntas: [
    {id:'senales', tipo:'multi', t:'¿Te pasa alguna de estas cosas a menudo?', ops:[['fria','Manos o pies fríos'],['cansancio','Bajón de energía a media tarde'],['sueno','Duermes mal o te despiertas de madrugada'],['dulce','Ansia por el dulce por la noche'],['digestion','Hinchazón o digestiones pesadas'],['libido','Pocas ganas o poca libido'],['foco','Te cuesta concentrarte'],['ninguna','Ninguna']]}
  ]}
];

function r50(x){ return Math.round(x / 50) * 50; }
function fmt(n){ return n.toLocaleString('es-ES'); }

JG.iniciar({
  recurso: 'calculadora-metabolismo',
  nombre: 'calculadora metabólica',
  paginas: PAGINAS,
  cargando: ['Analizando tus respuestas…', 'Calculando tu gasto real…', 'Detectando tus frenos metabólicos…'],
  ctaTexto: 'Mándame tu resultado y te digo cómo empezaría yo contigo a subir calorías sin miedo.',
  calcular: function(R){
    var d = R.datos;
    var bmr = 10 * d.peso + 6.25 * d.altura - 5 * d.edad + (R.sexo === 'h' ? 5 : -161);
    var fct = ({sentado:1.2, mixto:1.3, activo:1.45})[R.trabajo] || 1.25;
    fct += ({p1:0, p2:.05, p3:.1, p4:.15})[R.pasos] || 0;
    fct += ({e0:0, e1:.05, e2:.1, e3:.13})[R.entreno] || 0;
    var potencial = r50(bmr * fct * 0.85);

    var actual = null, estimado = false;
    if(R.kcal && R.kcal !== JG.NS) actual = ({k1:1350, k2:1700, k3:2100, k4:2500, k5:2900})[R.kcal];
    else if(R.comida){ actual = r50(bmr * ({c1:.85, c2:.95, c3:1.25, c4:1.55})[R.comida]); estimado = true; }
    var dif = actual == null ? null : potencial - actual;

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
    if(dif != null){ if(dif > 500) s -= 10; else if(dif > 250) s -= 6; }
    s = Math.max(12, Math.min(96, Math.round(s)));

    var titulo, color, texto;
    if(s >= 75){ titulo = 'Metabolismo en buena forma'; color = '#7fb36e'; texto = 'Tu metabolismo responde bien. No necesitas cambios drásticos, sino ajustes bien colocados.'; }
    else if(s >= 50){ titulo = 'Metabolismo frenado'; color = '#f0a020'; texto = 'Tu cuerpo ha empezado a ahorrar energía. Si sigues igual, cada vez te costará más perder grasa aunque comas menos.'; }
    else if(s >= 30){ titulo = 'Modo ahorro activado'; color = '#ff2d5c'; texto = 'Tu cuerpo está en modo ahorro: gasta lo mínimo para protegerse. Por eso, aunque comas poco, la barriga no se mueve. Bajar más la comida solo lo empeoraría.'; }
    else { titulo = 'Modo supervivencia'; color = '#d70438'; texto = 'Tu cuerpo está en modo supervivencia. Seguir así frena tu pérdida de grasa y también tu energía y tu salud. Si los síntomas son intensos o duran mucho, consúltalo también con tu médico.'; }

    var msg;
    if(dif == null) msg = 'Con tus datos, <b>podrías perder grasa comiendo unas ' + fmt(potencial) + ' kcal al día</b>. Como no sabes cuánto comes ahora, no puedo decirte cuánto te separa de esa cifra: ese es el primer dato que necesitas conocer.';
    else if(dif > 150) msg = 'Podrías estar comiendo <b>unas ' + fmt(dif) + ' kcal más al día</b> y aun así perder grasa. El problema no es que comas demasiado: es que tu cuerpo se ha adaptado a comer poco. Eso es justo lo que trabajo en el Reset Metabólico.';
    else if(dif >= -150) msg = 'Comes cerca de lo que tu cuerpo necesita para perder grasa. Tu freno no está en la cantidad, sino en <b>qué comes, cuándo y cómo te recuperas</b>.';
    else msg = 'Ahora mismo comes <b>unas ' + fmt(-dif) + ' kcal por encima</b> de lo que necesitarías para perder grasa. Tu caso no es de modo ahorro: necesitas otra estrategia, más ordenada y sin pasar hambre.';

    var E = [];
    if(dif != null && dif > 250) E.push(['Comes por debajo de lo que tu cuerpo necesita', 'Comiendo menos, tu cuerpo baja el gasto para protegerse: por eso cada vez necesitas comer menos para bajar lo mismo.']);
    if(R.hidratos === 'h1') E.push(['Has quitado los hidratos', 'Son el combustible que tu tiroides necesita para mantener tu metabolismo encendido. Sin ellos, tu cuerpo tira de hormonas del estrés y ahorra energía.']);
    if(R.hidratos === 'h2') E.push(['Comes hidratos con miedo', 'El problema no son los hidratos, es cuándo y con qué los combinas. Bien colocados, son los que te ayudan a quemar.']);
    if(R.proteina === 'pr1') E.push(['Te pasas con la proteína', 'Más proteína no es más quema. Llenarte de proteína y quedarte corto de hidratos te deja sin energía y frena tu metabolismo.']);
    if(R.tiempo === 't3' || R.tiempo === 't4') E.push(['Llevas demasiado tiempo a dieta', 'Cada dieta que empiezas y dejas enseña a tu cuerpo a gastar menos. Seguir restringiendo ya no funciona: toca primero recuperar el metabolismo.']);
    if(practicas.indexOf('ayuno') > -1) E.push(['Ayunas o te saltas comidas', 'Para un cuerpo que ya va justo de energía, el ayuno es un estrés más que te mete más en modo ahorro.']);
    if(practicas.indexOf('cafe') > -1) E.push(['Tiras de café', 'El café en ayunas te "activa" con adrenalina, no con energía real. Tapa el cansancio, pero no lo arregla.']);
    if(practicas.indexOf('cardio') > -1) E.push(['Mucho cardio para quemar', 'El cardio en exceso con poca comida es otro estrés: tu cuerpo compensa gastando menos el resto del día.']);
    if(practicas.indexOf('frio') > -1) E.push(['Biohacking sin recuperarte', 'Frío, sauna o hielo suman estrés. Sin comer y descansar suficiente, restan en vez de sumar.']);
    if(practicas.indexOf('finde') > -1) E.push(['Todo o nada', 'Estricto entre semana y descontrol el finde: tu cuerpo vive en una montaña rusa.']);
    if(R.entreno === 'e0') E.push(['No entrenas fuerza', 'Sin músculo que mantener, tu cuerpo no tiene motivo para gastar más. Con 3 entrenos cortos a la semana es suficiente.']);
    if(R.horas === 's1' || R.horas === 's2') E.push(['Duermes poco', 'Con menos de 7 horas aumenta el hambre, baja la testosterona y tu cuerpo se agarra a la grasa.']);
    if(senales.length >= 3) E.push(['Tu cuerpo te da ' + senales.length + ' señales de alarma', 'Frío, cansancio, mal sueño, ansia por el dulce… Son las señales típicas de un metabolismo que está ahorrando energía.']);

    var resumen = 'Puntuación metabólica ' + s + '/100 (' + titulo + '). ' + (actual != null ? 'Como unas ' + actual + ' kcal' + (estimado ? ' (estimado)' : '') + ' y podría comer unas ' + potencial + ' kcal perdiendo grasa.' : 'No sé cuánto como; podría comer unas ' + potencial + ' kcal perdiendo grasa.');
    var html =
      '<div class="res-bloque">' + JG.anillo(s, color, titulo, 'Tu puntuación metabólica') + '<p>' + texto + '</p></div>' +
      '<div class="res-bloque"><h3>Tus calorías</h3><div class="kcal">' +
        '<div><small>Lo que comes ahora' + (estimado ? ' (estimado)' : '') + '</small><b>' + (actual != null ? fmt(actual) : '¿?') + '</b><small>kcal/día</small></div>' +
        '<div class="pot"><small>Lo que podrías comer perdiendo grasa</small><b>' + fmt(potencial) + '</b><small>kcal/día</small></div>' +
      '</div><div class="destacado">' + msg + '</div></div>' +
      '<div class="res-bloque"><h3>Lo que te está frenando</h3>' + JG.lista(E.slice(0, 6)) + '</div>';
    return {html: html, resumen: resumen, puntuacion: s, extra: {actual: actual, potencial: potencial, estimado: estimado}};
  }
});
