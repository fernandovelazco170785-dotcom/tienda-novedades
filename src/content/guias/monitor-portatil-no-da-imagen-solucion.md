---
titulo: "Monitor portátil no da imagen: causas y solución paso a paso"
descripcion: ¿Tu monitor portátil dice "sin señal" o se queda negro? Revisa puerto USB-C, cable, energía, entrada y Windows para que vuelva a dar imagen.
busqueda: monitor portátil no da imagen
categoria: monitores
productos:
  - id: monitor-portatil-aoc-16t20
    motivo: Pantalla de 15,6 pulgadas Full HD con panel IPS que recibe imagen y energía por un solo cable USB-C. Es la opción más simple si ya confirmaste que tu laptop tiene USB-C con salida de video.
  - id: monitor-portatil-asus-zenscreen-mb16ahv
    motivo: Pantalla de 15,6 pulgadas Full HD con panel IPS, USB-C y entrada HDMI, con funda y soporte plegable. La entrada HDMI te da un plan B si el USB-C de tu laptop no saca video, y sirve con consolas.
faq:
  - pregunta: ¿Por qué mi monitor portátil dice "sin señal" si está encendido?
    respuesta: Porque le llega energía, pero no video. Lo más común es que el puerto USB-C de la laptop no tenga salida de video, que el cable solo sirva para cargar o que el monitor esté en la entrada equivocada. Prueba otro puerto y el cable original, y revisa la fuente en el menú.
  - pregunta: ¿Cómo sé si el USB-C de mi laptop tiene salida de video?
    respuesta: Busca junto al puerto el logo de DisplayPort o el rayo de Thunderbolt. Si no hay logo, revisa la ficha técnica de tu modelo exacto y busca DP Alt Mode, DisplayPort over USB-C o Thunderbolt. Si ninguno de tus puertos lo tiene, conecta el monitor por HDMI.
  - pregunta: ¿Por qué el monitor portátil parpadea o se apaga solo?
    respuesta: "Casi siempre es falta de energía: la laptop no entrega suficiente por el USB-C, sobre todo con el brillo alto o con la batería baja. Baja el brillo para comprobarlo y, si mejora, alimenta el monitor con un cargador o conecta la laptop al suyo."
  - pregunta: ¿Funciona un monitor portátil conectado a un hub USB-C?
    respuesta: "Depende del hub. Muchos no pasan la señal de video del puerto o solo manejan una pantalla. Si tienes problemas, conecta el monitor directo a la laptop: si así funciona, el hub es la causa y necesitas uno que indique soporte de video."
  - pregunta: ¿Qué hago si el monitor no funciona con ningún equipo ni cable?
    respuesta: Si lo probaste con otra laptop, con el cable original, con alimentación por cargador y eligiendo la entrada correcta en el menú, y aun así no muestra nada, es probable que el monitor tenga una falla. En ese caso, contacta al vendedor o usa la garantía del fabricante.
publicada: "2026-11-27"
---

Conectaste el monitor portátil, la laptop hace el sonido de dispositivo nuevo y la pantalla sigue negra o muestra "sin señal". Es una de las consultas más repetidas con estos monitores, y casi nunca es un monitor defectuoso: en la mayoría de los casos falla el puerto, el cable, la energía o la configuración.

Aquí tienes las causas en orden, de la más frecuente a la menos frecuente, y al final qué revisar si vas a comprar un monitor nuevo.

## Por qué un monitor portátil se queda sin imagen

Para mostrar imagen, un monitor portátil necesita tres cosas al mismo tiempo:

1. **Energía suficiente** para encender el panel.
2. **Una señal de video** que llegue por el puerto y el cable correctos.
3. **Que el sistema operativo lo reconozca** y le envíe algo que mostrar.

Si falta cualquiera de las tres, ves la pantalla negra. La clave es saber cuál falta. Una pista rápida: si el monitor muestra su menú o un mensaje de "sin señal", la energía llega y el problema está en el video o en la configuración. Si no muestra nada, ni siquiera el menú, empieza por la energía.

## Solución paso a paso

### 1. Confirma que el monitor enciende

Presiona el botón de encendido o el de menú. Si aparece el menú en pantalla, el monitor funciona. Si no aparece nada:

- **Si conectas por USB-C**, la laptop tiene que entregarle energía. Algunas laptops no dan suficiente por ese puerto, sobre todo con la batería baja o en modo de ahorro.
- **Si conectas por HDMI**, recuerda que el HDMI no lleva energía. El monitor necesita alimentarse aparte por su puerto USB-C, con un cargador o una batería externa.

Prueba conectando el monitor a un cargador de pared. Si así enciende, el problema era la energía.

### 2. Revisa que el puerto USB-C de tu laptop tenga salida de video

Es la causa más común. Que el conector sea USB-C no garantiza que saque imagen: el puerto tiene que admitir **DisplayPort por USB-C (DP Alt Mode)** o ser **Thunderbolt**. Busca el logo de DisplayPort o el rayo de Thunderbolt junto al puerto, o revisa la ficha técnica de tu modelo exacto.

Si tu laptop tiene varios USB-C, prueba en todos: es frecuente que solo uno tenga video. Si ninguno lo tiene, la salida es conectar por **HDMI** y alimentar el monitor aparte.

### 3. Cambia el cable

Muchos cables USB-C, en especial los que vienen con celulares, solo llevan carga y datos lentos, no video. Usa el cable que trae el monitor. Si ya lo usas y sigue sin imagen, prueba con otro cable USB-C que admita video para descartar que esté dañado. Si la imagen aparece y desaparece al mover el cable, ya encontraste al culpable.

