/**
 * ==============================================================================
 * SCRIPT BIBLIOGRAFÍA: FUENTES DE CONSULTA CATEGORIZADAS
 * Muestra el acervo bibliográfico categorizado por sección (Psicología, Embriología,
 * Anatomía, Histología, Bioquímica, Fisiología) con buscador y redirección interactiva.
 * ==============================================================================
 */

(function () {
    'use strict';

    const BIBLIO_DATA = [
        {
            id: 1,
            discipline: 'psicologia',
            topic: 'Planes UNAM',
            title: '1302MedicionyEvaluacionPsicologica.pdf - Plan Curricular Oficial',
            url: 'https://sua.psicologia.unam.mx/docs/pdf/plan2008/1302MedicionyEvaluacionPsicologica.pdf',
            badge: 'UNAM • PDF',
            desc: 'Programa de estudios oficial de la asignatura Medición y Evaluación Psicológica, Sistema Universidad Abierta y Educación a Distancia.'
        },
        {
            id: 2,
            discipline: 'psicologia',
            topic: 'Planes UNAM',
            title: 'Medición y Evaluación - SUA-Psicología UNAM',
            url: 'https://sua.psicologia.unam.mx/docs/pdf/plan2008/1302MedicionyEvaluacionPsicologica.pdf',
            badge: 'UNAM SUA',
            desc: 'Repositorio curricular de la Facultad de Psicología UNAM para la formación teórico-práctica en psicometría clínica.'
        },
        {
            id: 3,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Fundamentos Psicométricos en la Evaluación Psicológica - FES Iztacala UNAM',
            url: 'https://www.iztacala.unam.mx/carreras/psicologia/psiclin/vol7num4/Art3-2005-1.pdf',
            badge: 'FES Iztacala',
            desc: 'Artículo científico sobre teoría de la medida, confiabilidad, validez de constructo y errores de estimación.'
        },
        {
            id: 4,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Investigación en educación médica - SciELO México',
            url: 'https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S2007-50572014000100007',
            badge: 'SciELO',
            desc: 'Principios psicométricos fundamentales aplicados a la evaluación del rendimiento cognitivo y clínico.'
        },
        {
            id: 5,
            discipline: 'psicologia',
            topic: 'TCT y TRI',
            title: 'Teoría Clásica y Teoría de Respuesta a los Ítems (TCT vs. TRI) - Papeles del Psicólogo',
            url: 'https://www.papelesdelpsicologo.es/pdf/1796.pdf',
            badge: 'Papeles Psicólogo',
            desc: 'Estudio monográfico comparativo entre el modelo lineal clásico de Spearman y los modelos logísticos invariantes de la TRI.'
        },
        {
            id: 6,
            discipline: 'psicologia',
            topic: 'WAIS-IV',
            title: 'TESIS: WAIS-III y WAIS-IV en Población Mexicana - Repositorio UNAM',
            url: 'https://ru.dgb.unam.mx/server/api/core/bitstreams/c107abb4-7261-4c7f-ba0b-8fe9424f8351/content',
            badge: 'Tesis UNAM',
            desc: 'Investigación de posgrado sobre la baremación, estructura factorial y estandarización del WAIS-IV en México.'
        },
        {
            id: 7,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Instrumentos de evaluación psicológica tipificados - RUA UNAM',
            url: 'https://www.rua.unam.mx/portal/recursos/ficha/8536',
            badge: 'RUA UNAM',
            desc: 'Repositorio Universitario Abierto con fichas técnicas de pruebas psicológicas estandarizadas.'
        },
        {
            id: 8,
            discipline: 'psicologia',
            topic: 'WAIS-IV',
            title: 'Escala Wechsler de Inteligencia para Adultos (WAIS) - Referencia Técnica',
            url: 'https://es.wikipedia.org/wiki/Escala_Wechsler_de_Inteligencia_para_Adultos',
            badge: 'Enciclopedia',
            desc: 'Reseña histórica, evolución de versiones, subescalas e índices factoriales de las escalas de Wechsler.'
        },
        {
            id: 9,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Características Esenciales de las Pruebas Psicológicas en el Área Clínica - CUAED UNAM',
            url: 'https://repositorio-uapa.cuaed.unam.mx/repositorio/moodle/pluginfile.php/2893/mod_resource/content/1/UAPA-Caracteristicas-Esenciales-Pruebas-Psicologicas-Area-Clinica/index.html',
            badge: 'CUAED UNAM',
            desc: 'Unidad de Apoyo para el Aprendizaje sobre criterios psicométricos y deontológicos en el ámbito hospitalario.'
        },
        {
            id: 10,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Utilización de las pruebas psicológicas en México. Un análisis empírico',
            url: 'https://epaginapersonal.unam.mx/app/webroot/files/1043/Publica_20200903141529.pdf',
            badge: 'UNAM',
            desc: 'Diagnóstico nacional sobre los instrumentos más utilizados y las prácticas de baremación en México.'
        },
        {
            id: 11,
            discipline: 'psicologia',
            topic: 'TCT y TRI',
            title: 'Teoría Clásica de los Tests versus Teoría de Respuesta al Ítem - UNED',
            url: 'https://www.uned.es/universidad/docentes/dam/jcr:bbe09b82-ea41-49c4-8494-3fb19c5668cd/TCTTRI94.pdf',
            badge: 'UNED',
            desc: 'Tratado metodológico sobre curvas características del ítem (CCI), parámetros a, b, c e independencia muestral.'
        },
        {
            id: 12,
            discipline: 'psicologia',
            topic: 'TCT y TRI',
            title: 'Análisis psicométrico de exámenes. Teoría de Medición Clásica - CUAED UNAM',
            url: 'https://cuaed.unam.mx/publicaciones/libro-evaluacion/pdf/Capitulo-16-ANALISIS-PSICOMETRICO-DE-EXAMENES.pdf',
            badge: 'Libro CUAED',
            desc: 'Fórmulas para índice de dificultad p, índice de discriminación D y correlación punto-biserial.'
        },
        {
            id: 13,
            discipline: 'psicologia',
            topic: 'TCT y TRI',
            title: 'Teoría Clásica de los Tests - SIEPSI',
            url: 'https://siepsi.com.co/2026/05/29/teoria-clasica-de-los-test/',
            badge: 'SIEPSI',
            desc: 'Fundamentos conceptuales de la puntuación verdadera, error de medición y supuestos matemáticos de Spearman.'
        },
        {
            id: 14,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Comparación del rendimiento en un examen diagnóstico aplicado en educación superior',
            url: 'https://www.revista.unam.mx/wp-content/uploads/v26_n4_a15.pdf',
            badge: 'Revista UNAM',
            desc: 'Estudio empírico de validación psicométrica sobre cohortes universitarias con análisis de reactivos.'
        },
        {
            id: 15,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Psicología Clínica: Evaluación, Diagnóstico y Tratamiento',
            url: 'https://dokumen.pub/psicologia-clinica.html',
            badge: 'Libro Texto',
            desc: 'Manual exhaustivo de psicodiagnóstico clínico, entrevista estructurada y baterías estandarizadas.'
        },
        {
            id: 16,
            discipline: 'psicologia',
            topic: 'TCT y TRI',
            title: 'Capítulo 17: Una Introducción a la Teoría de Respuesta al Ítem - CEIDE UNAM',
            url: 'https://www.ceide.unam.mx/wp-content/uploads/2024/08/Capitulo-17-UNA-INTRODUCCION-A-LA-TEORIA-DE-RESPUESTA-AL-ITEM.pdf',
            badge: 'CEIDE UNAM',
            desc: 'Modelación matemática logística y cálculo de la función de información condicional local en TRI.'
        },
        {
            id: 17,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Evaluación de las propiedades psicométricas de las escalas clínicas - SciELO Colombia',
            url: 'http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S0123-91552024000200005',
            badge: 'SciELO',
            desc: 'Análisis Factorial Confirmatorio (AFC), bondad de ajuste global y estimación ordinal con Omega de McDonald.'
        },
        {
            id: 18,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Evaluación de las propiedades psicométricas de las escalas de medición - Redalyc',
            url: 'https://www.redalyc.org/journal/798/79880103005/html/',
            badge: 'Redalyc',
            desc: 'Metodología para la comprobación de validez convergente, discriminante y consistencia interna en psicometría.'
        },
        {
            id: 19,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Tesis Doctoral sobre Estandarización y Propiedades Métricas - UNAM',
            url: 'https://epaginapersonal.unam.mx/app/webroot/files/4777/20231211_Tesis_Doctorado_version_Final.pdf',
            badge: 'Tesis UNAM',
            desc: 'Investigación doctoral sobre validación transcultural y algoritmos de baremación psicométrica.'
        },
        {
            id: 20,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Guía para el Diagnóstico Neuropsicológico - Alfredo Ardila y Feggy Ostrosky',
            url: 'https://aalfredoardila.files.wordpress.com/2013/07/ardila-a-ostrosky-f-2012-guia-para-el-diagnostico-neuropsicologico.pdf',
            badge: 'Libro Clásico',
            desc: 'Texto fundamental sobre evaluación sindromática de la atención, memoria, lenguaje y funciones ejecutivas.'
        },
        {
            id: 21,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Fiabilidad del Instrumento de Evaluación Neuropsicológica Breve - SciELO',
            url: 'http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S1794-47242013000100005',
            badge: 'SciELO',
            desc: 'Estudio de concordancia interjueces y coeficientes de correlación intraclase (ICC) en pruebas clínicas.'
        },
        {
            id: 22,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Validación y estandarización de pruebas neuropsicológicas en población hispanohablante',
            url: 'https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S2954-41222022000100005',
            badge: 'SciELO México',
            desc: 'Ajuste de puntos de corte estadísticos segmentados por edad y nivel de instrucción formal.'
        },
        {
            id: 23,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Investigación cuantitativa en psicología: del diseño experimental al reporte',
            url: 'https://es.slideshare.net/slideshow/investigacin-cuantitativa-en-psicologa-del-diseo-experimental-al-reporte-de-investigacinpdf/263736734',
            badge: 'SlideShare',
            desc: 'Guía metodológica sobre operacionalización de variables y rigor cuantitativo en medición conductual.'
        },
        {
            id: 24,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Adaptación y validación del cuestionario de evaluación - AmeliCA',
            url: 'https://portal.amelica.org/ameli/journal/447/4474618006/html/',
            badge: 'AmeliCA',
            desc: 'Procedimientos de jueceo de expertos, validez de contenido y análisis factorial multivariado.'
        },
        {
            id: 25,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Objetividad, validez y confiabilidad: atributos científicos de los instrumentos de medición',
            url: 'https://www.researchgate.net/publication/366059768_Objetividad_validez_y_confiabilidad_atributos_cientificos_de_los_instrumentos_de_medicion',
            badge: 'ResearchGate',
            desc: 'Revisión teórica sobre las garantías psicométricas indispensables en la evaluación del comportamiento humano.'
        },
        {
            id: 26,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Estandarización de pruebas neuropsicológicas para la evaluación geriátrica - Redalyc',
            url: 'https://www.redalyc.org/journal/4235/423561559003/423561559003.pdf',
            badge: 'Redalyc',
            desc: 'Parámetros normativos y control de sesgos por analfabetismo en el diagnóstico de demencias.'
        },
        {
            id: 27,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Análisis de las propiedades psicométricas de instrumentos - DGB UNAM',
            url: 'https://ru.dgb.unam.mx/items/0bc659ab-65ae-481e-b5ad-a1fc453b058d',
            badge: 'UNAM',
            desc: 'Tesis universitaria sobre calibración empírica y matrices de correlación policóricas en escalas Likert.'
        },
        {
            id: 28,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Propiedades psicométricas de escalas clínicas - SciELO México',
            url: 'https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S2007-36072021000100003',
            badge: 'SciELO',
            desc: 'Estimación de validez concurrente y estabilidad test-retest en entornos hospitalarios mexicanos.'
        },
        {
            id: 29,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Capítulo 12: Examen Objetivo y Construcción de Reactivos - CUAED UNAM',
            url: 'https://cuaed.unam.mx/publicaciones/libro-evaluacion/pdf/Capitulo-12-EXAMEN-OBJETIVO.pdf',
            badge: 'Libro CUAED',
            desc: 'Técnicas de redacción del tallo, formulación de distractores plausibles y tablas de especificaciones.'
        },
        {
            id: 30,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'El análisis cualitativo en la neuropsicología clínica - FES Zaragoza UNAM',
            url: 'https://www.zaragoza.unam.mx/wp-content/2022/Publicaciones/libros/csociales/El_analisis_elect_final.pdf',
            badge: 'FES Zaragoza',
            desc: 'Aportación sobre microexperimentos en vivo, tipo de error, zona de desarrollo próximo y prevención de iatrogenia.'
        },
        {
            id: 31,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Evaluación y aprendizaje en educación universitaria - Libro CUAED UNAM',
            url: 'https://cuaed.unam.mx/publicaciones/libro-evaluacion/pdf/ELibro-Evaluacion-y-Aprendizaje-en-Educacion-Universitaria-ISBN-9786073060714.pdf',
            badge: 'Libro UNAM',
            desc: 'Tratado institucional sobre evaluación formativa, sumativa y diseño psicométrico de exámenes a gran escala.'
        },
        {
            id: 32,
            discipline: 'psicologia',
            topic: 'WAIS-IV',
            title: 'WAIS-IV: Aplicación y Análisis Clínico - Manual Completo',
            url: 'https://neuro-class.com/wp-content/uploads/2022/11/Manual-WAIS-IV-Completo.pdf',
            badge: 'Manual Técnico',
            desc: 'Pautas de administración, reglas de retorno, suspensión y conversión a puntuaciones compuestas e índices.'
        },
        {
            id: 33,
            discipline: 'psicologia',
            topic: 'WAIS-IV',
            title: 'WAIS-IV: Qué evalúa, índices e interpretación neuropsicológica clínica',
            url: 'https://ayuda-psicologica-en-linea.com/psicologia-pdf/wechsler-inteligencia-wais-iv/',
            badge: 'Guía Clínica',
            desc: 'Análisis clínico de discrepancias entre ICV, IRP, IMT e IVP en patología neurológica.'
        },
        {
            id: 34,
            discipline: 'psicologia',
            topic: 'WAIS-IV',
            title: 'Confiabilidad de la Escala de Inteligencia Wechsler para Adultos - PePSIC',
            url: 'http://pepsic.bvsalud.org/scielo.php?script=sci_arttext&pid=S1946-20262008000100005',
            badge: 'PePSIC SciELO',
            desc: 'Evaluación psicométrica de los coeficientes de fiabilidad test-retest y consistencia de las subpruebas del WAIS.'
        },
        {
            id: 35,
            discipline: 'psicologia',
            topic: 'WAIS-IV',
            title: 'Manual de Aplicación WAIS-IV - Escala de Inteligencia para Adultos',
            url: 'https://es.scribd.com/document/680772269/Manual-de-aplicaci-n-WAIS-IV',
            badge: 'Manual Scribd',
            desc: 'Protocolo de registro, baremos de edad y tablas de conversión para la determinación del Cociente Intelectual Total.'
        },
        {
            id: 36,
            discipline: 'psicologia',
            topic: 'NEUROPSI',
            title: 'Relevancia de las pruebas neuropsicológicas de atención en México - Redalyc',
            url: 'https://www.redalyc.org/pdf/2430/243016324018.pdf',
            badge: 'Redalyc',
            desc: 'Sensibilidad diagnóstica del NEUROPSI en estadios incipientes de deterioro cognitivo y síndromes amnésicos.'
        },
        {
            id: 37,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'La evaluación neuropsicológica en México - Gabriela Orozco Calderón (ResearchGate)',
            url: 'https://www.researchgate.net/profile/Orozco-Calderon-Gabriela/publication/327208965_La_evaluacion_neuropsicologica_infantil_en_Mexico/links/5b802cbfa6fdcc5f8b646b2f/La-evaluacion-neuropsicologica-infantil-en-Mexico.pdf',
            badge: 'ResearchGate',
            desc: 'Historia y desarrollo de las baterías neuropsicológicas adaptadas al perfil sociodemográfico mexicano.'
        },
        {
            id: 38,
            discipline: 'psicologia',
            topic: 'NEUROPSI',
            title: 'Test NEUROPSI: Normas según edad y nivel de instrucción - SciELO',
            url: 'https://pepsic.scielo.org/scielo.php?script=sci_arttext&pid=S0718-41232012000200005',
            badge: 'SciELO PePSIC',
            desc: 'Investigación sobre los baremos normativos para escolaridad nula (analfabeta), 1-4 años, 5-9 años y 10+ años.'
        },
        {
            id: 39,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Apoyos Electrónicos y Baremos Oficiales - Editorial El Manual Moderno',
            url: 'https://recursos.manualmoderno.com/apoyos_electronicos/25941178_0902/25941178_0902.pdf',
            badge: 'Manual Moderno',
            desc: 'Plataforma oficial de baremación y actualización normativa para instrumentos clínicos en México.'
        },
        {
            id: 40,
            discipline: 'psicologia',
            topic: 'NEUROPSI',
            title: 'Calificación y Puntajes del NEUROPSI: Atención y Memoria - Tablas Normativas',
            url: 'https://es.scribd.com/document/638725731/Tablas-de-Neuropsi',
            badge: 'Baremos Scribd',
            desc: 'Tablas de percentiles y puntuaciones normalizadas ajustadas a los estratos educativos mexicanos.'
        },
        {
            id: 41,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Características neuropsicológicas en pacientes clínicos - SciELO México',
            url: 'https://www.scielo.org.mx/scielo.php?pid=S2954-41222024000300081&script=sci_arttext',
            badge: 'SciELO',
            desc: 'Aplicación del NEUROPSI y correlación con pruebas de rendimiento máximo en perfiles neurocognitivos.'
        },
        {
            id: 42,
            discipline: 'psicologia',
            topic: 'NEUROPSI',
            title: 'Batería NEUROPSI: Protocolo de Aplicación y Calificación Paso a Paso',
            url: 'https://es.slideshare.net/slideshow/neuropsi-29999127/29999127',
            badge: 'SlideShare',
            desc: 'Guía visual para la administración de las subpruebas de atención focalizada, sostenida y codificación.'
        },
        {
            id: 43,
            discipline: 'psicologia',
            topic: 'NEUROPSI',
            title: 'Guía de Práctica Clínica: Diagnóstico y Manejo de la Demencia - FacMed UNAM',
            url: 'https://www.facmed.unam.mx/sg/css/GPC/SIDSS-GPC/gpc/docs/IMSS-393-10-ER.pdf',
            badge: 'GPC UNAM / IMSS',
            desc: 'Recomendaciones oficiales que establecen al NEUROPSI como Gold Standard para el tamizaje cognitivo geriátrico.'
        },
        {
            id: 44,
            discipline: 'psicologia',
            topic: 'NEUROPSI',
            title: 'Demencia en el Adulto Mayor: Algoritmo de Detección Temprana - FacMed UNAM',
            url: 'https://www.facmed.unam.mx/sg/css/GPC/SIDSS-GPC/gpc/docs/IMSS-144-08-ER.pdf',
            badge: 'GPC UNAM',
            desc: 'Directrices clínicas para diferenciar demencias tempranas de pseudodemencias depresivas en adultos mayores.'
        },
        {
            id: 45,
            discipline: 'psicologia',
            topic: 'BANFE-2',
            title: 'Evaluación de las Funciones Ejecutivas en México - Repositorio UNAM',
            url: 'https://ru.dgb.unam.mx/server/api/core/bitstreams/d793736e-4cdf-44c0-9e4a-2fd9be6d5b2f/content',
            badge: 'Tesis UNAM',
            desc: 'Investigación sobre la validez de constructo y ecológica de la Batería BANFE en población clínica.'
        },
        {
            id: 46,
            discipline: 'psicologia',
            topic: 'BANFE-2',
            title: 'Alteraciones en pruebas neuropsicológicas y estudios prefrontales - UNAM',
            url: 'https://ru.dgb.unam.mx/server/api/core/bitstreams/7814fa4d-e6a8-4b36-873c-536938878fb9/content',
            badge: 'Posgrado UNAM',
            desc: 'Topografía anatómico-funcional de la corteza orbitofrontal, medial y dorsolateral evaluadas con la BANFE-2.'
        },
        {
            id: 47,
            discipline: 'psicologia',
            topic: 'BANFE-2',
            title: 'Caracterización de las funciones ejecutivas en personas con trastornos clínicos',
            url: 'https://revistas.usantotomas.edu.co/index.php/diversitas/article/view/10217',
            badge: 'Diversitas',
            desc: 'Sensibilidad de las tareas de Laberintos, Iowa Gambling Task y Torre de Hanói en control inhibitorio.'
        },
        {
            id: 48,
            discipline: 'psicologia',
            topic: 'BANFE-2',
            title: 'Manual BANFE-2: Batería Neuropsicológica de Funciones Ejecutivas y Lóbulos Frontales',
            url: 'https://www.scribd.com/document/430471775/MANUAL-BANFE-2',
            badge: 'Manual Scribd',
            desc: 'Manual de Flores-Lázaro, Ostrosky y Lozano con los 15 procesos ejecutivos y curvas normativas mexicanas.'
        },
        {
            id: 49,
            discipline: 'psicologia',
            topic: 'BDI-II',
            title: 'Estandarización del Inventario de Depresión de Beck (BDI-II) en la CDMX - Tesis UNAM',
            url: 'https://ru.dgb.unam.mx/server/api/core/bitstreams/80951c65-cd6c-425c-b51d-f3751b79c6c7/content',
            badge: 'Tesis UNAM',
            desc: 'Propiedades psicométricas, alfa de Cronbach elevado (.87) y puntos de corte validados para residentes de la CDMX.'
        },
        {
            id: 50,
            discipline: 'psicologia',
            topic: 'BDI-II',
            title: 'Standarization of Beck\'s Depression Inventory for Mexico City Inhabitants - Samuel Jurado',
            url: 'https://www.researchgate.net/profile/Samuel-Jurado/publication/279618211_Standarization_of_Beck\'s_depression_inventory_for_Mexico_City_inhabitants/links/5ea9f41245851592d6abae04/Standarization-of-Becks-depression-inventory-for-Mexico-City-inhabitants.pdf',
            badge: 'ResearchGate',
            desc: 'Publicación científica de la Facultad de Psicología UNAM sobre la adaptación del BDI-II a criterios DSM.'
        },
        {
            id: 51,
            discipline: 'psicologia',
            topic: 'BDI-II',
            title: 'Propiedades métricas de instrumentos afectivos en población mexicana - DGB UNAM',
            url: 'https://ru.dgb.unam.mx/server/api/core/bitstreams/dd1bd5ed-8956-4cbd-a6c5-7bc851ed0570/content',
            badge: 'UNAM',
            desc: 'Validez concurrente y análisis factorial del BDI-II e inventarios de ansiedad en salud mental.'
        },
        {
            id: 52,
            discipline: 'psicologia',
            topic: 'IDARE',
            title: 'Tesis de Posgrado: Evaluación de la Ansiedad Estado-Rasgo (IDARE) - UNAM',
            url: 'https://ru.dgb.unam.mx/server/api/core/bitstreams/04ce607e-900d-4b37-9293-b4cb253ed3bf/content',
            badge: 'Posgrado UNAM',
            desc: 'Diferenciación psicométrica entre fluctuaciones fisiológicas agudas (Estado) y rasgos constitucionales estables.'
        },
        {
            id: 53,
            discipline: 'psicologia',
            topic: 'IDARE',
            title: 'Uso de Escalas para la Ansiedad en Población Universitaria: Revisión Sistemática',
            url: 'https://www.researchgate.net/publication/405468037_Uso_de_Escalas_para_la_Ansiedad_en_Estudiantes_Universitarios_una_Revision_Sistematica',
            badge: 'ResearchGate',
            desc: 'Comparativa de consistencia interna y validez de constructo del IDARE en muestras latinoamericanas.'
        },
        {
            id: 54,
            discipline: 'psicologia',
            topic: 'Psicometría',
            title: 'Inventario de Escalas Psicosociales en México - Dra. Nazira Calleja (UNAM)',
            url: 'https://www.psicologia.unam.mx/documentos/pdf/repositorio/InventarioEscalasPsicosocialesNaziraCalleja.pdf',
            badge: 'Libro UNAM',
            desc: 'Compendio de escalas e inventarios psicológicos validados y baremados para la población mexicana.'
        },
        {
            id: 55,
            discipline: 'psicologia',
            topic: 'NEUROPSI',
            title: 'NEUROPSI Atención y Memoria: Protocolo y Guía de Calificación',
            url: 'https://es.slideshare.net/slideshow/neuropsi-250256746/250256746',
            badge: 'SlideShare',
            desc: 'Material didáctico sobre administración, baremos y curvas de rendimiento del NEUROPSI.'
        },
        {
            id: 56,
            discipline: 'psicologia',
            topic: 'Ética Profesional',
            title: 'Código de Ética de las y los Psicólogos Mexicanos - FENAPSIME 2018',
            url: 'https://fenapsime.org/wp-content/uploads/2022/11/Codigo-de-Etica-FENAPSIME.pdf',
            badge: 'FENAPSIME',
            desc: 'Normativa ética para el ejercicio profesional de la psicología en México, confidencialidad y peritajes.'
        },
        {
            id: 57,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Programa Académico: Evaluación Neuropsicológica - SUA-Psicología UNAM',
            url: 'https://sua.psicologia.unam.mx/docs/pdf/plan2008/1630EvaluacionNeuropsicologica.pdf',
            badge: 'UNAM SUA',
            desc: 'Ejes formativos sobre integración diagnóstica, análisis cuantitativo-cualitativo y devolución ética.'
        },
        {
            id: 58,
            discipline: 'psicologia',
            topic: 'Neuropsicología',
            title: 'Evaluación Neuropsicológica de Pacientes Clínicos en México - LeedPress',
            url: 'https://leedpress.com.mx/index.php/envios/catalog/download/2/2/53?inline=1',
            badge: 'LeedPress',
            desc: 'Reporte clínico sobre la aplicación de baterías neuropsicológicas en diagnósticos de alta especialidad.'
        },
        {
            id: 59,
            discipline: 'psicologia',
            topic: 'Ética Profesional',
            title: 'Código Ético del Psicólogo Evaluador en México - Glosario Psicotest',
            url: 'https://psicotest.mx/glosario/codigo-etico-del-psicologo-evaluador-en-mexico',
            badge: 'Psicotest',
            desc: 'Principios deontológicos sobre la protección de la privacidad, custodia de test y consentimiento informado.'
        },
        {
            id: 60,
            discipline: 'psicologia',
            topic: 'Ética Profesional',
            title: 'Código APA para la Evaluación Psicológica - Facultad de Psicología UNAM',
            url: 'https://www.psicologia.unam.mx/documentos/pdf/comite_etica/Codigo_APA.pdf',
            badge: 'Comité Ética UNAM',
            desc: 'Estándares internacionales de la APA homologados por el Comité de Ética de la Facultad de Psicología.'
        },
        {
            id: 61,
            discipline: 'psicologia',
            topic: 'Ética Profesional',
            title: 'Código Ético del Psicólogo - Sociedad Mexicana de Psicología (Simuladores Levyc)',
            url: 'https://ciberpsicologia.unam.mx/SimuladoresLevyc/etico.pdf',
            badge: 'SMP • UNAM',
            desc: 'Artículos 18, 24, 26, 34 y 60 sobre uso restringido a cédula, baremos mexicanos y seguridad de reactivos.'
        },
        {
            id: 62,
            discipline: 'psicologia',
            topic: 'Ética Profesional',
            title: 'Código Ético del Psicólogo | AMAPSI - Asociación Mexicana de Alternativas',
            url: 'https://amapsi.org/cdigo-tico-del-psiclogo/',
            badge: 'AMAPSI',
            desc: 'Directrices éticas para el quehacer psicológico en México, responsabilidad social y derechos humanos.'
        }
    ];

    // Datos descriptivos de las demás disciplinas (En proceso de homologación)
    const DISCIPLINES_INFO = {
        todas: {
            name: 'Todas las Fuentes',
            count: 62,
            icon: 'library_books',
            color: 'text-indigo-500'
        },
        psicologia: {
            name: 'Psicología',
            count: 62,
            icon: 'psychology',
            color: 'text-purple-500',
            description: 'Acervo completo de 62 fuentes indexadas sobre psicometría, teoría de la medida (TCT/TRI), baterías de ejecución máxima (WAIS-IV, NEUROPSI, BANFE-2), pruebas afectivas y código ético.'
        },
        embriologia: {
            name: 'Embriología',
            count: 0,
            icon: 'breastfeeding',
            color: 'text-rose-500',
            description: 'Próximamente se integrarán las fuentes oficiales de Embriología (Tratados de Moore, Langman, Carlson y publicaciones de embriogénesis clínica).'
        },
        anatomia: {
            name: 'Anatomía',
            count: 0,
            icon: 'hand_bones',
            color: 'text-amber-500',
            description: 'Próximamente se integrarán las fuentes oficiales de Anatomía Humana (Tratados de Rouvière, Latarjet, Netter y guías anatómicas UNAM).'
        },
        histologia: {
            name: 'Histología',
            count: 0,
            icon: 'vital_signs',
            color: 'text-emerald-500',
            description: 'Próximamente se integrarán las fuentes oficiales de Histología Médica (Tratados de Ross, Junqueira, Gartner y manuales de microscopía tisular).'
        },
        bioquimica: {
            name: 'Bioquímica',
            count: 0,
            icon: 'immunology',
            color: 'text-cyan-500',
            description: 'Próximamente se integrarán las fuentes oficiales de Bioquímica Médica (Tratados de Lehninger, Harper, McKee y rutas metabólicas).'
        },
        fisiologia: {
            name: 'Fisiología',
            count: 0,
            icon: 'pulmonology',
            color: 'text-blue-500',
            description: 'Próximamente se integrarán las fuentes oficiales de Fisiología Médica (Tratados de Guyton & Hall, Boron, Ganong y artículos de hemodinámica y homeostasis).'
        }
    };

    let activeDiscipline = 'todas';
    let activeTopic = 'all';
    let searchQuery = '';

    function initBibliography() {
        const grid = document.getElementById('biblio-cards-grid');
        const emptyState = document.getElementById('biblio-empty-state');
        const searchInput = document.getElementById('biblio-search-input');
        const counterEl = document.getElementById('biblio-results-counter');
        const disciplinePills = document.querySelectorAll('.biblio-discipline-pill');
        const topicPillsContainer = document.getElementById('biblio-topic-pills');

        if (!grid) return;

        // Extraer temas únicos de Psicología
        const topics = ['all', ...new Set(BIBLIO_DATA.map(item => item.topic))];

        // Renderizar píldoras de temas
        if (topicPillsContainer) {
            topicPillsContainer.innerHTML = '';
            topics.forEach(t => {
                const btn = document.createElement('button');
                btn.className = `px-3 py-1 rounded-full text-xs font-semibold border transition-all ${t === activeTopic ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-[var(--background-navigation)] text-[var(--black-color)] border-[var(--border-navigation)] hover:bg-indigo-500/10'}`;
                btn.textContent = t === 'all' ? 'Todos los Temas' : t;
                btn.addEventListener('click', () => {
                    activeTopic = t;
                    // Actualizar estilos activos de los temas
                    topicPillsContainer.querySelectorAll('button').forEach(b => {
                        b.className = 'px-3 py-1 rounded-full text-xs font-semibold border transition-all bg-[var(--background-navigation)] text-[var(--black-color)] border-[var(--border-navigation)] hover:bg-indigo-500/10';
                    });
                    btn.className = 'px-3 py-1 rounded-full text-xs font-semibold border transition-all bg-indigo-600 text-white border-indigo-600 shadow-sm';
                    renderCards();
                });
                topicPillsContainer.appendChild(btn);
            });
        }

        function filterData() {
            return BIBLIO_DATA.filter(item => {
                // Filtro por disciplina
                if (activeDiscipline !== 'todas' && item.discipline !== activeDiscipline) {
                    return false;
                }
                // Filtro por tema
                if (activeTopic !== 'all' && item.topic !== activeTopic) {
                    return false;
                }
                // Filtro por búsqueda
                if (searchQuery.trim() !== '') {
                    const q = searchQuery.toLowerCase();
                    const matchTitle = item.title.toLowerCase().includes(q);
                    const matchDesc = item.desc.toLowerCase().includes(q);
                    const matchUrl = item.url.toLowerCase().includes(q);
                    const matchBadge = item.badge.toLowerCase().includes(q);
                    const matchTopic = item.topic.toLowerCase().includes(q);
                    if (!matchTitle && !matchDesc && !matchUrl && !matchBadge && !matchTopic) {
                        return false;
                    }
                }
                return true;
            });
        }

        function renderCards() {
            const filtered = filterData();

            // Si es una disciplina que aún no tiene fuentes (Embriología, Anatomía, etc.)
            if (activeDiscipline !== 'todas' && activeDiscipline !== 'psicologia') {
                const info = DISCIPLINES_INFO[activeDiscipline];
                grid.innerHTML = `
                    <div class="col-span-full fisio-glass-card rounded-[35px] p-8 text-center border border-[var(--border-navigation)]">
                        <span class="material-symbols-outlined text-5xl ${info.color} mb-3">${info.icon}</span>
                        <h4 class="text-xl font-black text-[var(--black-color)]">Sección de ${info.name}</h4>
                        <p class="text-xs md:text-sm text-[var(--color-text-inactive)] mt-2 max-w-lg mx-auto leading-relaxed">
                            ${info.description}
                        </p>
                        <div class="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                            <span class="material-symbols-outlined text-sm">schedule</span> En proceso de homologación curricular
                        </div>
                    </div>
                `;
                if (counterEl) counterEl.textContent = '0 fuentes encontradas';
                return;
            }

            if (filtered.length === 0) {
                grid.innerHTML = '';
                if (emptyState) emptyState.classList.remove('hidden');
                if (counterEl) counterEl.textContent = '0 fuentes encontradas';
                return;
            }

            if (emptyState) emptyState.classList.add('hidden');
            if (counterEl) counterEl.textContent = `${filtered.length} fuentes disponibles`;

            grid.innerHTML = '';
            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'biblio-card fisio-glass-card rounded-[28px] p-5 flex flex-col justify-between border border-[var(--border-navigation)] shadow-sm';

                // Dominio simplificado para mostrar
                let domain = '';
                try {
                    const u = new URL(item.url);
                    domain = u.hostname.replace('www.', '');
                } catch (e) {
                    domain = 'unam.mx';
                }

                card.innerHTML = `
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-3">
                            <div class="flex items-center gap-2">
                                <span class="w-7 h-7 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-mono font-black text-xs flex items-center justify-center">
                                    #${String(item.id).padStart(2, '0')}
                                </span>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                    ${item.badge}
                                </span>
                            </div>
                            <span class="text-[10px] font-semibold text-[var(--color-text-inactive)] bg-[var(--background-navigation)] px-2 py-0.5 rounded-lg border border-[var(--border-navigation)]">
                                ${item.topic}
                            </span>
                        </div>

                        <h4 class="font-black text-sm md:text-base text-[var(--black-color)] leading-snug mb-2">
                            ${item.title}
                        </h4>

                        <p class="text-xs text-[var(--color-text-inactive)] leading-relaxed mb-4">
                            ${item.desc}
                        </p>
                    </div>

                    <div class="pt-3 border-t border-[var(--border-navigation)] flex items-center justify-between">
                        <span class="text-[11px] font-mono font-medium text-[var(--color-text-inactive)] truncate max-w-[170px]" title="${item.url}">
                            <i class="ri-link text-xs mr-0.5"></i>${domain}
                        </span>

                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all">
                            <span>Abrir Fuente</span>
                            <span class="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                    </div>
                `;

                grid.appendChild(card);
            });
        }

        // Eventos de Píldoras de Disciplina
        disciplinePills.forEach(pill => {
            pill.addEventListener('click', () => {
                disciplinePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeDiscipline = pill.getAttribute('data-discipline') || 'todas';
                
                // Si la disciplina es distinta a psicología, ocultar filtros de temas
                if (topicPillsContainer) {
                    if (activeDiscipline === 'todas' || activeDiscipline === 'psicologia') {
                        topicPillsContainer.parentElement.classList.remove('hidden');
                    } else {
                        topicPillsContainer.parentElement.classList.add('hidden');
                    }
                }
                renderCards();
            });
        });

        // Búsqueda en vivo
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderCards();
            });
        }

        // Renderizado inicial
        renderCards();
    }

    window.__manualInitBibliografia = initBibliography;
    window.initBibliografia = initBibliography;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBibliography);
    } else {
        initBibliography();
    }

})();
