# -*- coding: utf-8 -*-
"""
Generador del catálogo de actividades del Aula ATECA.

Fuente de las siglas: aplicación de horarios del centro 2026-27
(https://fpapps.es/horarios-iab-26-27/) — siglas asignadas por la Consejería.
CSAF: 1º y 2º (presencial y semipresencial). CSCI: solo 1º en 2026-27.
Pendientes: CFGM Gestión Administrativa, ciclo básico y ciclo de Deporte.

Todas las fichas son PROPUESTAS (no experiencias realizadas).
Uso:  python3 scripts/generate_activities.py
"""
import json, os

BOOK = "https://ateca.fpapps.es"
CYCLES = {
    "CSAF": "CFGS Administración y Finanzas",
    "CSCI": "CFGS Comercio Internacional",
}
ZONES = {
    "av": ("Zona Multimedia y Croma", "zona-audiovisual"),
    "3d": ("Zona de Fabricación Digital 3D", "zona-3d"),
    "vr": ("Zona de Realidad Virtual (VR)", "zona-vr"),
    "sim": ("Zona de Simulación Administrativa", "zona-simulacion"),
}
MODULES = {
    # 1º CSAF
    "CYA": ("Comunicación y Atención al Cliente", "1º"),
    "OFA": ("Ofimática y Proceso de la Información", "1º"),
    "GTJ": ("Gestión de la Documentación Jurídica y Empresarial", "1º"),
    "PNG": ("Proceso Integral de la Actividad Comercial", "1º"),
    "RCB": ("Recursos Humanos y Responsabilidad Social Corporativa", "1º"),
    "ITK": ("Itinerario Personal para la Empleabilidad I", "1º"),
    "IKL": ("Inglés Profesional", "1º"),
    "DJK": ("Digitalización Aplicada a los Sectores Productivos", "1º"),
    # 2º CSAF
    "COB": ("Contabilidad y Fiscalidad", "2º"),
    "GEF": ("Gestión Financiera", "2º"),
    "GIL": ("Gestión Logística y Comercial", "2º"),
    "GTH": ("Gestión de Recursos Humanos", "2º"),
    "SML": ("Simulación Empresarial", "2º"),
    "SOJ": ("Sostenibilidad Aplicada al Sistema Productivo", "2º"),
    "YFI": ("Proyecto de Administración y Finanzas", "2º"),
    "IPW": ("Itinerario Personal para la Empleabilidad II", "2º"),
    "OGV": ("Organización de Eventos Empresariales (optativa)", "2º"),
    # 1º CSCI
    "GEL": ("Gestión Económica y Financiera del Transporte", "1º"),
    "GII": ("Gestión Administrativa del Comercio Internacional", "1º"),
    "LOD": ("Logística de Almacenamiento", "1º"),
    "TRO": ("Transporte Internacional de Mercancías", "1º"),
}

LEGAL_CASH = (
    "Usa una MONEDA DIDÁCTICA FICTICIA: diseño propio, tamaño distinto al real, sin el símbolo €, "
    "sin la palabra «euro», sin imitar diseños, cantos ni símbolos oficiales, y con la leyenda "
    "«DIDÁCTICO – SIN VALOR». Los billetes se imprimen por una sola cara y con un formato claramente "
    "distinto del real. Las reproducciones de billetes en euros están reguladas por la Decisión BCE/2013/10 "
    "(autoriza el Banco de España) y las fichas similares a monedas de euro por el Reglamento (CE) 2182/2004. "
    "En la hoja de arqueo se trabaja con la equivalencia 1 unidad didáctica = 1 €."
)

acts = []
counter = {}

def add(cycle, code, title, zone, tech, guide, objective, materials, preparation, steps,
        product, evaluation, tags, difficulty="Iniciación", origin=None, legal=None, note=None):
    key = (cycle, code)
    counter[key] = counter.get(key, 0) + 1
    assert counter[key] <= 2, f"Más de 2 actividades en {key}"
    name, course = MODULES[code]
    zname, zid = ZONES[zone]
    a = {
        "id": f"act-{cycle.lower()}-{code.lower()}-{counter[key]:02d}",
        "title": title,
        "cycle": CYCLES[cycle],
        "cycleCode": cycle,
        "course": course,
        "module": name,
        "officialCode": code,
        "zone": zname,
        "zoneId": zid,
        "technology": tech,
        "guideId": guide,
        "duration": "55 minutos",
        "difficulty": difficulty,
        "status": "Propuesta",
        "objective": objective,
        "materials": materials,
        "preparation": preparation,
        "steps": steps,
        "finalProduct": product,
        "evaluation": evaluation,
        "bookingUrl": BOOK,
        "tags": tags,
    }
    if origin: a["origin"] = origin
    if legal: a["legalNote"] = legal
    if note: a["sessionNote"] = note
    acts.append(a)

IDEA = "Idea aportada por el profesorado del departamento"
PRINT_NOTE = ("La impresión 3D no cabe en 55 minutos: el docente (o el alumnado en una sesión previa) "
              "lanza la impresión con antelación. En la sesión se diseña o se utiliza lo ya impreso.")