### 4. Elige la entrada correcta en el menú

Algunos monitores detectan solos la entrada activa y otros no. Si tu monitor tiene USB-C y HDMI, entra al menú y busca la opción de fuente o entrada (suele llamarse *Input* o *Source*). Selecciona la que estás usando.

### 5. Configura la pantalla en Windows o macOS

A veces el monitor recibe señal, pero el sistema no lo usa:

- **En Windows**, presiona la tecla de Windows más la P y elige *Extender* o *Duplicar*. Si no aparece, entra a Configuración, Sistema, Pantalla y usa la opción para detectar pantallas.
- **En macOS**, abre Ajustes del Sistema, Pantallas, y revisa si el monitor aparece en la lista.

Si estaba en modo *Solo pantalla de la PC*, el monitor queda conectado pero sin imagen.

### 6. Actualiza los controladores de video

Un controlador de gráficos antiguo puede impedir que la laptop detecte pantallas por USB-C. Actualízalo desde Windows Update o desde la página del fabricante de tu laptop o de tu tarjeta gráfica. Si tu monitor funciona con **DisplayLink** (una tecnología que permite usar puertos sin video), necesita su propio controlador instalado; sin él no muestra nada.

### 7. Quita adaptadores y hubs del camino

Los hubs y adaptadores USB-C son otra fuente de problemas: muchos no pasan la señal de video del puerto o solo admiten una pantalla. Conecta el monitor directo a la laptop. Si así funciona, el hub era el problema.

### 8. Si parpadea o se apaga solo

Cuando la imagen aparece y se va, sobre todo al subir el brillo o el volumen de los parlantes, casi siempre es falta de energía. Baja el brillo para comprobarlo y, si mejora, alimenta el monitor con un cargador.

### 9. Consolas y celulares

Si conectas una consola, usa el HDMI y alimenta el monitor aparte. Algunas consolas solo sacan video desde su base, así que conecta el cable HDMI de la base, no el de la consola. Con celulares, solo funcionan los modelos que sacan video por USB-C; muchos de gama media y básica no lo hacen, aunque carguen y pasen archivos por ese puerto.

## Criterios de compra

Si después de todas las pruebas el monitor no enciende con ningún equipo ni con ningún cable, puede estar defectuoso y conviene usar la garantía. Si vas a comprar uno nuevo, estos puntos te ahorran el mismo dolor de cabeza.

### Puerto con video en tu equipo, antes que nada

Confirma primero que tu laptop tenga USB-C con DP Alt Mode o Thunderbolt. Si no lo tiene, necesitas un monitor con entrada HDMI. Este punto decide la compra más que el tamaño o la marca.

### Entrada HDMI como plan B

Un monitor con USB-C y HDMI funciona con más equipos: laptops sin video por USB-C, consolas, cámaras o computadoras de escritorio. Si solo tiene USB-C, dependes por completo del puerto de tu laptop.

### Cables incluidos

Revisa qué cables trae la caja. Lo ideal es que incluya un cable USB-C a USB-C con video y, si tiene HDMI, el cable o adaptador para su conector, que muchas veces es reducido (mini o micro HDMI).

### Opción de alimentación externa

Si tu laptop entrega poca energía por USB-C, vas a necesitar enchufar el monitor. Revisa en la ficha cómo se alimenta cuando lo conectas por HDMI y si admite cargador externo mientras recibe video.

### Soporte y protección

Un cable que se tensiona porque la pantalla está mal apoyada termina dañando el conector. Un soporte estable y una funda alargan la vida tanto del monitor como de sus puertos.

## Errores comunes

- **Culpar al monitor antes de revisar el puerto.** Lo primero es confirmar que el USB-C de la laptop tenga salida de video.
- **Usar el cable del cargador del celular.** Encaja igual, pero muchas veces no transmite imagen.
- **Conectar por HDMI sin alimentar el monitor.** Sin energía por USB-C, la pantalla no enciende.
- **Pasar la conexión por un hub barato.** Muchos no llevan video; prueba siempre conectando directo.
- **Olvidar Windows más P.** Si el sistema está en *Solo pantalla de la PC*, el monitor queda en negro.
- **Ignorar el parpadeo.** Que la imagen se apague al subir el brillo es una señal clara de falta de energía, no de una falla del panel.
- **Comprar un monitor pensando en el celular sin revisar el celular.** Solo algunos modelos sacan video por USB-C.

## Los monitores de la selección

Los dos son de 15,6 pulgadas, Full HD y con panel IPS. La diferencia está en con qué equipos los vas a usar:

- El [AOC 16T20](/producto/monitor-portatil-aoc-16t20/) es la opción más simple si tu laptop tiene USB-C con salida de video: un solo cable para imagen y energía, en un cuerpo delgado y liviano. Si tu puerto cumple, es difícil equivocarse.
- El [ASUS ZenScreen MB16AHV](/producto/monitor-portatil-asus-zenscreen-mb16ahv/) suma entrada HDMI, así que te sirve aunque tu laptop no tenga video por USB-C, y también con consolas. Trae funda y soporte plegable, útiles si lo vas a mover a diario.

Si no estás seguro de que tu laptop tenga USB-C con video, el ASUS te da un plan B. Si ya lo confirmaste y solo quieres una segunda pantalla para trabajar, el AOC cumple sin complicaciones.

Si todavía estás eligiendo modelo, revisa la guía sobre [cómo elegir un monitor portátil](/guias/como-elegir-monitor-portatil/) o mira la [categoría de monitores](/categoria/monitores/).
