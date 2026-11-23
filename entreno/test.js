/* Test: ¿Cuántos días deberías entrenar? (palabra clave ENTRENO) */
function si(R){ return R.dias !== '0'; }
var PAGINAS = [
  {titulo: 'Tu entreno ahora', preguntas: [
    {id:'objetivo', tipo:'una', t:'¿Qué quieres conseguir?', ops:[['barriga','Perder barriga y definir'],['musculo','Ganar músculo y verme más fuerte'],['ambos','Las dos cosas']]},
    {id:'dias', tipo:'una', t:'¿Cuántos días entrenas a la semana?', ops:[['0','Ninguno'],['2','1-2'],['3','3'],['4','4'],['5','5'],['6','6 o más']]},
    {id:'duracion', tipo:'una', t:'¿Cuánto dura cada sesión?', soloSi: si, ops:[['45','Menos de 45 min'],['60','45-60 min'],['90','60-90 min'],['120','Más de 90 min']]},
    {id:'rutina', tipo:'una', t:'¿Cómo organizas tu rutina?', soloSi: si, ops:[['weider','Un músculo o dos por día'],['global','Cuerpo completo o torso-pierna'],['libre','Sin estructura: lo que me apetece'],['clases','Clases, crossfit o sobre todo cardio']]},
    {id:'ejercicios', tipo:'una', t:'¿Cuántos ejercicios haces por sesión?', soloSi: function(R){ return si(R) && R.rutina !== 'clases'; }, ops:[['4','4 o menos'],['6','5-7'],['9','8-10'],['11','Más de 10']], noSe: true,
      ciego: ['Lo que haces en cada sesión', 'Si no sabes cuántos ejercicios y series haces, no puedes progresar ni ajustar.']},
    {id:'intensidad', tipo:'una', t:'¿Llegas cerca del fallo en tus series (que no podrías hacer 1-2 repeticiones más)?', soloSi: si, ops:[['baja','Casi nunca'],['media','En algunas series'],['alta','En casi todas']], noSe: true,
      ciego: ['Lo cerca del fallo que entrenas', 'Sin saber cuánto te queda en cada serie, no sabes si estás dando el estímulo que tu cuerpo necesita para cambiar.']},
    {id:'progreso', tipo:'una', t:'¿Estás progresando?', soloSi: si, ops:[['sube','Sí, subo pesos o repeticiones'],['estanca','Llevo meses estancado'],['baja','Voy a peor']], noSe: 'No lo apunto',
      ciego: ['Si estás progresando', 'Si no apuntas pesos y repeticiones, no sabes si avanzas. Sin progresión, tu cuerpo no tiene motivo para cambiar.']}
  ]},
  {titulo: 'Tu recuperación', preguntas: [
    {id:'recupera', tipo:'una', t:'¿Cómo te recuperas entre entrenos?', soloSi: si, ops:[['bien','Bien, llego con ganas'],['regular','Regular'],['mal','Mal: agujetas, cansancio o molestias']]},
    {id:'energia', tipo:'una', t:'¿Cómo llegas a entrenar?', soloSi: si, ops:[['energia','Con energía'],['cafe','Tirando de café o pre-entreno'],['arrastras','Arrastrándome']]},
    {id:'sueno', tipo:'una', t:'¿Cuántas horas duermes?', ops:[['s1','Menos de 6'],['s2','6-7'],['s3','7 o más']]},
    {id:'comida', tipo:'una', t:'¿Comes suficiente para lo que entrenas?', ops:[['poco','No: dieta, ayunos o pocos hidratos'],['regular','Más o menos'],['bien','Sí, como bien']]},
    {id:'cardio', tipo:'una', t:'Además, ¿cuánto cardio haces?', ops:[['mucho','Mucho: casi a diario o sesiones largas'],['algo','Algo, 1-2 veces por semana'],['nada','Nada o solo caminar']]},
    {id:'disponible', tipo:'una', t:'Siendo realista, ¿cuántos días podrías entrenar sin agobiarte?', ops:[['2','2'],['3','3'],['4','4'],['5','5 o más']]}
  ]}
];