# ======================= 1º CSAF =======================
add("CSAF", "PNG", "Arqueo de caja con monedas impresas en 3D y billetes didácticos",
    "3d", "Impresora 3D Bambu Lab X1 Carbon + impresora del centro (papel)", "guia-impresora3d",
    "Realizar el arqueo de caja de un pequeño comercio al cierre del día: contar el efectivo, compararlo con el saldo según ventas, detectar descuadres y dejar el fondo de caja para el día siguiente.",
    ["Juego de monedas didácticas impresas en 3D (una bolsa por equipo)",
     "Billetes didácticos impresos en papel por una cara (color o B/N)",
     "Bandeja o caja registradora de cartón por equipo",
     "Plantilla de hoja de arqueo (papel o hoja de cálculo)",
     "Listado de ventas del día (tickets en efectivo y con tarjeta)"],
    "Diseñar o descargar un modelo de ficha con valores 0,01–2 y billetes 5–50 de la moneda didáctica, imprimir un juego por equipo y preparar en cada bolsa un importe con un descuadre distinto (sobrante o faltante).",
    ["(5 min) Situación: cierre de una tienda de souvenirs en el Puerto de la Cruz. Se reparte la caja y el listado de ventas.",
     "(15 min) Recuento por denominaciones y registro en la hoja de arqueo (unidades × valor).",
     "(10 min) Comparación con el saldo teórico: fondo inicial + cobros en efectivo − pagos en efectivo.",
     "(10 min) Si hay descuadre, buscar la causa (ticket mal cobrado, cambio mal dado, pago sin justificante) y anotarla.",
     "(10 min) Cierre: separar el fondo fijo de caja, preparar la entrega al banco y firmar el acta de arqueo.",
     "(5 min) Puesta en común en la pantalla interactiva."],
    "Hoja de arqueo firmada con recuento por denominaciones, saldo teórico, descuadre justificado y propuesta de entrega bancaria.",
    "Lista de cotejo: recuento correcto, cálculo del saldo teórico, detección y justificación del descuadre, orden y firma del acta.",
    ["Arqueo de caja", "Cobros y pagos", "Impresión 3D", "Comercio"],
    origin=IDEA, legal=LEGAL_CASH, note=PRINT_NOTE)



add("CSAF", "PNG", "Del pedido a la factura con IGIC en FacturaScripts", "sim",
    "Puestos informáticos + ERP FacturaScripts", "guia-puestos-pc",
    "Tramitar el ciclo de venta completo de un mayorista canario (pedido, albarán y factura) aplicando correctamente el IGIC y comprobando los totales.",
    ["Puesto informático con FacturaScripts (empresa de prácticas creada por el docente)",
     "Pedido de un cliente (un restaurante del norte de Tenerife) en PDF",
     "Tabla de tipos de IGIC vigentes facilitada por el docente"],
    "Crear en FacturaScripts una empresa de prácticas con 5 artículos, 2 clientes y la serie de facturación. Comprobar el acceso desde los puestos antes de la sesión.",
    ["(5 min) Lectura del pedido recibido por correo.",
     "(15 min) Alta del pedido de cliente en FacturaScripts.",
     "(10 min) Generación del albarán desde el pedido (con entrega parcial de un artículo sin existencias).",
     "(15 min) Facturación del albarán y revisión de base imponible, IGIC y total.",
     "(10 min) Exportación a PDF y revisión cruzada por parejas."],
    "Pedido, albarán y factura en PDF, coherentes entre sí y con el IGIC bien aplicado.",
    "Rúbrica breve: datos fiscales completos, coherencia pedido-albarán-factura, cálculo del impuesto y presentación.",
    ["FacturaScripts", "IGIC", "Facturación", "ERP"], difficulty="Intermedio")

add("CSAF", "CYA", "Cartelería y rótulos en 3D para el punto de atención al cliente",
    "3d", "Impresora 3D Bambu Lab X1 Carbon (AMS multicolor) + PC de diseño", "guia-impresora3d",
    "Diseñar un elemento de comunicación visual para un punto de venta o de atención (rótulo de mostrador, placa «Atención al cliente», horario, cartel de oferta) aplicando criterios de imagen corporativa y legibilidad.",
    ["PC con Tinkercad (web gratuita) o Bambu Studio",
     "Bocetos en papel y manual de imagen de una empresa ficticia",
     "Bobinas de PLA en los colores corporativos (en el AMS)"],
    "Preparar una plantilla de placa (por ejemplo 15 × 5 cm) con texto en relieve. Imprimir un ejemplo para mostrarlo. Revisar que hay filamento suficiente.",
    ["(5 min) Encargo: un comercio o una oficina de atención al público necesita señalética y un cartel promocional.",
     "(10 min) Boceto: mensaje breve, jerarquía visual, colores corporativos y tamaño de letra legible a 2 m.",
     "(25 min) Modelado en Tinkercad: base, texto en relieve y logotipo sencillo. Exportación a STL/3MF.",
     "(10 min) Laminado en Bambu Studio: asignación de colores por pieza y estimación de tiempo y filamento (coste).",
     "(5 min) El docente envía a imprimir los mejores diseños o los programa para fuera del horario."],
    "Archivo 3MF listo para imprimir + ficha con el mensaje, colores y coste estimado. Pieza impresa en la sesión siguiente.",
    "Rúbrica: claridad del mensaje, coherencia con la imagen corporativa, legibilidad, viabilidad técnica y coste.",
    ["Marketing", "Imagen corporativa", "Impresión 3D", "Punto de venta"],
    origin=IDEA, note=PRINT_NOTE)

add("CSAF", "CYA", "Atender una reclamación: role-play grabado y analizado", "av",
    "Cámara PTZ + micrófonos inalámbricos + pantalla interactiva", "guia-audiovisual",
    "Atender a un cliente insatisfecho de forma presencial y telefónica aplicando técnicas de escucha activa, gestionando la hoja de reclamación y cerrando con una solución.",
    ["Cámara PTZ y micrófono de solapa o de mesa",
     "Tarjetas de casos (hotel, agencia de viajes, comercio, gestoría)",
     "Hoja de reclamación oficial de Canarias (modelo vigente impreso)",
     "Ficha de observación para el resto del grupo"],
    "Comprobar la cámara y el audio con una prueba de 30 segundos. Preparar 4 tarjetas de caso con distinto grado de dificultad.",
    ["(5 min) Explicación del protocolo: escuchar, empatizar, preguntar, proponer y cerrar.",
     "(25 min) Cuatro role-plays de 4 minutos grabados (cliente/empleado/observadores rotan).",
     "(15 min) Visionado en la pantalla interactiva y análisis con la ficha de observación (lenguaje verbal y no verbal).",
     "(10 min) Cumplimentación de la hoja de reclamación y la respuesta escrita al cliente."],
    "Vídeo del role-play + hoja de reclamación cumplimentada + respuesta escrita al cliente.",
    "Ficha de observación (escucha, tono, solución, cierre) con autoevaluación y coevaluación.",
    ["Atención al cliente", "Reclamaciones", "Comunicación", "Vídeo"])

