---
titulo: "Memoria USB no aparece en la PC: causas y solución paso a paso"
descripcion: "Tu memoria USB no aparece o pide formatear: revisa puertos, letra de unidad, controladores y formato paso a paso, sin perder tus archivos."
busqueda: memoria USB no la reconoce mi PC solución
categoria: almacenamiento
productos:
  - id: usb-pny-turbo-attache-3-128gb-pack-5
    motivo: Cinco memorias de 128 GB con USB 3.0 y hasta 100 MB/s de lectura según PNY. Sirven para reemplazar una memoria dañada y tener repuestos para fotos, videos y respaldos.
  - id: usb-pny-attache-3-16gb-pack-10
    motivo: Diez memorias USB 2.0 de 16 GB para documentos, tareas e impresiones. Tener varias evita que una falla te deje sin entregar un trabajo.
faq:
  - pregunta: ¿Puedo recuperar los archivos de una memoria USB que pide formatear?
    respuesta: "Muchas veces sí. No aceptes el formateo: primero prueba la comprobación de errores de Windows desde Propiedades y Herramientas. Si la unidad aparece como RAW, un programa de recuperación de datos puede rescatar los archivos. Cuanto menos uses la memoria antes de intentarlo, mejores son las probabilidades."
  - pregunta: ¿Por qué la memoria aparece en Administración de discos pero no en el Explorador?
    respuesta: Casi siempre es porque la partición no tiene letra de unidad. Haz clic derecho sobre ella, elige "Cambiar la letra y rutas de acceso de unidad", luego Agregar y una letra libre. No se borra nada.
  - pregunta: ¿Cómo sé si la memoria USB está dañada sin remedio?
    respuesta: Si no aparece en ninguna computadora, en ningún puerto, ni siquiera en Administración de discos o en el Administrador de dispositivos, lo más probable es que haya fallado el chip o el controlador interno. En ese caso conviene reemplazarla.
  - pregunta: ¿Qué formato le pongo a la memoria USB después de repararla?
    respuesta: "exFAT es la mejor opción para uso general: funciona en Windows y Mac y acepta archivos de más de 4 GB. Si la vas a usar en un televisor o en el auto y no la lee, prueba con FAT32, que es el más compatible."
  - pregunta: ¿Mi celular puede leer una memoria USB?
    respuesta: Muchos celulares Android pueden leerla con un adaptador OTG de USB-C o micro USB a USB-A. El celular debe ser compatible con OTG y la memoria debe estar en un formato que reconozca, como FAT32 o exFAT.
publicada: "2026-11-27"
---

Conectas la memoria USB, esperas el sonido de Windows y no pasa nada. O suena, pero la unidad no aparece en el Explorador de archivos. O aparece y te pide formatearla, justo cuando tiene el trabajo que entregas mañana. Es una de las fallas más comunes con las memorias USB, y en muchos casos tiene solución sin perder nada.

Esta guía te lleva paso a paso, de lo más simple a lo más técnico, y te ayuda a decidir cuándo vale la pena seguir intentando y cuándo conviene reemplazarla. Las memorias de la selección están en la [categoría de almacenamiento](/categoria/almacenamiento/).

## Por qué la computadora no reconoce una memoria USB

Para que una memoria aparezca en el Explorador tienen que funcionar varias cosas en cadena: el puerto tiene que dar energía y datos, Windows tiene que cargar el controlador del dispositivo, la memoria tiene que tener una partición con un formato que el sistema entienda y, al final, esa partición necesita una **letra de unidad** (E:, F:, etc.). Si falla cualquier eslabón, la memoria "no aparece", aunque la causa sea muy distinta.

Por eso conviene identificar en qué punto se corta la cadena antes de formatear o tirar la memoria:

- **No pasa nada al conectarla:** problema de puerto, de conexión o de la memoria en sí.
- **Windows avisa "Dispositivo USB no reconocido":** suele ser el controlador o un fallo eléctrico.
- **Se detecta, pero no aparece en el Explorador:** casi siempre falta la letra de unidad.
- **Aparece y pide formatear:** el sistema de archivos está dañado o Windows no lo puede leer.

## Solución paso a paso

### 1. Descarta lo obvio: puerto, hub y otra computadora

Saca la memoria y conéctala bien, hasta el fondo. Prueba otro puerto; en una computadora de escritorio, mejor uno trasero, que va directo a la tarjeta madre, en vez de los del frente. Si usas un hub o un adaptador, quítalo y conecta la memoria directo. Luego pruébala en otra computadora: si tampoco funciona en ningún equipo, el problema es la memoria y no tu PC.

### 2. Reinicia la computadora

Suena a consejo de soporte técnico, pero un reinicio completo recarga los controladores USB. Si es un problema temporal de Windows, se resuelve aquí.

### 3. Revisa Administración de discos

Presiona **Windows + R**, escribe **diskmgmt.msc** y pulsa Enter. Busca un disco con la capacidad de tu memoria (una de 16 GB aparecerá con algo menos de 15 GB). Lo que veas define el paso siguiente:

- **Aparece con partición pero sin letra:** haz clic derecho sobre la partición, elige **"Cambiar la letra y rutas de acceso de unidad"**, luego **Agregar** y una letra libre. Es la solución más rápida y no borra nada.
- **Aparece como "No asignado":** la memoria no tiene partición. Puedes crear un volumen nuevo, pero eso implica formatear.
- **Aparece como RAW:** Windows no reconoce el sistema de archivos. Ve al paso 5.
- **No aparece:** sigue con el paso 4.