JG.iniciar({
  recurso: 'entreno',
  nombre: 'test de los días de entreno',
  paginas: PAGINAS,
  cargando: ['Analizando tu entreno…', 'Calculando tu recuperación…', 'Eligiendo tus días ideales…'],
  ctaTexto: 'Mándame tu resultado y te digo cómo repartiría yo tus días y qué ejercicios elegiría para tu objetivo.',
  calcular: function(R){
    var dias = R.dias != null ? parseInt(R.dias, 10) : null;
    var dur = parseInt(R.duracion || '0', 10), ej = R.ejercicios && R.ejercicios !== JG.NS ? parseInt(R.ejercicios, 10) : 0;
    var disp = R.disponible ? parseInt(R.disponible, 10) : 3;
    var recBuena = (R.recupera === 'bien' || dias === 0) && R.sueno === 's3' && R.comida !== 'poco' && R.cardio !== 'mucho' && R.energia !== 'arrastras';
    var rec = disp <= 2 ? 2 : (recBuena && disp >= 4 ? 4 : 3);
    var ahorro = R.energia === 'cafe' || R.energia === 'arrastras';

    var E = [], ef = 100;
    if(dias >= 5){ E.push(['Entrenas demasiados días', 'No le das tiempo a tu cuerpo a recuperarse. Es en el descanso donde se construye el músculo y se pierde la grasa.']); ef -= dias >= 6 ? 22 : 15; }
    if(dur >= 90){ E.push(['Sesiones demasiado largas', 'Más de una hora suele significar volumen de relleno. Lo que cuenta son las series intensas, no las horas en el gimnasio.']); ef -= dur >= 120 ? 15 : 10; }
    if(ej >= 9){ E.push(['Demasiados ejercicios', 'Con 8 o más por sesión es imposible darlo todo en cada uno. Mejor 4-6 bien elegidos y con intensidad.']); ef -= 10; }
    if(R.rutina === 'weider'){ E.push(['Un músculo al día', 'La rutina de culturista te obliga a entrenar muchos días para estimular cada músculo una sola vez. Para un físico estético sin vivir en el gimnasio funciona mejor un enfoque global.']); ef -= 10; }
    if(R.rutina === 'libre'){ E.push(['Sin estructura', 'Si cada día haces lo que te apetece, no hay progresión. Sin progresión, tu cuerpo no tiene motivo para cambiar.']); ef -= 12; }
    if(R.rutina === 'clases'){ E.push(['Mucho cansancio, poco estímulo', 'Las clases y el cardio cansan mucho, pero no le dan a tu cuerpo la señal de construir músculo.']); ef -= 15; }
    if(R.intensidad === 'baja'){ E.push(['Te quedas lejos del fallo', 'Si terminas las series pudiendo hacer muchas más, tu cuerpo no tiene que adaptarse. Pocas series, pero de verdad.']); ef -= 15; }
    if(R.progreso === 'estanca' || R.progreso === 'baja'){ E.push([R.progreso === 'baja' ? 'Vas a peor' : 'Llevas meses estancado', 'Es la señal más clara de que algo no cuadra: o entrenas de más, o te recuperas de menos, o las dos cosas.']); ef -= R.progreso === 'baja' ? 15 : 10; }
    if(R.recupera === 'mal'){ E.push(['No te recuperas', 'Estás entrenando por encima de lo que tu cuerpo puede asimilar.']); ef -= 10; }
    if(ahorro){ E.push([R.energia === 'cafe' ? 'Entrenas tirando de estimulantes' : 'Llegas a entrenar sin energía', 'Si necesitas café o pre-entreno para rendir, o llegas arrastrándote, tu cuerpo puede estar en modo ahorro. Entrenar más no lo arregla: primero hay que recuperar la energía.']); ef -= 10; }
    if(R.cardio === 'mucho'){ E.push(['Demasiado cardio', 'Compite con tu recuperación y te mete en modo ahorro: tu cuerpo gasta menos el resto del día.']); ef -= 10; }
    if(R.comida === 'poco'){ E.push(['Entrenas sin gasolina', 'Entrenar fuerte comiendo poco es la receta para estancarte. Tu cuerpo necesita energía para cambiar.']); ef -= 10; }
    if(R.sueno === 's1'){ E.push(['Duermes muy poco', 'Con menos de 6 horas, por bien que entrenes, tu cuerpo no se recupera.']); ef -= 8; }
    if(dias === 0){ E.push(['Ahora mismo no entrenas', 'Sin fuerza tu cuerpo no tiene motivo para mantener ni ganar músculo. Empezar con ' + rec + ' días cortos lo cambia todo.']); ef = Math.min(ef, 40); }
    else if(dias != null && dias <= 2 && rec >= 3){ E.push(['Te falta un día', 'Con 1-2 días es difícil estimular todo el cuerpo lo suficiente. Con uno más notarías el cambio.']); ef -= 8; }
    ef = Math.max(10, Math.min(98, ef));

    var diag, color;
    if(dias === 0){ diag = 'Toca empezar'; color = '#f0a020'; }
    else if((dias != null && dias > rec) || dur >= 90 || ej >= 9 || R.recupera === 'mal' || R.cardio === 'mucho'){ diag = 'Estás entrenando de más'; color = '#d70438'; }
    else if((dias != null && dias < rec) || R.intensidad === 'baja'){ diag = 'Te falta estímulo'; color = '#f0a020'; }
    else if(ef >= 75){ diag = 'Tu entreno va bien encaminado'; color = '#7fb36e'; }
    else { diag = 'Tu entreno se puede optimizar'; color = '#f0a020'; }
    var texto = diag === 'Estás entrenando de más' ? 'Le estás pidiendo a tu cuerpo más de lo que puede recuperar. Por eso, aunque te esfuerces, tu físico no cambia como debería. Vas a conseguir más entrenando menos.'
      : diag === 'Te falta estímulo' ? 'Entrenas poco o sin la intensidad suficiente para que tu cuerpo tenga que cambiar. No necesitas vivir en el gimnasio, pero sí que cada sesión cuente.'
      : diag === 'Toca empezar' ? 'Empezar con pocos días bien hechos es mucho mejor que lanzarte a entrenar todos los días y dejarlo en un mes.'
      : 'Tienes una buena base. Ahora se trata de ajustar los detalles para que cada sesión rinda al máximo.';

    var plan = rec === 2 ? '2 días de cuerpo completo' : rec === 3 ? '3 días: cuerpo completo o torso / pierna / cuerpo completo' : '4 días: torso / pierna / torso / pierna';
    var acc = ['<b>' + plan + '.</b>', 'Sesiones de <b>45-60 minutos</b> con <b>4-6 ejercicios</b>: pocos y bien elegidos.', 'Pocas series, pero <b>al fallo técnico</b>: que la última repetición cueste de verdad, sin perder la técnica.', 'Apunta pesos y repeticiones y busca progresar cada sesión.'];
    if(R.cardio === 'mucho') acc.push('Cambia el cardio por <b>caminar</b>, y muévete 10-15 minutos después de cada comida.');

    var resumen = 'Me salen ' + rec + ' días a la semana. Diagnóstico: ' + diag + ' (eficiencia ' + ef + '/100).' + (dias != null ? ' Ahora entreno ' + (dias === 2 ? '1-2' : dias === 6 ? '6 o más' : dias) + ' días.' : '') + (ahorro ? ' Llego a entrenar ' + (R.energia === 'cafe' ? 'tirando de café' : 'sin energía') + '.' : '');
    var html =
      '<div class="res-bloque"><div class="score"><div class="anillo" style="background:conic-gradient(' + color + ' 360deg,#2a2a2a 0)"><div class="num"><b>' + rec + '</b><small>días/semana</small></div></div>' +
      '<div><div class="etiqueta" style="color:' + color + '">Tus días ideales</div><h2>' + diag + '</h2></div></div><p>' + texto + '</p></div>' +
      '<div class="res-bloque"><h3>La eficiencia de tu entreno</h3><div class="barras">' + JG.barra('Resultados por hora de gimnasio', ef, ef + '/100', ef >= 75 ? '#7fb36e' : ef >= 50 ? '#f0a020' : '#d70438') + '</div></div>' +
      '<div class="res-bloque"><h3>Lo que estás haciendo de más (o de menos)</h3>' + JG.lista(E.slice(0, 6)) + '</div>' +
      '<div class="res-bloque"><h3>Cómo entrenaría yo en tu caso</h3>' + JG.acciones(acc) + '</div>';
    return {html: html, resumen: resumen, puntuacion: ef, extra: {recomendados: rec, diagnostico: diag}};
  }
});