add("CSAF", "OFA", "Videotutoriales de los equipos ATECA hechos por el alumnado", "av",
    "Croma + Canon EOS R50 o cámara PTZ + micrófonos + PC de edición", "guia-audiovisual",
    "Elaborar un videotutorial breve (1–2 min) de uso básico de un recurso del Aula ATECA, con guion, grabación y edición, para que lo use toda la comunidad educativa mediante un código QR junto al equipo.",
    ["Guion de una página (plantilla)",
     "Croma, iluminación LED, cámara y micrófono",
     "PC con un editor de vídeo instalado (por ejemplo, Clipchamp u otro disponible)",
     "Guía rápida del equipo elegido (sección Puesta en marcha del portal)"],
    "Asignar a cada equipo un recurso (gafas VR, pantalla, impresora 3D, micrófonos…). Los guiones se redactan antes, en una clase ordinaria. Recordar la autorización de imagen del alumnado.",
    ["(5 min) Repaso del guion: qué es, encender, uso básico, apagar y un error frecuente.",
     "(20 min) Grabación por turnos en el croma (plano general + plano detalle del equipo).",
     "(20 min) Edición: cortes, rótulos, subtítulos y logotipo ATECA.",
     "(10 min) Exportación en MP4 y revisión con el docente (exactitud técnica)."],
    "Videotutorial MP4 de 1–2 min con subtítulos, listo para publicarse y enlazarse con QR desde la guía del equipo.",
    "Rúbrica: exactitud técnica, claridad, calidad de audio e imagen, subtítulos y duración.",
    ["Vídeo", "Tutoriales", "Comunidad educativa", "QR"], origin=IDEA,
    note="Proyecto de 2–3 sesiones (guion, grabación, edición). Esta ficha describe la sesión de grabación y edición.")

add("CSAF", "OFA", "Cartas y etiquetas a clientes con combinación de correspondencia", "sim",
    "Puestos informáticos + procesador de textos y hoja de cálculo", "guia-puestos-pc",
    "Preparar una comunicación masiva personalizada (aviso de cambio de horario o de tarifas) con combinación de correspondencia a partir de una base de datos de clientes.",
    ["Base de datos de 30 clientes ficticios (hoja de cálculo)",
     "Plantilla de carta con membrete de la empresa",
     "Proyección del proceso en la pantalla interactiva"],
    "Dejar en la carpeta compartida la base de datos con algunos errores (duplicados, códigos postales incompletos) para depurarla.",
    ["(10 min) Depuración de la base de datos: duplicados, formatos y filtros.",
     "(20 min) Carta con campos combinados y regla condicional (Sr./Sra.).",
     "(15 min) Etiquetas de sobre y envío a PDF.",
     "(10 min) Revisión de errores frecuentes y protección de datos (RGPD) en envíos masivos."],
    "Carta combinada en PDF + hoja de etiquetas + base de datos depurada.",
    "Lista de cotejo: datos depurados, campos correctos, regla condicional y formato profesional.",
    ["Ofimática", "Correspondencia", "Bases de datos", "RGPD"])

add("CSAF", "GTJ", "Constituir una SL en Canarias: mapa de trámites en la pantalla interactiva", "sim",
    "Pantalla interactiva ViewBoard + puestos informáticos", "guia-pantalla",
    "Ordenar y documentar los trámites de constitución de una sociedad limitada (vía telemática con el PAE/CIRCE o vía presencial), identificando el organismo, el documento y el plazo de cada paso.",
    ["Pantalla interactiva con pizarra digital",
     "Tarjetas de trámites (certificación de denominación, escritura, NIF, registro mercantil, alta censal…)",
     "Acceso web a la información oficial del CIRCE y del PAE"],
    "Preparar en la pizarra digital una línea de tiempo vacía y las tarjetas de trámites desordenadas.",
    ["(5 min) Caso: dos socios quieren abrir una empresa de reparto en La Orotava.",
     "(15 min) En parejas, consultan la información oficial y ordenan las tarjetas.",
     "(15 min) Cada pareja coloca un trámite en la línea de tiempo de la pantalla y explica organismo y documento.",
     "(15 min) Comparación vía telemática vs. presencial: tiempo, coste y documentos.",
     "(5 min) Exportación del mapa en PDF."],
    "Mapa de trámites (PDF) con organismo, documento y orden correcto.",
    "Lista de cotejo: orden, organismos correctos, documentos identificados y exposición.",
    ["Constitución de sociedades", "Trámites", "Pantalla interactiva"])

add("CSAF", "GTJ", "Registro y archivo digital de documentos de una gestoría", "sim",
    "Puestos informáticos + carpeta compartida", "guia-puestos-pc",
    "Registrar la entrada y salida de documentos y organizar un archivo digital con un sistema de nombres coherente, control de versiones y criterios de protección de datos.",
    ["Lote de 20 documentos PDF ficticios (contratos, facturas, escritos)",
     "Plantilla de libro de registro en hoja de cálculo"],
    "Copiar el lote de documentos desordenados a la carpeta de trabajo de cada puesto.",
    ["(10 min) Normas de nombrado (AAAAMMDD_tipo_entidad) y estructura de carpetas.",
     "(20 min) Registro de entrada/salida de cada documento en el libro.",
     "(15 min) Archivo en la estructura de carpetas y clasificación de documentos con datos personales.",
     "(10 min) Búsqueda cronometrada: el docente pide 5 documentos y se mide el tiempo."],
    "Libro de registro cumplimentado + estructura de archivo ordenada.",
    "Lista de cotejo: registro completo, nombrado coherente, tratamiento de datos personales, tiempo de búsqueda.",
    ["Archivo", "Registro", "Gestión documental", "RGPD"])