### 4. Reinstala el controlador en el Administrador de dispositivos

Haz clic derecho en el botón Inicio y abre el **Administrador de dispositivos**. Revisa la sección **Unidades de disco** y **Controladoras de bus serie universal**. Si ves tu memoria o un "Dispositivo USB desconocido" con un signo de advertencia, haz clic derecho, elige **Desinstalar el dispositivo**, desconecta la memoria y vuelve a conectarla. Windows reinstalará el controlador solo.

### 5. Si pide formatear, no aceptes todavía

El mensaje "Hay que formatear el disco antes de usarlo" significa que la estructura de archivos se dañó, muchas veces por sacar la memoria sin expulsarla. Si tiene archivos importantes, cancela. Primero prueba la herramienta de comprobación de errores: en el Explorador, clic derecho sobre la unidad, **Propiedades**, pestaña **Herramientas** y **Comprobar**. Si la unidad aparece como RAW, esa herramienta puede no funcionar; ahí la alternativa es un programa de recuperación de datos, que intenta rescatar los archivos antes de formatear.

Cuando ya tengas lo importante a salvo (o no te importe perderlo), formatea en **exFAT**, que funciona en Windows y Mac y acepta archivos grandes.

### 6. En Mac o en el televisor

En una Mac, abre **Utilidad de Discos**: si la memoria aparece ahí pero no en el escritorio, pulsa **Montar**. Si no aparece ni ahí, prueba otro puerto o adaptador. En televisores y equipos de música del auto, el problema suele ser el formato: muchos no leen NTFS. Una memoria en FAT32 o exFAT suele funcionar mejor.

## Criterios de compra

Si después de todo esto la memoria no responde en ninguna computadora, lo más probable es que el chip o el controlador interno hayan fallado. Una memoria USB es barata comparada con el tiempo que pierdes peleando con una dañada. Al reemplazarla, revisa esto:

### Marca y vendedor confiables

Muchas memorias que "dejan de funcionar" son falsas: anuncian más capacidad de la real y corrompen los datos cuando se llenan. Compra marcas conocidas a vendedores con buena reputación y desconfía de capacidades enormes a precios demasiado bajos.

### Diseño sin tapa

Un conector sucio o doblado es una causa frecuente de fallas de conexión. Los diseños con **collar deslizante** o conector retráctil protegen la punta sin una tapa que se pierde a la semana.

### Velocidad según el uso

Para documentos y tareas, una memoria USB 2.0 alcanza. Si mueves fotos, videos o respaldos, una USB 3.0 te ahorra mucho tiempo de copia, siempre que la conectes a un puerto 3.0.

### Tener más de una

Si la memoria es tu herramienta de trabajo o de estudio, tener una de repuesto evita que una falla te deje sin entregar algo. Los packs sirven justamente para eso, y también para separar usos: una para el trabajo, otra para respaldos, otra para imprimir.

## Errores comunes

- **Aceptar el formateo a la primera.** Formatear borra el contenido. Si hay archivos importantes, intenta recuperarlos antes.
- **Sacar la memoria sin expulsarla.** Retirarla mientras se copia algo es la forma más común de dañar el sistema de archivos.
- **Culpar a la memoria sin probar otro puerto.** Puertos frontales flojos, hubs y adaptadores causan muchas de estas fallas.
- **Usar la memoria como único respaldo.** Si lo importante solo existe en una memoria, una falla te deja sin nada. Guarda siempre una segunda copia en otro lugar.
- **Insistir con una memoria que falla seguido.** Si se desconecta sola o pide formatear cada pocas semanas, está avisando que va a morir. Pasa los archivos a otra y reemplázala.
- **Formatear en NTFS para el televisor o el auto.** Muchos de esos equipos solo leen FAT32 o exFAT.
- **Conectarla en computadoras públicas sin cuidado.** En cibercafés e imprentas, una memoria puede llevarse un virus que oculta los archivos. Analízala con el antivirus antes de abrirla en tu equipo.

## Las memorias de la selección

Ambas son de PNY y usan el mismo diseño con collar deslizante, que protege el conector sin tapa. La elección depende de qué guardas en ellas:

- El pack de cinco **[PNY Turbo Attaché 3 de 128 GB con USB 3.0](/producto/usb-pny-turbo-attache-3-128gb-pack-5/)** es para quien mueve fotos, videos o respaldos. PNY indica hasta 100 MB/s de lectura, y con cinco unidades puedes tener una para cada uso y repuestos si una falla.
- El pack de diez **[PNY Attaché 3 de 16 GB con USB 2.0](/producto/usb-pny-attache-3-16gb-pack-10/)** es para documentos, tareas e impresiones. Es la opción práctica para oficinas, salones de clase o para llevar a la imprenta una memoria que no te importe prestar.

Si tu memoria anterior murió con archivos pesados adentro, el pack de 128 GB te da espacio y velocidad. Si lo que necesitas es tener memorias de sobra para cosas livianas, el de 16 GB te da más unidades.

Si vas a reemplazar la memoria, revisa también cómo [saber si una memoria USB es falsa](/guias/como-saber-si-una-memoria-usb-es-falsa/) antes de comprar, para no volver a pasar por esto.
