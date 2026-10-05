/* =====================================================================
   Se alinearon las estrellas — datos
   Cada dato lleva `estado`:
     'ok'   verificado en su fuente (por búsqueda, octubre de 2026)
     'fix'  corregido respecto al borrador original
     'flag' ⚑ por verificar, fuente secundaria o estimación
   Las reglas de visas y licencias cambian: antes de decidir, confirmar.
   ===================================================================== */

window.ESTRELLAS = {
  titulo: 'Se alinearon las estrellas',
  kicker: 'Para pensar juntos',
  lema: 'No mide a nadie: alinea decisiones. Tu carrera pesa lo mismo que la mía.',
  consultado: 'octubre de 2026',
  personas: ['Carlos', 'Karen'],

  rondas: [
    { id: 'r0', emoji: '🌱', nombre: 'Lo que quiero', sub: 'Antes de hablar de emigrar, cada uno habla de sí.', min: '2 min', tipo: 'respuestas' },
    { id: 'r1', emoji: '💯', nombre: 'Cien puntos', sub: 'Reparte 100 puntos entre lo que pesa.', min: '3 min', tipo: 'respuestas' },
    { id: 'r2', emoji: '🧱', nombre: 'No negociables', sub: 'En secreto. Después se revelan los cruces.', min: '2 min', tipo: 'respuestas' },
    { id: 'r3', emoji: '🗺️', nombre: 'Cómo funciona', sub: 'No compara: es para entender. Con fuentes.', min: '10 min', tipo: 'lectura' },
    { id: 'r4', emoji: '🏙️', nombre: 'Ciudades', sub: 'Seis opciones. Califica solo en lo que más te pesa.', min: '3 min', tipo: 'respuestas' },
    { id: 'r5', emoji: '⏳', nombre: 'Plazos y miedos', sub: 'Cuánto pesa cada uno, y qué misión le pides al otro.', min: '4 min', tipo: 'respuestas' },
    { id: 'r6', emoji: '🤝', nombre: 'El acuerdo', sub: 'Se abre con el enlace de la otra persona.', min: '', tipo: 'acuerdo' }
  ],

  /* ---------------- Ronda 0 ---------------- */
  r0: {
    preguntas: [
      { id: 'cinco', q: '¿Dónde te ves en cinco años?', o: ['Ejerciendo en Colombia', 'Formándome afuera', 'Ejerciendo afuera', 'No lo sé todavía'] },
      { id: 'irse', q: '¿Quieres irte del país?', o: ['Sí', 'Depende', 'No por ahora'] },
      { id: 'carrera', q: 'Lo próximo de tu carrera, ¿aquí o afuera?', o: ['Aquí', 'Afuera', 'No lo sé'] }
    ],
    texto: { label: 'Algo que quieras decir antes de seguir', max: 240 },
    avisoNoPorAhora: 'Alguien respondió «no por ahora». Eso no cierra nada, pero conviene hablarlo antes de seguir con las tablas.'
  },

  /* ---------------- Ronda 1 ---------------- */
  r1: {
    total: 100, paso: 5,
    categorias: [
      { id: 'mia', nombre: 'Mi carrera', desc: 'Lo que yo quiero hacer y dónde se hace mejor' },
      { id: 'pareja', nombre: 'La carrera de mi pareja', desc: 'Que lo suyo también avance' },
      { id: 'idioma', nombre: 'Idioma', desc: 'Cuánto idioma nuevo estoy dispuesto a invertir' },
      { id: 'familia', nombre: 'Distancia de la familia', desc: 'Horas de vuelo, visitas, emergencias' },
      { id: 'costo', nombre: 'Costo de vida', desc: 'Lo que alcanza con lo que entra' },
      { id: 'clima', nombre: 'Clima', desc: 'Sol, nieve, lluvia, luz' },
      { id: 'papeles', nombre: 'Papeles y visas', desc: 'Cuánto depende de casarnos, de exenciones, de trámites' },
      { id: 'tiempo', nombre: 'Tiempo hasta que Karen ejerza paliativos', desc: 'Años entre llegar y ejercer lo que quiere' }
    ]
  },

  /* ---------------- Ronda 2 ---------------- */
  r2: {
    opciones: ['No negociable', 'Me importa', 'Me da igual', 'Prefiero hablarlo en persona'],
    items: [
      { id: 'casarnos', texto: 'Casarnos antes de irnos.' },
      { id: 'separados', texto: 'No vivir separados más de unos meses.' },
      { id: 'trabajar', texto: 'Poder trabajar desde el primer año.' },
      { id: 'idioma', texto: 'No tener que aprender un idioma nuevo.' },
      { id: 'volver', texto: 'Volver a Colombia en algún momento.' },
      { id: 'especialidad', texto: 'Que la especialidad de Karen sea afuera.' }
    ],
    lecturas: {
      fuerte: 'Acuerdo fuerte: para los dos es innegociable.',
      alineado: 'Alineados: a los dos les importa.',
      tension: 'Hay que hablarlo: para uno es innegociable y al otro le da igual.',
      matiz: 'Matiz: para uno es innegociable y al otro le importa, pero no tanto.',
      libre: 'A ninguno le pesa. Libre.',
      persona: 'Alguien prefiere hablarlo en persona. Se respeta tal cual.'
    }
  },

  /* ---------------- Ronda 3 ---------------- */
  r3: {
    cartas: [
      {
        id: 'ecfmg', emoji: '📋', titulo: 'ECFMG y USMLE',
        p: ['El ECFMG certifica a los médicos graduados fuera de EE. UU. Sin su certificado no se puede aplicar a residencias ni ejercer. Además patrocina la visa J-1 de los residentes extranjeros.',
            'Pasos: la facultad debe estar en el World Directory of Medical Schools con la nota del ECFMG; se aprueba el Step 1, que hoy es aprobado o reprobado; se presenta el Step 2 CK, que sí da puntaje; y se completa un Pathway, que incluye el examen de inglés médico OET.'],
        datos: [
          { t: 'Requisitos 2026: Step 1, Step 2 CK y un Pathway con OET Medicine.', estado: 'ok', fuente: 'ECFMG, Information Booklet 2026', url: 'https://www.ecfmg.org/2026ib/certification-requirements.html' },
          { t: 'El puntaje mínimo del Step 2 CK subió a 218 en julio de 2025.', estado: 'ok', fuente: 'ECFMG / USMLE, resumen de Lecturio 2026', url: 'https://www.lecturio.com/blog/img-guide-to-usmle-2026-ecfmg-pathways-match-strategy/' },
          { t: 'Hay centros Prometric en más de 100 ubicaciones fuera de EE. UU.', estado: 'flag', fuente: 'Fuente secundaria', url: 'https://www.iatrox.com/blog/img-usmle-pathway-guide-2026' },
          { t: 'Certificación en 12 a 24 meses y 15 a 30 mil USD hasta el Match.', estado: 'flag', fuente: 'Fuente secundaria', url: 'https://www.iatrox.com/blog/ecfmg-certification-2026-guide' }
        ]
      },
      {
        id: 'match', emoji: '🎲', titulo: 'El Match y el riesgo de ciudad',
        p: ['Tú ordenas los programas que prefieres, los programas ordenan candidatos y un algoritmo asigna. El resultado es obligatorio: vas adonde te asigne.',
            'Si pones solo programas de una ciudad, tienes menos opciones y sube el riesgo de quedarte sin plaza ese año. Si pones muchas ciudades, sube la probabilidad de entrar, pero podrías quedar lejos.'],
        datos: [
          { t: 'Ciclo actual: postulación desde el 2 de septiembre de 2026, lista de preferencias hasta el 3 de marzo de 2027, resultado el 19 de marzo de 2027.', estado: 'ok', fuente: 'ECFMG, calendario ERAS', url: 'https://www.ecfmg.org/eras/timeline.html' },
          { t: 'Match 2026: el 54,4 % de los graduados extranjeros que necesitaban visa obtuvo plaza, el mínimo en cinco años.', estado: 'ok', fuente: 'AMA, Match 2026 en cifras', url: 'https://www.ama-assn.org/medical-students/preparing-residency/largest-match-day-record-dive-2026-numbers' },
          { t: 'Los Steps 1 y 2 CK deben estar aprobados antes de la fecha límite de la lista.', estado: 'ok', fuente: 'ECFMG', url: 'https://www.ecfmg.org/news/2023/01/24/deadline-reminder-application-for-pathways-for-ecfmg-certification-for-2023-match' },
          { t: 'El Match para parejas solo aplica si los dos postulan a residencias.', estado: 'flag', fuente: 'Por verificar en NRMP', url: 'https://www.nrmp.org/' }
        ]
      },
      {
        id: 'residencia', emoji: '🏥', titulo: 'Residencia y fellowship',
        p: ['En EE. UU. los cuidados paliativos no son una especialidad de entrada sino una subespecialidad: primero una residencia base de unos tres años, por ejemplo medicina interna o familiar, y después un fellowship de paliativos de doce meses.',
            'El residente es un empleado con contrato y salario.'],
        datos: [
          { t: 'El fellowship de paliativos exige residencia acreditada y certificado ECFMG; varios programas piden también el Step 3; los extranjeros entran con J-1.', estado: 'flag', fuente: 'Programas de Arizona, JPS y Summa Health', url: 'https://aging.arizona.edu/hospice-palliative-medicine-fellowship' },
          { t: 'Desde 2024 el examen de certificación en paliativos se ofrece cada año, ya no cada dos.', estado: 'fix', fuente: 'ABIM, vía ABPMR', url: 'https://www.abpmr.org/Research/Detail/hpm-subspecialty' },
          { t: 'Horas: máximo 80 semanales promediadas en 4 semanas, un día libre de cada siete y turnos de hasta 24 horas más 4 de transición. El tope de 16 horas para primer año se eliminó en 2017.', estado: 'fix', fuente: 'ACGME, resumen del ACP', url: 'https://www.acponline.org/acp-newsroom/acp-statement-on-acgme-changes-to-resident-duty-hours' },
          { t: 'Salario de ejemplo: 61.422 USD en primer año y 65.952 en tercero; promedio nacional cercano a 75.000.', estado: 'flag', fuente: 'Bon Secours y Med School Insiders', url: 'https://medschoolinsiders.com/pre-med/how-much-do-resident-doctors-make/' },
          { t: 'Algunos programas solo entrevistan a extranjeros graduados en los últimos 5 años.', estado: 'flag', fuente: 'UTHSC Memphis', url: 'https://uthsc.edu/memphis-family-medicine/fellowships/hospice-palliative-care/applicants.php' }
        ]
      },
      {
        id: 'j1', emoji: '🔁', titulo: 'La condición de dos años de la J-1',
        p: ['La J-1 de médico trae una condición: al terminar el entrenamiento hay que vivir dos años en el país de origen, o conseguir una exención.',
            'La exención más conocida, Conrad 30, permite a cada estado patrocinar hasta 30 médicos al año a cambio de trabajar tres años en una zona con pocos médicos.'],
        datos: [
          { t: 'Requisito de dos años de residencia en el país de origen, sección 212(e).', estado: 'ok', fuente: 'Guías legales 2026', url: 'https://j1visawaiver.net/blog/j1-waiver-for-physicians-the-complete-2026-guide/' },
          { t: 'Conrad 30: hasta 30 exenciones por estado y año, con tres años de servicio en zona de escasez.', estado: 'ok', fuente: 'Reddy Neumann Brown', url: 'https://www.rnlawgroup.com/understanding-the-conrad-30-waiver-a-physicians-route-from-j-1-to-h-1b/' },
          { t: 'La autorización legal de Conrad 30 venció el 1 de octubre de 2025 y, según fuentes legales, no está disponible hasta que el Congreso la reautorice. No contar con ella sin confirmarlo.', estado: 'flag', fuente: 'Finberg Firm, marzo de 2026', url: 'https://finbergfirm.com/2026/03/21/j-1-visa-waiver-how-doctors-researchers-and-exchange-visitors-can-stay-in-the-u-s-4/' }
        ]
      },
      {
        id: 'dependientes', emoji: '💍', titulo: 'Visas de dependiente',
        p: ['Durante el doctorado Carlos tendría, casi seguro, visa de estudiante F-1. Para Karen, como dependiente, eso significa F-2: solo para cónyuges, sin trabajar y con estudio de medio tiempo.',
            'La residencia es un empleo, así que, casados o no, para hacerla Karen necesita su propia J-1 del ECFMG.'],
        datos: [
          { t: 'F-2: solo cónyuge; no puede trabajar; estudio solo medio tiempo.', estado: 'ok', fuente: 'Penn ISSS y Miami ISSS', url: 'https://global.upenn.edu/isss/dependents/' },
          { t: 'J-2: puede pedir permiso de trabajo; sin restricciones de estudio.', estado: 'ok', fuente: 'Boston University ISSO', url: 'https://www.bu.edu/isso/immigration-status/immigration-overview/dependent-classifications' },
          { t: 'O-3: nunca puede trabajar; puede estudiar tiempo completo. La O-1 la pide un empleador y exige «capacidad extraordinaria».', estado: 'ok', fuente: 'Boston University ISSO y Rutgers', url: 'https://global.rutgers.edu/o-1-visa' }
        ]
      },
      {
        id: 'investigadora', emoji: '🔬', titulo: 'J-1 de investigadora',
        p: ['Karen consigue un grupo de investigación que la reciba, por ejemplo en paliativos; demuestra con qué se sostiene; la universidad emite el DS-2019 y ella pide la J-1 en el consulado.',
            'La ventaja: es suya, no depende de estar casados, y da cartas y experiencia en EE. UU. para la residencia.'],
        datos: [
          { t: 'El trabajo principal es investigar o enseñar; el contacto con pacientes solo incidental y supervisado; no cuenta para la certificación; algunas universidades prohíben la investigación clínica; máximo 5 años.', estado: 'flag', fuente: 'UNT Health, Temple, MIT y Case Western', url: 'https://global.temple.edu/isss/faculty-staff-researchers/j-1-research-scholars-professor/clinical-activity-j-1-exchange-visitor-program' },
          { t: 'Fondos mínimos si el puesto no paga: Boston University 3.045 USD al mes; Northeastern 28.000 al año; Berkeley 2.200 al mes desde enero de 2026. Se aceptan patrocinadores con extractos y carta.', estado: 'flag', fuente: 'BU, Northeastern y Berkeley', url: 'https://www.bu.edu/isso/administrators/checklist/j1/minimum-funding' }
        ]
      },
      {
        id: 'sinresidencia', emoji: '🚪', titulo: 'Ejercer sin residencia',
        p: ['Desde hace poco, algunos estados tienen vías para que médicos formados afuera ejerzan sin repetir la residencia. Sirve para ejercer como médica; no da la certificación en paliativos, que exige el fellowship.'],
        datos: [
          { t: 'A 2026, 27 estados tienen alguna vía alternativa.', estado: 'ok', fuente: 'World Education Services', url: 'https://www.wes.org/resource-library/blog/welcoming-communities-in-action/27-states-expand-pathways-for-internationally-trained-physicians-in-2026/' },
          { t: 'Massachusetts: licencia extranjera, al menos un año de práctica en atención primaria o psiquiatría, certificado ECFMG y Steps 1 y 2 CK; trabajo en centro aprobado en zona de escasez; licencia limitada, luego restringida y plena tras al menos dos años.', estado: 'flag', fuente: 'Mass.gov y Husch Blackwell', url: 'https://www.mass.gov/news/board-adopts-policy-outlining-criteria-for-an-additional-licensing-pathway-for-internationally-trained-physicians' }
        ]
      },
      {
        id: 'uk', emoji: '🇬🇧', titulo: 'Reino Unido',
        p: ['La visa más amable para la pareja: el estudiante de doctorado puede llevar a su cónyuge o a su pareja no casada con dos años de convivencia, y la dependiente trabaja tiempo completo.',
            'Para atender pacientes hace falta registro ante el GMC; la mayoría lo obtiene con el PLAB.'],
        datos: [
          { t: 'Solo estudiantes de doctorado o investigación traen dependientes; pareja no casada con dos años de convivencia; la dependiente trabaja en casi todo, excepto como médica o dentista en formación.', estado: 'ok', fuente: 'UKCISA y Goldsmiths', url: 'https://www.ukcisa.org.uk/student-advice/visas-and-immigration/student-route-bringing-your-family/' },
          { t: 'GMC, PLAB y el esquema MTI de dos años.', estado: 'flag', fuente: 'Royal College of Anaesthetists', url: 'https://rcoa.ac.uk/global-partnerships/overseas-doctors-who-wish-work-or-train-the-uk' },
          { t: 'Maestría en paliativos del Cicely Saunders Institute, King’s College, con St Christopher’s Hospice; pide experiencia previa.', estado: 'flag', fuente: 'Prospects', url: 'https://prospects.ac.uk/universities/kings-college-london-3852/florence-nightingale-faculty-of-nursing-midwifery-and-palliative-care-14917/courses/palliative-care-21181' },
          { t: 'Cómo es la especialización formal en medicina paliativa y si una especialidad colombiana ayuda a convalidar.', estado: 'flag', fuente: 'Sin verificar', url: 'https://www.gmc-uk.org/' }
        ]
      },
      {
        id: 'alemania', emoji: '🇩🇪', titulo: 'Alemania',
        p: ['Primero la licencia médica alemana, la Approbation. Luego una especialidad de unos cinco años y, al final, la formación adicional en paliativos.',
            'Si a Carlos lo contratan como investigador, su cónyuge no necesita alemán para entrar y puede trabajar. La reunificación suele exigir estar casados.'],
        datos: [
          { t: 'Approbation: equivalencia del título, alemán B2 y examen de alemán médico C1; a médicos de fuera de la UE casi siempre les piden además el examen de conocimientos.', estado: 'ok', fuente: 'Amboss y Expatrio', url: 'https://www.amboss.com/de/approbation-in-deutschland/en' },
          { t: 'Cónyuge de investigador con permiso §18d: sin requisito de alemán A1 y con acceso al mercado laboral.', estado: 'ok', fuente: 'Research in Germany y guía §18d', url: 'https://www.research-in-germany.org/plan-your-stay/family/bringing-your-family.html' },
          { t: 'Formación adicional en paliativos: especialidad más curso de 40 horas y 120 horas de casos supervisados, o 6 meses en un servicio.', estado: 'flag', fuente: 'Ärzteblatt', url: 'https://aerztestellen.aerzteblatt.de/de/redaktion/zusatz-weiterbildung-palliativmedizin' },
          { t: 'Estimación: 7 años o más hasta ejercer paliativos.', estado: 'flag', fuente: 'Estimación propia', url: 'https://www.amboss.com/de/approbation-in-deutschland/en' }
        ]
      },
      {
        id: 'colombia', emoji: '🇨🇴', titulo: 'Colombia',
        p: ['La Javeriana ofrece Medicina del Dolor y Cuidados Paliativos como primera especialidad: se entra siendo médico graduado con tarjeta profesional y ReThus. En otros programas, como el del Rosario, hay que ser antes especialista.',
            'Lo que hay que tener presente: una especialidad colombiana no reemplaza la residencia estadounidense, porque el fellowship exige residencia acreditada allá.'],
        datos: [
          { t: 'Último ciclo de la Javeriana: inscripciones hasta el 5 de marzo de 2026, examen presencial el 15 de marzo, segunda fase del 20 al 26 de marzo.', estado: 'ok', fuente: 'Javeriana, admisión a primeras especialidades', url: 'https://www.javeriana.edu.co/recursosdb/d/info-prg/primera_admision_posgrados_medicina_2610-1-_compressed' },
          { t: 'Ley 1917 de 2018: el residente recibe un apoyo de al menos 3 salarios mínimos al mes; la matrícula no puede superar los costos del programa.', estado: 'ok', fuente: 'Función Pública, Ley 1917', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=87441' },
          { t: 'Rosario: segunda especialidad; exige ser antes especialista en anestesiología, medicina interna, pediatría, geriatría o medicina física y rehabilitación.', estado: 'flag', fuente: 'Universidad del Rosario', url: 'https://urosario.edu.co/en/node/72066' },
          { t: 'Duración del programa de la Javeriana y costos: Militar unos 13,5 M COP por semestre, FUCS unos 16,3 M, 3 semestres, año incierto.', estado: 'flag', fuente: 'Fuente secundaria', url: 'https://losestudiantes.com/universidad-militar-nueva-granada/especializacion-en-medicina-del-dolor-y-cuidados-paliativos' }
        ]
      }
    ],

    rutas: [
      { id: 'usa', nombre: 'EE. UU. directa', pasos: ['Revisar año de grado y directorio del ECFMG', 'Step 1', 'Step 2 CK', 'OET y certificado ECFMG', 'ERAS en septiembre, Match en marzo', 'Residencia de 3 años con J-1', 'Fellowship de paliativos de 1 año', 'Examen de certificación, anual'],
        tiempo: { t: '5 a 6 años hasta ejercer paliativos', estado: 'flag' }, costo: { t: '15 a 30 mil USD hasta el Match, fuente secundaria', estado: 'flag' }, casarse: 'No hace falta para la residencia: la J-1 es propia. Sí, si llega antes como dependiente F-2.', idioma: 'Inglés médico, OET' },
      { id: 'invest', nombre: 'Investigadora primero', pasos: ['Conseguir un grupo de paliativos que la reciba', 'Demostrar fondos o salario', 'J-1 de investigadora, hasta 5 años', 'Steps y OET desde allá', 'ERAS y Match', 'Residencia y fellowship'],
        tiempo: { t: '6 a 7 años hasta ejercer paliativos', estado: 'flag' }, costo: { t: 'Exámenes más un posible año sin sueldo', estado: 'flag' }, casarse: 'No: la visa es suya.', idioma: 'Inglés' },
      { id: 'colombia', nombre: 'Colombia primero', pasos: ['Examen de la Javeriana, alrededor de marzo', 'Especialidad en paliativos en Colombia', 'Ejercer como especialista', 'Si después quiere EE. UU., la ruta completa igual: la especialidad colombiana no reemplaza la residencia'],
        tiempo: { t: 'Especialidad de duración por confirmar; separados mientras tanto', estado: 'flag' }, costo: { t: 'Matrícula limitada por ley; apoyo de 3 salarios mínimos', estado: 'ok' }, casarse: 'No aplica de entrada.', idioma: 'Español' },
      { id: 'londres', nombre: 'Londres', pasos: ['Venir como pareja del estudiante de doctorado', 'Trabajar desde el inicio en casi cualquier cosa', 'PLAB y registro ante el GMC', 'Maestría en paliativos o MTI', 'Especialización formal: por verificar'],
        tiempo: { t: 'Ejerce antes como médica; la especialización no está verificada', estado: 'flag' }, costo: { t: 'Visa de dependiente y seguro de salud por año', estado: 'flag' }, casarse: 'No: bastan dos años de convivencia.', idioma: 'Inglés' },
      { id: 'berlin', nombre: 'Berlín', pasos: ['Alemán hasta B2 y examen médico C1', 'Equivalencia y, casi seguro, examen de conocimientos', 'Approbation', 'Especialidad de unos 5 años', 'Formación adicional en paliativos'],
        tiempo: { t: '7 años o más', estado: 'flag' }, costo: { t: 'Cursos de alemán y trámites', estado: 'flag' }, casarse: 'En general sí, para la reunificación.', idioma: 'Alemán' }
    ]
  },

  /* ---------------- Ronda 4 ---------------- */
  r4: {
    escala: [1, 2, 3, 4, 5],
    ciudades: [
      { id: 'ny', emoji: '🗽', nombre: 'Nueva York',
        carlos: [{ t: 'NYU, PhD en Computer Science: cierre el 12 de diciembre; beca garantizada con estipendio, matrícula y seguro.', estado: 'ok', url: 'https://cs.nyu.edu/home/phd/admission' }, { t: 'Pavel Izmailov como asesor soñado; también Columbia y Princeton a una hora.', estado: 'flag', url: 'https://cims.nyu.edu/ai/events/837/' }],
        karen: [{ t: 'Mount Sinai: el programa académico de paliativos más grande del país, ligado a CAPC y NPCRC.', estado: 'flag', url: 'https://icahn.mssm.edu/about/departments-offices/geriatrics-palliative/education' }, { t: 'Nueva York fue el estado con más residentes extranjeros en 2018: 1.384.', estado: 'flag', url: 'https://www.ama-assn.org/residents-students/specialty-profiles/4-medical-specialties-among-friendliest-img-pgy-1-matches' }],
        bueno: 'Menor riesgo de que el Match la mande lejos.', dificil: 'Ciudad muy cara ⚑. Entrar a NYU es competido.', casarse: 'Sí, si viene como dependiente; no, si viene con J-1 propia.', idioma: 'Inglés' },
      { id: 'boston', emoji: '🎓', nombre: 'Boston',
        carlos: [{ t: 'MIT, cierre el 1 de diciembre; Harvard, el 15 de diciembre.', estado: 'ok', url: 'https://www.eecs.mit.edu/academics/graduate-programs/admission-process/' }],
        karen: [{ t: 'Fellowship interprofesional de Harvard: 11 personas al año, con rotaciones en MGH, Dana-Farber, Brigham, Boston Children’s y Care Dimensions.', estado: 'ok', url: 'https://www.dana-farber.org/for-physicians/education-training/fellowships-training-programs/harvard-palliative-medicine-fellowships' }, { t: 'Vía de Massachusetts para ejercer sin residencia, solo atención primaria o psiquiatría.', estado: 'flag', url: 'https://www.mass.gov/news/board-adopts-policy-outlining-criteria-for-an-additional-licensing-pathway-for-internationally-trained-physicians' }],
        bueno: 'Paliativos de primer nivel.', dificil: 'Massachusetts no está entre los estados con más residentes extranjeros: habría que poner otras ciudades en el Match ⚑.', casarse: 'Igual que Nueva York.', idioma: 'Inglés' },
      { id: 'pitt', emoji: '🌉', nombre: 'Pittsburgh',
        carlos: [{ t: 'Carnegie Mellon, cierre el 9 de diciembre; uno de los mejores lugares para el tema.', estado: 'ok', url: 'https://www.cs.cmu.edu/education/graduate-admissions' }],
        karen: [{ t: 'UPMC: fellowship de 1 año, o de 2 con maestría; patrocina la J-1 del ECFMG. Salario del fellow: 74.523 o 76.386 USD según la fuente.', estado: 'flag', url: 'https://www.upmc.com/services/palliative-and-supportive-institute/for-professionals-and-students/fellowship-program' }, { t: 'Pensilvania entre los cinco estados con más residentes extranjeros en 2018: 462.', estado: 'flag', url: 'https://www.ama-assn.org/residents-students/specialty-profiles/4-medical-specialties-among-friendliest-img-pgy-1-matches' }],
        bueno: 'Más barata que Nueva York o Boston ⚑.', dificil: 'Ciudad más pequeña: menos programas de residencia ⚑.', casarse: 'Igual que Nueva York.', idioma: 'Inglés' },
      { id: 'londres', emoji: '🎡', nombre: 'Londres',
        carlos: [{ t: 'King’s College, grupo de Mohammad Abdulaziz, e Imperial, Kevin Buzzard. La beca President’s exige un supervisor que ya haya aceptado.', estado: 'ok', url: 'https://www.imperial.ac.uk/study/fees-and-funding/scholarships-search/' }],
        karen: [{ t: 'Viene como pareja con dos años de convivencia y trabaja desde el inicio, salvo como médica en formación.', estado: 'ok', url: 'https://www.ukcisa.org.uk/student-advice/visas-and-immigration/student-route-bringing-your-family/' }, { t: 'PLAB y registro ante el GMC; maestría del Cicely Saunders Institute; MTI.', estado: 'flag', url: 'https://rcoa.ac.uk/global-partnerships/overseas-doctors-who-wish-work-or-train-the-uk' }],
        bueno: 'La visa más amable para la pareja. Todo en inglés.', dificil: 'La financiación de Carlos. La especialización formal no está verificada ⚑.', casarse: 'No.', idioma: 'Inglés' },
      { id: 'berlin', emoji: '🐻', nombre: 'Berlín',
        carlos: [{ t: 'Sebastian Pokutta, TU Berlin y ZIB, proyecto «Agentic AI in Mathematics». En Alemania el doctorado suele ser un empleo con sueldo.', estado: 'flag', url: 'https://www.jobs.tu-berlin.de/en/job-postings/196037' }],
        karen: [{ t: 'Approbation con B2, alemán médico C1 y examen de conocimientos; luego unos 5 años de especialidad y la formación en paliativos.', estado: 'ok', url: 'https://www.amboss.com/de/approbation-in-deutschland/en' }, { t: 'Como cónyuge de investigador: sin alemán para entrar y con permiso de trabajo.', estado: 'ok', url: 'https://www.research-in-germany.org/plan-your-stay/family/bringing-your-family.html' }],
        bueno: 'Doctorado pagado; cónyuge con trabajo.', dificil: 'El alemán: el camino más largo para Karen, 7 años o más ⚑. Reunificación casi siempre con matrimonio.', casarse: 'En general sí.', idioma: 'Alemán' },
      { id: 'col', emoji: '🇨🇴', nombre: 'Colombia primero',
        carlos: [{ t: 'Carlos se va en 2027 o 2028; un tiempo separados.', estado: 'flag', url: 'https://cs.nyu.edu/home/phd/admission' }],
        karen: [{ t: 'Javeriana: paliativos como primera especialidad, con inscripciones entre diciembre y marzo. También La Sabana, CES, Militar, FUCS y Sanitas.', estado: 'ok', url: 'https://www.javeriana.edu.co/recursosdb/d/info-prg/primera_admision_posgrados_medicina_2610-1-_compressed' }, { t: 'Apoyo de al menos 3 salarios mínimos durante la residencia.', estado: 'ok', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=87441' }],
        bueno: 'Ejerce paliativos antes y en su idioma.', dificil: 'Separados uno o dos años. Para EE. UU. no reemplaza la residencia; para Reino Unido o Alemania, por verificar ⚑.', casarse: 'No aplica de entrada.', idioma: 'Español' }
    ]
  },

  /* ---------------- Ronda 5 ---------------- */
  r5: {
    misiones: ['Que lo repita con sus palabras', 'Que me haga una pregunta', 'Que proponga un plan B'],
    disparadores: [
      { id: 'noadmiten', texto: '¿Qué pasa si no me admiten en 2027?' },
      { id: 'match', texto: '¿Y si el Match te manda a otra ciudad?' },
      { id: 'dosanos', texto: '¿Y si uno de los dos no está bien a los dos años?' },
      { id: 'separados', texto: '¿Y si nos separa un año o dos?' },
      { id: 'colombia', texto: '¿Y si prefieres hacer la especialidad en Colombia?' }
    ],
    linea: [
      { fecha: '31 oct 2026', carlos: 'Cierre de ELLIS, solo si Europa cuenta.', karen: 'Revisar año de grado y si la facultad está en el directorio con nota del ECFMG.', estado: 'ok' },
      { fecha: '1 dic 2026', carlos: 'Cierre del MIT.', karen: 'Abrir la solicitud ante el ECFMG y empezar el Step 1.', estado: 'ok' },
      { fecha: '9 dic 2026', carlos: 'Cierre de CMU.', karen: '', estado: 'ok' },
      { fecha: '12 dic 2026', carlos: 'Cierre de NYU.', karen: '', estado: 'ok' },
      { fecha: '15 dic 2026', carlos: 'Cierre de Harvard. Princeton ⚑.', karen: '', estado: 'ok' },
      { fecha: '25 a 29 ene 2027', carlos: 'Taller en el MIT; posibles entrevistas.', karen: 'Estudio del Step 1.', estado: 'flag' },
      { fecha: 'feb a abr 2027', carlos: 'Respuestas de admisión; decisión antes del 15 de abril, la fecha habitual.', karen: 'Si escoge Colombia: examen de la Javeriana alrededor de marzo.', estado: 'flag' },
      { fecha: 'may a jul 2027', carlos: 'Sustentación de la maestría y visa F-1.', karen: 'Step 1.', estado: 'flag' },
      { fecha: 'ago a sep 2027', carlos: 'Empieza el doctorado.', karen: 'Casados: F-2 sin trabajar. Si no: Step 2 CK desde Colombia, o J-1 de investigadora.', estado: 'flag' },
      { fecha: 'sep 2027 a mar 2028', carlos: 'Año 1.', karen: 'Escenario rápido: ERAS en septiembre y Match en marzo de 2028.', estado: 'flag' },
      { fecha: 'jul 2028 o jul 2029', carlos: 'Año 1 o 2.', karen: 'Empieza la residencia.', estado: 'flag' },
      { fecha: '2031 a 2033', carlos: 'Termina el doctorado hacia 2032.', karen: 'Fellowship de paliativos.', estado: 'flag' }
    ]
  },

  /* ---------------- Ronda 6 ---------------- */
  r6: {
    avisoCompartir: 'Este enlace contiene respuestas personales de los dos. Es solo para nosotros.',
    pasos: [
      { fecha: '31 oct 2026', quien: 'Carlos', t: 'ELLIS, si Europa sigue en la mesa.' },
      { fecha: 'nov 2026', quien: 'Karen', t: 'Año de grado, directorio del ECFMG y cuántos años de práctica tiene.' },
      { fecha: '1 a 15 dic 2026', quien: 'Carlos', t: 'Aplicaciones: MIT, CMU, NYU, Harvard.' },
      { fecha: 'dic 2026', quien: 'Karen', t: 'Escribir a uno o dos grupos de paliativos en Nueva York y Pittsburgh: ¿reciben investigadoras extranjeras y en qué condiciones?' },
      { fecha: 'ene 2027', quien: 'Los dos', t: 'Confirmar si Conrad 30 fue reautorizado y qué exenciones existen.' },
      { fecha: 'feb a mar 2027', quien: 'Los dos', t: 'Con las respuestas de admisión en la mano, escoger ciudad.' }
    ]
  },

  fuentes: {
    nota: 'Consultado en ' + 'octubre de 2026' + '. Lo marcado con ⚑ no se pudo confirmar en una fuente oficial, viene de una fuente secundaria o es una estimación. Las reglas de visas y licencias cambian: antes de decidir, volver a confirmar.'
  }
};