add("CSAF", "RCB", "Entrevista de selección grabada con cámara PTZ", "av",
    "Cámara PTZ + micrófonos de mesa + pantalla interactiva", "guia-audiovisual",
    "Preparar y realizar una entrevista de selección por competencias para un puesto administrativo, y evaluar al candidato con una ficha objetiva.",
    ["Perfil del puesto (auxiliar administrativo en un hotel)",
     "Guion de preguntas por competencias",
     "Ficha de valoración del candidato"],
    "Colocar dos sillas y una mesa frente a la cámara PTZ; probar el audio de los micrófonos de mesa.",
    ["(10 min) Diseño del guion de preguntas por competencias en grupos.",
     "(25 min) Tres entrevistas de 7 minutos grabadas (entrevistador, candidato, observador).",
     "(15 min) Visionado de fragmentos en la pantalla y valoración con la ficha.",
     "(5 min) Decisión razonada de selección."],
    "Guion de entrevista + fichas de valoración + informe breve de selección.",
    "Rúbrica: calidad de las preguntas, objetividad de la valoración y comunicación.",
    ["Selección de personal", "Entrevista", "Competencias"])

add("CSAF", "RCB", "Vídeo de RSC de una empresa canaria con croma", "av",
    "Croma + Canon EOS R50 + micrófono de solapa", "guia-audiovisual",
    "Analizar las acciones de responsabilidad social de una empresa canaria real o ficticia y comunicarlas en un vídeo de 60 segundos.",
    ["Memoria de sostenibilidad o noticias de una empresa canaria",
     "Croma e iluminación",
     "Fondos de imagen relacionados con la empresa"],
    "Seleccionar 3–4 empresas y preparar los fondos para el croma.",
    ["(15 min) Análisis: acciones sociales, ambientales y de gobierno; relación con los ODS.",
     "(10 min) Guion de 60 segundos.",
     "(20 min) Grabación por equipos en el croma.",
     "(10 min) Visionado y comentarios."],
    "Vídeo de 60 s sobre la RSC de la empresa + ficha de análisis.",
    "Rúbrica: rigor del análisis, relación con los ODS, claridad del mensaje.",
    ["RSC", "ODS", "Croma", "Vídeo"])

add("CSAF", "DJK", "Uso responsable de la IA generativa en tareas de oficina", "sim",
    "Puestos informáticos + herramientas de IA autorizadas por el centro", "guia-puestos-pc",
    "Comparar el trabajo con y sin IA en tareas administrativas habituales (resumir un documento, redactar un correo, clasificar gastos), detectando errores y riesgos de privacidad.",
    ["Puestos informáticos con acceso a una herramienta de IA permitida",
     "Tres tareas reales anonimizadas",
     "Lista de comprobación de verificación de resultados"],
    "Confirmar qué herramienta de IA está autorizada y preparar las tareas sin datos personales.",
    ["(10 min) Normas: qué datos no se introducen nunca en una IA.",
     "(25 min) Resolución de las tres tareas con IA y verificación manual de cada resultado.",
     "(15 min) Puesta en común: errores encontrados, tiempo ahorrado y riesgos.",
     "(5 min) Redacción de 5 normas de uso de IA para una oficina."],
    "Informe con las tareas, los errores detectados y un decálogo de uso responsable.",
    "Lista de cotejo: verificación de resultados, detección de errores y calidad del decálogo.",
    ["Inteligencia artificial", "Digitalización", "Privacidad"])

add("CSAF", "DJK", "Canal de YouTube del Aula ATECA: crear, organizar y publicar", "av",
    "PC de altas prestaciones + croma/cámara + cuenta de YouTube del centro", "guia-audiovisual",
    "Planificar y gestionar un canal de YouTube educativo (identidad visual, listas de reproducción, metadatos, accesibilidad y privacidad) para publicar los videotutoriales de los equipos ATECA y otros contenidos del alumnado y del profesorado.",
    ["PC con navegador y editor de imagen (miniaturas)",
     "Cuenta de YouTube del centro (la gestiona el docente; el alumnado no usa cuentas personales)",
     "Videotutoriales grabados en OFA u otros módulos",
     "Plantilla de plan de canal y checklist de publicación"],
    "El docente crea o administra el canal con la cuenta institucional y decide la visibilidad (público o «no listado»). Revisar las autorizaciones de imagen antes de publicar.",
    ["(10 min) Análisis de 2 canales educativos de referencia: qué funciona y por qué.",
     "(15 min) Plan del canal: nombre, descripción, banner, listas (una por zona del aula) y calendario.",
     "(15 min) Preparación de un vídeo: título, descripción con enlace a la guía, etiquetas, miniatura y subtítulos.",
     "(10 min) Checklist legal: autorizaciones de imagen, música libre de derechos, datos personales.",
     "(5 min) El docente publica (o programa) el vídeo revisado."],
    "Plan de canal + un vídeo listo para publicar con metadatos, miniatura y subtítulos.",
    "Rúbrica: coherencia del plan, calidad de metadatos y accesibilidad, cumplimiento del checklist legal.",
    ["YouTube", "Identidad digital", "Comunidad educativa", "Vídeo"], origin="Propuesta del coordinador del proyecto",
    note="Se complementa con la actividad «Videotutoriales de los equipos ATECA» (OFA).")

add("CSAF", "ITK", "Videocurrículum de 60 segundos con croma", "av",
    "Croma + Canon EOS R50 + micrófono de solapa", "guia-audiovisual",
    "Preparar y grabar un videocurrículum que destaque competencias profesionales para un puesto concreto.",
    ["Croma, iluminación y micrófono", "Oferta de empleo real del sector administrativo en Canarias", "Plantilla de guion"],
    "Seleccionar ofertas de empleo reales y preparar un fondo neutro o corporativo para el croma.",
    ["(15 min) Guion: presentación, competencias, logro, cierre.",
     "(25 min) Grabación por turnos (2 tomas por persona).",
     "(15 min) Visionado y coevaluación."],
    "Videocurrículum de 60 s.",
    "Rúbrica: adecuación a la oferta, claridad, comunicación no verbal.",
    ["Empleabilidad", "Videocurrículum", "Croma"])

