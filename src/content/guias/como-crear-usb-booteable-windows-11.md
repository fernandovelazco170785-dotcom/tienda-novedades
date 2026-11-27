---
titulo: Cómo crear una USB booteable de Windows 11 y qué memoria usar
descripcion: Paso a paso para crear una USB booteable de Windows 11 con la herramienta de Microsoft o Rufus, qué capacidad necesitas y cómo arrancar desde ella.
busqueda: cómo crear una USB booteable de Windows 11
categoria: almacenamiento
productos:
  - id: usb-pny-turbo-attache-3-128gb-pack-5
    motivo: "Memorias USB 3.0 con hasta 100 MB/s de lectura según PNY: el instalador se crea y carga más rápido. Ideal si reinstalas computadoras seguido y quieres que el resto del pack sirva para respaldos."
  - id: usb-pny-attache-3-16gb-pack-10
    motivo: "16 GB es la capacidad recomendada para el instalador de Windows, y con diez unidades puedes dejar una solo para Windows y otra para controladores. Es USB 2.0: tarda más, pero funciona igual."
faq:
  - pregunta: ¿Cuántos GB necesita una memoria USB para instalar Windows 11?
    respuesta: Microsoft pide al menos 8 GB. Es recomendable usar una de 16 GB o más para tener margen, porque el instalador crece con las actualizaciones. Más capacidad no acelera la instalación.
  - pregunta: ¿Puedo seguir guardando archivos en la memoria booteable?
    respuesta: "Técnicamente puedes copiar archivos en el espacio libre, pero no es buena idea: si vuelves a preparar la memoria con una versión nueva de Windows, se borra todo. Lo más práctico es tener una memoria dedicada solo al instalador."
  - pregunta: ¿Se puede crear la USB booteable desde una Mac?
    respuesta: La herramienta de creación de medios de Microsoft funciona en Windows, y Rufus también. Si solo tienes una Mac, lo más sencillo es pedir prestada una computadora con Windows para preparar la memoria.
  - pregunta: ¿Por qué mi computadora no arranca desde la memoria USB?
    respuesta: Las causas más comunes son elegir un esquema de particiones que no coincide con el modo de arranque (GPT para UEFI, MBR para BIOS antigua), no seleccionar la memoria en el menú de arranque o usar un puerto con mala conexión. Revisa esos tres puntos y prueba un puerto trasero.
  - pregunta: ¿Una memoria USB 2.0 sirve para instalar Windows?
    respuesta: Sí. Funciona igual que una 3.0; la diferencia es que tarda más en crear el instalador y en cargar los archivos durante la instalación. Si reinstalas seguido, una USB 3.0 en un puerto 3.0 te ahorra tiempo.
publicada: "2026-11-27"
---

Tarde o temprano toca reinstalar Windows: la computadora quedó lenta, cambiaste el disco, armaste una PC nueva o un virus hizo de las suyas. Para eso necesitas una memoria USB booteable, es decir, una memoria preparada para que la computadora arranque desde ella y no desde el disco.

Hacerla es gratis y toma poco tiempo, pero hay detalles que hacen que muchas personas terminen con una memoria que la computadora "no ve" al encender. Esta guía explica qué necesitas, cómo hacerla con las dos herramientas más usadas y qué memoria conviene usar.

## Qué es una USB booteable y por qué no basta con copiar los archivos

Cuando enciendes la computadora, el firmware (la BIOS o UEFI) busca un dispositivo desde el cual arrancar. Una memoria USB común solo tiene archivos; una booteable tiene además la estructura que el firmware reconoce para iniciar el instalador de Windows.

Por eso no sirve descargar Windows y copiar los archivos a la memoria como si fueran fotos. Hay que usar una herramienta que prepare la memoria. Las dos más comunes son:

- **Herramienta de creación de medios (Media Creation Tool):** la aplicación oficial y gratuita de Microsoft. Descarga Windows 11 y lo instala en la memoria en un solo proceso. Necesita conexión a internet y funciona desde una computadora con Windows.
- **Rufus:** un programa gratuito muy popular que graba en la memoria una imagen ISO de Windows que ya hayas descargado. Te deja elegir opciones como el esquema de particiones, útil si la computadora donde vas a instalar es antigua.

Para la mayoría de las personas, la herramienta de Microsoft es el camino más simple. Rufus conviene si ya tienes el ISO o necesitas ajustar opciones.

## Paso a paso con la herramienta de Microsoft

1. **Respalda la memoria.** El proceso borra todo lo que tenga. Copia antes lo que te importe.
2. **Descarga la herramienta.** Búscala en la página oficial de descargas de Windows 11 de Microsoft, en la sección para crear medios de instalación.
3. **Ejecútala** y acepta los términos. Elige idioma y edición; normalmente puedes dejar las opciones recomendadas.
4. **Elige "Unidad flash USB"** como medio y selecciona tu memoria en la lista. Si no aparece, usa la opción para actualizar la lista de unidades.
5. **Espera.** La herramienta descarga Windows y lo graba en la memoria. Con una conexión lenta o una memoria USB 2.0, esto puede tardar bastante.
6. Cuando termine, **expulsa la memoria** antes de sacarla.

## Paso a paso con Rufus