add("CSAF", "IKL", "Front office in English: atender a un cliente extranjero", "av",
    "Cámara PTZ + micrófonos + pantalla interactiva", "guia-audiovisual",
    "Atender en inglés a un cliente extranjero en la recepción de una empresa o un hotel del Puerto de la Cruz: acogida, información, incidencia y despedida.",
    ["Tarjetas de rol en inglés", "Cámara PTZ y micrófonos", "Glosario de expresiones de atención al cliente"],
    "Preparar tarjetas con situaciones habituales (reserva, factura, queja, indicaciones).",
    ["(10 min) Repaso de expresiones clave.",
     "(25 min) Role-plays grabados por parejas.",
     "(15 min) Visionado y corrección de pronunciación y registro.",
     "(5 min) Autoevaluación."],
    "Role-play grabado + glosario personal.",
    "Rúbrica: fluidez, corrección, registro formal y resolución de la situación.",
    ["Inglés", "Atención al cliente", "Turismo"])

# ======================= 2º CSAF =======================
add("CSAF", "COB", "Del arqueo al asiento: sobrantes y faltantes de caja", "3d",
    "Monedas didácticas impresas en 3D + puestos con software contable", "guia-impresora3d",
    "Contabilizar el resultado de un arqueo de caja (sobrante o faltante) y la reposición del fondo fijo, conciliando el saldo de la cuenta de caja con el efectivo real.",
    ["Juego de monedas y billetes didácticos (los de la actividad de PNG)",
     "Libro mayor de la cuenta de caja con movimientos del mes",
     "Puestos con el programa de contabilidad del aula (p. ej., Contasol)"],
    "Reutilizar las bolsas de arqueo de PNG con un descuadre distinto. Preparar el mayor de caja.",
    ["(15 min) Arqueo rápido por equipos.",
     "(10 min) Comparación con el saldo contable de caja y cálculo de la diferencia.",
     "(15 min) Asientos: diferencia pendiente de aplicar, regularización y reposición del fondo fijo.",
     "(10 min) Registro en el programa contable.",
     "(5 min) Corrección en la pantalla interactiva."],
    "Acta de arqueo + asientos contables registrados.",
    "Lista de cotejo: cálculo de la diferencia, cuentas utilizadas y registro correcto.",
    ["Contabilidad", "Arqueo de caja", "Tesorería"], difficulty="Intermedio",
    origin=IDEA, legal=LEGAL_CASH)

add("CSAF", "COB", "Liquidación trimestral del IGIC (modelo 420)", "sim",
    "Puestos informáticos + programa contable + web de la Agencia Tributaria Canaria", "guia-puestos-pc",
    "Preparar la liquidación trimestral del IGIC de una pyme a partir de los libros de facturas emitidas y recibidas.",
    ["Libros registro de IGIC del trimestre (ficticios)",
     "Acceso a la información del modelo 420 en la web de la ATC",
     "Programa contable del aula"],
    "Preparar unos libros registro con 15–20 facturas a distintos tipos de IGIC y alguna operación exenta.",
    ["(10 min) Revisión de los libros registro.",
     "(20 min) Cálculo de cuotas devengadas y deducibles por tipo.",
     "(15 min) Cumplimentación de un borrador del modelo 420 (sin presentarlo).",
     "(10 min) Asiento de liquidación y corrección."],
    "Borrador del modelo 420 + asiento de liquidación.",
    "Lista de cotejo: cuotas correctas, casillas y asiento.",
    ["IGIC", "Modelo 420", "Fiscalidad canaria"], difficulty="Intermedio")

add("CSAF", "GEF", "¿Préstamo o renting? Financiar la furgoneta de reparto", "sim",
    "Puestos informáticos + hoja de cálculo + pantalla interactiva", "guia-puestos-pc",
    "Comparar dos alternativas de financiación para una pyme canaria (préstamo y renting/leasing) calculando el coste total y presentando una recomendación.",
    ["Dos ofertas de financiación ficticias", "Plantilla de cuadro de amortización", "Pantalla interactiva"],
    "Preparar ofertas con datos realistas (importe, plazo, tipo de interés, comisiones).",
    ["(20 min) Cuadro de amortización del préstamo (método francés) en hoja de cálculo.",
     "(15 min) Coste total del renting y comparación.",
     "(15 min) Presentación de la recomendación en la pantalla (2 min por equipo).",
     "(5 min) Conclusiones."],
    "Hoja de cálculo comparativa + recomendación razonada.",
    "Rúbrica: corrección de cálculos, análisis y argumentación.",
    ["Financiación", "Préstamo", "Hoja de cálculo"], difficulty="Intermedio")

add("CSAF", "GEF", "Presentar el plan de inversión al banco", "av",
    "Pantalla interactiva + cámara PTZ + micrófonos", "guia-pantalla",
    "Defender ante un «comité de riesgos» la solicitud de financiación de un proyecto de inversión con sus indicadores (VAN, TIR, plazo de recuperación).",
    ["Proyecto de inversión con datos calculados previamente", "Pantalla interactiva", "Cámara PTZ"],
    "Los equipos llegan con los cálculos hechos; la sesión se dedica a la defensa.",
    ["(5 min) Organización del comité (docente + alumnado).",
     "(35 min) Presentaciones de 5 minutos con preguntas del comité, grabadas.",
     "(15 min) Deliberación y feedback."],
    "Presentación + vídeo de la defensa.",
    "Rúbrica: indicadores correctos, argumentación y respuesta a preguntas.",
    ["Inversión", "VAN", "TIR", "Presentaciones"], difficulty="Avanzado")

add("CSAF", "GIL", "Maqueta 3D del almacén de una distribuidora", "3d",
    "Impresora 3D Bambu Lab X1 Carbon + pantalla interactiva", "guia-impresora3d",
    "Diseñar la distribución en planta de un almacén pequeño (zonas de recepción, almacenaje, preparación y expedición) usando piezas impresas a escala.",
    ["Kit de piezas impresas a escala (estanterías, palés, muelles)", "Plano base en papel A3", "Datos de rotación de productos"],
    "Imprimir con antelación un kit de piezas por equipo.",
    ["(10 min) Análisis de los datos de rotación (ABC).",
     "(25 min) Distribución con la maqueta y justificación de los flujos.",
     "(15 min) Fotografía y presentación en la pantalla.",
     "(5 min) Comparación de soluciones."],
    "Plano/fotografía de la maqueta con la justificación de la distribución.",
    "Rúbrica: flujo lógico, uso del ABC, aprovechamiento del espacio.",
    ["Logística", "Almacén", "Impresión 3D"], note=PRINT_NOTE)

add("CSAF", "GIL", "Gestión de existencias y pedidos a proveedores en el ERP", "sim",
    "Puestos informáticos + FacturaScripts", "guia-puestos-pc",
    "Controlar las existencias de una distribuidora, detectar artículos bajo mínimo y generar los pedidos a proveedores.",
    ["FacturaScripts con artículos y stock inicial", "Movimientos de una semana"],
    "Cargar en FacturaScripts artículos con stock mínimo definido.",
    ["(15 min) Registro de entradas y salidas.",
     "(15 min) Detección de artículos bajo mínimo.",
     "(15 min) Pedidos a proveedores y recepción parcial.",
     "(10 min) Informe de valoración de existencias."],
    "Pedidos a proveedor + informe de existencias.",
    "Lista de cotejo: movimientos correctos, pedidos justificados y valoración.",
    ["ERP", "Existencias", "Compras"])

add("CSAF", "GTH", "Nómina de un trabajador de hostelería en Nominasol", "sim",
    "Puestos informáticos + Nominasol", "guia-puestos-pc",
    "Confeccionar la nómina mensual de un trabajador de un hotel del norte de Tenerife aplicando el convenio provincial facilitado por el docente.",
    ["Nominasol en los puestos", "Extracto del convenio colectivo aplicable", "Datos del trabajador y del mes (horas, pluses)"],
    "Crear la empresa y el trabajador en Nominasol y entregar el extracto del convenio.",
    ["(10 min) Lectura del convenio: salario base y complementos.",
     "(25 min) Alta de conceptos y cálculo de la nómina.",
     "(15 min) Comprobación manual de las bases de cotización.",
     "(5 min) Exportación del recibo."],
    "Recibo de salarios en PDF + hoja de comprobación.",
    "Lista de cotejo: devengos, bases, deducciones y líquido.",
    ["Nóminas", "Nominasol", "Convenio"], difficulty="Intermedio")

add("CSAF", "GTH", "Acogida de nuevos empleados con formación en PRL en realidad virtual", "vr",
    "Gafas Meta Quest 3/3S + simulador de PRL de Bakata", "guia-vr",
    "Diseñar el plan de acogida de una nueva incorporación incluyendo formación básica en prevención de riesgos con el simulador de PRL del aula.",
    ["6 gafas Meta Quest cargadas", "Simulador de PRL instalado (contenido a revisar por el docente)", "Plantilla de plan de acogida"],
    "Revisar con antelación el contenido del simulador y cargar las gafas.",
    ["(10 min) Normas de seguridad VR.",
     "(20 min) Experiencia en el simulador por turnos (el resto trabaja el plan de acogida).",
     "(20 min) Elaboración del plan de acogida incluyendo la formación PRL.",
     "(5 min) Puesta en común."],
    "Plan de acogida con calendario y registro de la formación PRL.",
    "Rúbrica: contenido del plan, integración de la PRL y viabilidad.",
    ["PRL", "Realidad virtual", "Acogida"])

add("CSAF", "SML", "Spot publicitario de la empresa simulada", "av",
    "Croma + Canon EOS R50 + micrófonos + PC de edición", "guia-audiovisual",
    "Producir un anuncio de 30 segundos de la empresa simulada para redes sociales o una feria de empresas simuladas.",
    ["Croma e iluminación", "Cámara y micrófono", "Guion gráfico (storyboard)"],
    "El storyboard se prepara en una sesión anterior.",
    ["(25 min) Grabación en el croma.",
     "(20 min) Edición con fondos y rótulos.",
     "(10 min) Visionado conjunto."],
    "Spot de 30 s en MP4.",
    "Rúbrica: mensaje, coherencia con la imagen de marca, calidad técnica.",
    ["Marketing", "Empresa simulada", "Vídeo"])

add("CSAF", "SML", "Comité de dirección semanal con indicadores", "sim",
    "Pantalla interactiva + puestos informáticos", "guia-pantalla",
    "Celebrar una reunión de dirección de la empresa simulada con orden del día, indicadores de cada departamento y acta de acuerdos.",
    ["Pantalla interactiva", "Plantilla de cuadro de mando (hoja de cálculo)", "Plantilla de acta"],
    "Cada departamento prepara 3 indicadores antes de la sesión.",
    ["(10 min) Actualización del cuadro de mando.",
     "(30 min) Reunión: cada departamento expone en la pantalla.",
     "(15 min) Redacción del acta y reparto de tareas."],
    "Cuadro de mando + acta de la reunión.",
    "Lista de cotejo: indicadores, gestión del tiempo, acta completa.",
    ["Simulación empresarial", "Reuniones", "Indicadores"])