1. Descarga el ISO de Windows 11 desde la página oficial de Microsoft.
2. Abre Rufus, selecciona tu memoria en "Dispositivo" y el ISO con el botón "Seleccionar".
3. Para una computadora moderna, elige el esquema de particiones **GPT** y el sistema de destino **UEFI (no CSM)**. Para una computadora antigua con BIOS tradicional, la opción es **MBR**.
4. Deja el sistema de archivos y el tamaño de clúster como vienen, salvo que tengas una razón concreta para cambiarlos.
5. Presiona "Empezar", revisa las opciones que te ofrece Rufus y confirma que se borrará la memoria.

## Criterios de compra

Si vas a comprar una memoria para esto, no necesitas nada sofisticado, pero sí revisar algunos puntos.

### Capacidad: 8 GB es el mínimo, 16 GB es lo cómodo

Microsoft pide una memoria de al menos 8 GB. En la práctica, conviene usar una de 16 GB o más: las versiones de Windows crecen con cada actualización y así te queda margen. Más capacidad no hace que el instalador funcione mejor, así que no hace falta una memoria enorme solo para esto.

### Velocidad: USB 3.0 ahorra tiempo, no es obligatoria

Una memoria USB 2.0 sirve perfectamente para instalar Windows; simplemente tarda más en crearse y en cargar el instalador. Si reinstalas seguido o preparas varias computadoras, una memoria USB 3.0 conectada a un puerto 3.0 te ahorra minutos en cada paso. Si quieres entender bien la diferencia, revisa la guía [memoria USB 2.0 o 3.0: cuál comprar](/guias/memoria-usb-2-0-o-3-0-cual-comprar/).

### Una memoria dedicada

Lo ideal es tener una memoria solo para el instalador. Si la usas también para llevar archivos, cada vez que la vuelvas a preparar vas a perder lo que tenga, y es fácil olvidarlo. Los packs de varias memorias resuelven esto: una para Windows, otra con controladores y programas, otra para respaldos.

### Marca conocida y vendedor confiable

Una memoria falsificada o defectuosa puede grabar el instalador con errores y hacer que la instalación falle a la mitad, con la computadora ya formateada. Para algo tan delicado, vale la pena una marca conocida.

### Formato del conector

Casi todas las computadoras de escritorio y muchas laptops tienen puertos USB-A. Si tu laptop solo tiene USB-C, vas a necesitar un adaptador o una memoria con conector USB-C. Revisa los puertos antes de comprar.

## Cómo arrancar desde la memoria

Con la memoria lista, conéctala a la computadora donde vas a instalar y enciéndela. Tienes dos caminos:

- **Menú de arranque:** al encender, presiona la tecla que abre el menú de arranque. Depende del fabricante; suele ser una tecla como F12, F11, F8 o Esc, y muchas veces aparece indicada en la pantalla de inicio o en el manual. Elige la memoria USB en la lista.
- **BIOS o UEFI:** entra a la configuración del firmware y pon la memoria USB primero en el orden de arranque.

Si la computadora no detecta la memoria, revisa que el modo de arranque coincida con cómo la preparaste: una memoria hecha con GPT para UEFI no arrancará en una computadora configurada solo en modo heredado (Legacy), y al revés.

## Errores comunes

- **No respaldar antes.** Tanto la herramienta de Microsoft como Rufus borran la memoria completa. Y si vas a formatear el disco de la computadora, respalda también esos archivos.
- **Copiar el ISO a la memoria como un archivo más.** La memoria no queda booteable. Usa una herramienta que la prepare.
- **Usar una memoria de menos de 8 GB.** La herramienta de Microsoft no la acepta.
- **Elegir mal GPT o MBR en Rufus.** Las computadoras modernas usan GPT con UEFI; las antiguas, MBR. Si te equivocas, la memoria no aparece al arrancar.
- **Sacar la memoria sin expulsarla.** Si se interrumpe la escritura, el instalador puede quedar corrupto y fallar a la mitad.
- **Conectarla a un hub o puerto frontal flojo.** Si la computadora no la reconoce, prueba un puerto trasero, directo a la tarjeta madre.
- **Usar la misma memoria para todo.** Terminas borrando archivos sin querer o sin instalador cuando lo necesitas.

## Las memorias de la selección

Las dos opciones del catálogo son packs de PNY con collar deslizante, sin tapa que se pierda, y sirven para crear un instalador de Windows. La diferencia está en cuánto la vas a usar y para qué más:

- **[PNY Turbo Attaché 3 de 128 GB, pack de 5](/producto/usb-pny-turbo-attache-3-128gb-pack-5/):** son USB 3.0 y PNY indica hasta 100 MB/s de lectura, así que el instalador se crea y carga más rápido en un puerto compatible. Es la opción si reinstalas computadoras con frecuencia, das soporte técnico o quieres que las otras memorias del pack te sirvan para respaldos y archivos pesados.
- **[PNY Attaché 3 de 16 GB, pack de 10](/producto/usb-pny-attache-3-16gb-pack-10/):** 16 GB es justo la capacidad recomendada para el instalador, y con diez unidades puedes dejar una fija para Windows, otra para controladores y repartir el resto. Al ser USB 2.0, el proceso tarda más, pero funciona igual.

Si solo vas a reinstalar Windows de vez en cuando, el pack de 16 GB alcanza de sobra. Si te toca hacerlo seguido o quieres memorias que también sirvan para archivos grandes, elige el de 128 GB.

Para ver más opciones para guardar y llevar tus archivos, entra a la [categoría de almacenamiento](/categoria/almacenamiento/).