add("CSAF", "SOJ", "Huella de carbono y residuos de la oficina", "sim",
    "Puestos informáticos + hoja de cálculo + pantalla interactiva", "guia-puestos-pc",
    "Estimar el consumo energético y los residuos de una oficina tipo y proponer medidas de mejora con su coste y ahorro.",
    ["Facturas de electricidad ficticias", "Inventario de equipos de la oficina", "Calculadora oficial de huella de carbono (MITECO)"],
    "Preparar los datos de consumo y el inventario.",
    ["(20 min) Cálculo de consumos y huella aproximada.",
     "(20 min) Propuesta de 3 medidas con coste y ahorro.",
     "(15 min) Exposición en la pantalla."],
    "Informe breve con cálculo y plan de mejora.",
    "Rúbrica: cálculo, viabilidad de las medidas y exposición.",
    ["Sostenibilidad", "Huella de carbono", "ODS"])

add("CSAF", "YFI", "Ensayo grabado de la defensa del proyecto", "av",
    "Cámara PTZ + micrófonos + pantalla interactiva", "guia-audiovisual",
    "Ensayar la defensa del Proyecto de Administración y Finanzas ante un tribunal simulado y mejorarla a partir del vídeo.",
    ["Presentación del proyecto", "Cámara PTZ y micrófono", "Rúbrica del tribunal"],
    "Cada alumno trae su presentación; se fija el orden de intervención.",
    ["(40 min) Defensas de 8 minutos grabadas con preguntas.",
     "(15 min) Feedback con la rúbrica."],
    "Vídeo del ensayo + plan de mejora personal.",
    "Rúbrica del tribunal (contenido, estructura, comunicación y respuesta a preguntas).",
    ["Proyecto", "Presentaciones", "Oratoria"], difficulty="Avanzado")

add("CSAF", "IPW", "Entrevista de trabajo por videoconferencia", "av",
    "Puesto con webcam o cámara PTZ + micrófonos", "guia-audiovisual",
    "Preparar y realizar una entrevista de trabajo en línea cuidando imagen, encuadre, sonido y respuestas.",
    ["Puesto con videoconferencia", "Oferta de empleo real", "Ficha de observación"],
    "Preparar el puesto y una sala virtual de prueba.",
    ["(10 min) Comprobación técnica: luz, encuadre, sonido.",
     "(30 min) Entrevistas de 6 minutos.",
     "(15 min) Revisión y coevaluación."],
    "Grabación de la entrevista + lista de mejoras.",
    "Ficha de observación (preparación técnica, respuestas, imagen).",
    ["Empleabilidad", "Entrevista online"])

add("CSAF", "OGV", "Plano en 3D y cartelería de un evento empresarial", "3d",
    "Impresora 3D + PC de diseño + pantalla interactiva", "guia-impresora3d",
    "Planificar la distribución de un evento empresarial (jornada, presentación de producto) con una maqueta del espacio y su señalética.",
    ["Piezas impresas a escala (mesas, escenario, stands)", "Plano del espacio", "Briefing del evento"],
    "Imprimir el kit de piezas con antelación.",
    ["(10 min) Análisis del briefing.",
     "(25 min) Distribución del espacio con la maqueta y diseño de la señalética.",
     "(15 min) Presentación en la pantalla.",
     "(5 min) Votación de la mejor propuesta."],
    "Fotografía de la maqueta + plan de señalética.",
    "Rúbrica: flujos, accesibilidad, coherencia con el briefing.",
    ["Eventos", "Impresión 3D", "Protocolo"], note=PRINT_NOTE)

# ======================= 1º CSCI =======================
add("CSCI", "GII", "Enviar plátanos de Tenerife a Península: la documentación", "sim",
    "Puestos informáticos + pantalla interactiva", "guia-puestos-pc",
    "Identificar y cumplimentar la documentación de un envío de mercancía desde Canarias a la Península, considerando la particularidad fiscal y aduanera de Canarias.",
    ["Caso de envío (cooperativa platanera)", "Modelos de factura comercial, packing list y DUA (formularios de práctica)", "Información oficial de la AEAT/ATC"],
    "Preparar el caso y los formularios en PDF editable.",
    ["(10 min) ¿Por qué un envío Canarias–Península necesita documentación aduanera?",
     "(25 min) Cumplimentación de factura comercial y packing list.",
     "(15 min) Casillas principales del DUA de expedición.",
     "(5 min) Corrección en la pantalla."],
    "Expediente documental del envío.",
    "Lista de cotejo: coherencia documental y datos esenciales.",
    ["DUA", "Aduanas", "Canarias", "Documentación"], difficulty="Intermedio")

add("CSCI", "GII", "Elegir el Incoterm adecuado: juego de negociación", "sim",
    "Pantalla interactiva ViewBoard", "guia-pantalla",
    "Aplicar los Incoterms 2020 en operaciones reales de exportación e importación de empresas canarias, repartiendo costes y riesgos.",
    ["Tarjetas de operaciones", "Esquema de Incoterms en la pizarra digital"],
    "Preparar la plantilla de Incoterms en la pantalla.",
    ["(10 min) Repaso visual de los Incoterms.",
     "(30 min) Negociaciones por parejas (comprador/vendedor) y registro del acuerdo.",
     "(15 min) Corrección en la pantalla: quién paga qué y dónde se transmite el riesgo."],
    "Hoja de acuerdos con el Incoterm justificado.",
    "Lista de cotejo: elección correcta y justificación.",
    ["Incoterms", "Negociación", "Comercio internacional"])

add("CSCI", "TRO", "Ruta de un contenedor de Tenerife a Rotterdam", "sim",
    "Pantalla interactiva + puestos informáticos", "guia-pantalla",
    "Planificar una ruta marítima de contenedor desde el puerto de Santa Cruz de Tenerife, comparando opciones y documentos de transporte.",
    ["Mapa interactivo en la pantalla", "Webs de navieras y de Puertos de Tenerife", "Modelo de conocimiento de embarque (B/L)"],
    "Preparar el caso (mercancía, plazo, presupuesto).",
    ["(15 min) Búsqueda de líneas regulares y tiempos de tránsito.",
     "(20 min) Elección de la ruta y del tipo de contenedor.",
     "(15 min) Cumplimentación del B/L de práctica.",
     "(5 min) Exposición en el mapa."],
    "Plan de ruta + B/L de práctica.",
    "Rúbrica: viabilidad de la ruta, documentación y justificación.",
    ["Transporte marítimo", "Contenedor", "B/L"])

add("CSCI", "TRO", "Cubicaje de un contenedor con palés impresos en 3D", "3d",
    "Impresora 3D Bambu Lab X1 Carbon", "guia-impresora3d",
    "Calcular y comprobar físicamente la carga de un contenedor con palés y cajas a escala, optimizando espacio y peso.",
    ["Contenedor y palés impresos a escala", "Ficha de dimensiones reales", "Calculadora u hoja de cálculo"],
    "Imprimir el kit de cubicaje con antelación.",
    ["(15 min) Cálculo teórico de palés por contenedor.",
     "(20 min) Comprobación con la maqueta.",
     "(15 min) Ajuste por peso y estiba.",
     "(5 min) Conclusiones."],
    "Plan de carga con cálculo y fotografía.",
    "Lista de cotejo: cálculo, aprovechamiento y criterios de estiba.",
    ["Cubicaje", "Contenedor", "Impresión 3D"], note=PRINT_NOTE)

add("CSCI", "LOD", "Diseño del almacén de un operador logístico con maqueta 3D", "3d",
    "Impresora 3D + pantalla interactiva", "guia-impresora3d",
    "Distribuir las zonas de un almacén de un operador logístico en el polígono, aplicando criterios de flujo y rotación.",
    ["Kit de piezas impresas a escala", "Plano base A3", "Datos de productos"],
    "Imprimir el kit con antelación.",
    ["(10 min) Análisis de productos y rotación.",
     "(25 min) Distribución con la maqueta.",
     "(15 min) Presentación.",
     "(5 min) Comparación."],
    "Plano/fotografía de la distribución con justificación.",
    "Rúbrica: flujos, rotación y seguridad.",
    ["Almacén", "Layout", "Impresión 3D"], note=PRINT_NOTE)

add("CSCI", "LOD", "Seguridad en el almacén con realidad virtual", "vr",
    "Gafas Meta Quest 3/3S + simulador de PRL de Bakata", "guia-vr",
    "Identificar riesgos laborales en un almacén y proponer medidas preventivas a partir de la experiencia en el simulador de PRL.",
    ["Gafas Meta Quest cargadas", "Simulador de PRL (contenido a revisar por el docente)", "Ficha de identificación de riesgos"],
    "Revisar el contenido del simulador y cargar las gafas.",
    ["(10 min) Normas de seguridad VR.",
     "(25 min) Simulador por turnos; el resto completa la ficha de riesgos.",
     "(20 min) Propuesta de medidas preventivas."],
    "Ficha de riesgos y medidas.",
    "Lista de cotejo: riesgos identificados y medidas adecuadas.",
    ["PRL", "Almacén", "Realidad virtual"])

add("CSCI", "GEL", "Escandallo de costes de un transporte por carretera y barco", "sim",
    "Puestos informáticos + hoja de cálculo", "guia-puestos-pc",
    "Calcular el coste de un servicio de transporte combinado (camión + naviera) y fijar un precio con margen.",
    ["Datos de costes ficticios (combustible, peajes, flete, seguro)", "Plantilla de escandallo"],
    "Preparar los datos del caso.",
    ["(20 min) Cálculo de costes fijos y variables.",
     "(20 min) Precio de venta con margen.",
     "(15 min) Comparación entre equipos."],
    "Escandallo de costes y oferta de precio.",
    "Lista de cotejo: costes completos y cálculo del precio.",
    ["Costes", "Transporte", "Hoja de cálculo"])

add("CSCI", "GEL", "Presentar el presupuesto de transporte al cliente", "av",
    "Pantalla interactiva + cámara PTZ", "guia-pantalla",
    "Presentar y negociar un presupuesto de transporte con un cliente, justificando costes y condiciones.",
    ["Presupuestos elaborados previamente", "Pantalla interactiva"],
    "Usar los escandallos de la actividad anterior.",
    ["(35 min) Presentaciones de 5 minutos con negociación.",
     "(20 min) Feedback."],
    "Presupuesto final negociado.",
    "Rúbrica: argumentación, condiciones y comunicación.",
    ["Presupuestos", "Negociación"])

add("CSCI", "DJK", "Catálogo digital de producto canario para exportar", "3d",
    "Escáner 3D Revopoint + PC", "guia-escaner-laser",
    "Digitalizar un producto canario y elaborar su ficha digital para un catálogo de exportación.",
    ["Escáner 3D", "Producto mate de tamaño medio", "Plantilla de ficha bilingüe"],
    "Hacer un escaneo de prueba.",
    ["(10 min) Demostración.",
     "(25 min) Escaneo por turnos.",
     "(20 min) Ficha digital bilingüe."],
    "Ficha de catálogo digital con modelo 3D.",
    "Lista de cotejo: escaneo, ficha y traducción.",
    ["Digitalización", "Exportación", "Escáner 3D"])

add("CSCI", "IKL", "Negotiating an order with a foreign supplier", "av",
    "Cámara PTZ + micrófonos", "guia-audiovisual",
    "Negociar en inglés un pedido con un proveedor extranjero (precio, plazo, Incoterm, pago).",
    ["Tarjetas de rol", "Glosario de negociación"],
    "Preparar las tarjetas de rol.",
    ["(10 min) Expresiones clave.",
     "(30 min) Negociaciones grabadas.",
     "(15 min) Visionado y corrección."],
    "Negociación grabada + resumen del acuerdo por escrito.",
    "Rúbrica: fluidez, corrección y acuerdo alcanzado.",
    ["Inglés", "Negociación", "Comercio internacional"])

acts = [a for a in acts if a]
out = os.path.join(os.path.dirname(__file__), "..", "src", "data", "activities.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(acts, f, ensure_ascii=False, indent=2)
print(len(acts), "actividades escritas")
