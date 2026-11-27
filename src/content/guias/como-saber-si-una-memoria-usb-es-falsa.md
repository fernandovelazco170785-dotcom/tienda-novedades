---
titulo: Cómo saber si una memoria USB es falsa y comprar una que no te engañe
descripcion: Señales de alerta, pruebas para comprobar la capacidad real de una memoria USB falsa y qué revisar antes de comprar para no perder tus archivos.
busqueda: cómo saber si una memoria USB es falsa
categoria: almacenamiento
productos:
  - id: usb-pny-turbo-attache-3-128gb-pack-5
    motivo: "Cinco memorias USB 3.0 de 128 GB de una marca con modelo identificable y capacidad realista. PNY indica hasta 100 MB/s de lectura: sirven para fotos, videos y respaldos sin apostar por una memoria gigante dudosa."
  - id: usb-pny-attache-3-16gb-pack-10
    motivo: Diez memorias USB 2.0 de 16 GB para documentos y tareas. Para clases u oficinas, tener muchas unidades de marca conocida es más útil que una sola de capacidad exagerada.
faq:
  - pregunta: ¿Se puede reparar una memoria USB falsa?
    respuesta: Formatearla no sirve, porque el problema está en el controlador. Algunos programas pueden limitarla a su capacidad real, pero el chip de estas memorias suele ser de mala calidad. Lo mejor es devolverla y no guardar en ella nada importante.
  - pregunta: ¿Cuánto tarda en probar una memoria USB con un programa de verificación?
    respuesta: Depende de la capacidad y de la velocidad de escritura. Una memoria pequeña y rápida puede tardar pocos minutos, mientras que una grande o lenta puede tomar varias horas, porque el programa escribe y luego lee todo el espacio libre.
  - pregunta: ¿Por qué mi memoria de 128 GB muestra 119 GB? ¿Es falsa?
    respuesta: "No. Es normal: los fabricantes cuentan 1 GB como mil millones de bytes y Windows usa una medida algo mayor. Una memoria falsa suele hacer lo contrario: mostrar la capacidad completa aunque el chip guarde mucho menos."
  - pregunta: ¿Las pruebas de capacidad borran lo que tengo en la memoria?
    respuesta: Los programas de verificación escriben en el espacio libre, y si la memoria es falsa pueden sobrescribir datos existentes. Copia todo a otro lugar y deja la memoria vacía antes de empezar.
  - pregunta: ¿Comprar en Amazon garantiza que la memoria sea original?
    respuesta: No por sí solo. Conviene revisar quién vende y quién envía el producto, preferir a la marca o a vendedores con buen historial y probar la memoria apenas llega, mientras todavía puedes devolverla.
publicada: "2026-11-27"
---

Compraste una memoria USB de mucha capacidad, la conectaste y Windows muestra justo lo que decía la caja. Copias tus fotos, todo parece normal… hasta que días después las abres y salen grises, cortadas o con error. Ese es el síntoma típico de una memoria USB falsa, y es más común de lo que parece en tiendas en línea y mercados de vendedores independientes.

Lo peor es que estas memorias están hechas para engañar a la computadora, así que no basta con mirar el espacio en el explorador. En esta guía te explicamos cómo funcionan, cómo comprobar si la tuya es falsa en unos minutos (o en un par de horas, si quieres estar seguro) y cómo comprar para no caer. Si buscas memorias de marca, revisa la [categoría de almacenamiento](/categoria/almacenamiento/).

## Cómo funciona una memoria USB falsa

Una memoria USB tiene dos partes principales: el chip de memoria, donde se guardan los datos, y un pequeño controlador que le dice a la computadora cuánto espacio hay. En una memoria falsa, el controlador está modificado para **reportar una capacidad mayor a la real**. Por ejemplo, la memoria puede tener 32 GB de chip pero anunciarse como de 1 TB.

Mientras copias menos datos que la capacidad real, todo funciona bien. El problema aparece cuando pasas ese límite: la memoria acepta los archivos, la copia termina sin errores, pero lo que se escribe después de ese punto se pierde o pisa datos anteriores. Por eso muchas personas descubren el engaño tarde, cuando ya confiaron un respaldo importante a esa memoria.

Por esa misma razón, la ventana de propiedades de Windows no sirve para detectarlas: solo muestra lo que el controlador dice, no lo que el chip puede guardar de verdad.

### Lo que no es una falsificación

Antes de alarmarte, ten en cuenta que una memoria de 128 GB que aparece con unos 119 GB en Windows es **normal**. Los fabricantes cuentan 1 GB como mil millones de bytes y Windows usa una medida un poco mayor. Una memoria falsa hace lo contrario: muestra la capacidad completa, o incluso una cifra redonda que no cuadra con nada.

## Señales de alerta antes y después de comprar

Algunas pistas que deberían hacerte desconfiar:

- **Capacidades enormes en un cuerpo diminuto y a un precio muy por debajo del resto.** Memorias de 1 o 2 TB a precio de una de 32 GB son el caso más común.
- **USB 2.0 con capacidades gigantes.** Llenar 1 TB a velocidad de USB 2.0 tomaría horas; ningún fabricante serio arma ese producto.
- **Marca desconocida o imitada**, empaque con errores de ortografía, sin modelo ni datos del fabricante.
- **Velocidad de escritura bajísima**, muy por debajo de lo que promete la caja.
- **Archivos que se dañan solos**: fotos a medias, videos que se cortan en el mismo punto, carpetas que aparecen vacías o con nombres raros.

## Cómo comprobar si tu memoria USB es falsa

### Prueba rápida con tus propios archivos

Si no quieres instalar nada, puedes hacer una prueba casera. Copia a la memoria una carpeta con muchos archivos que puedas abrir fácilmente, como fotos o videos, hasta llenar casi todo el espacio. Después **expúlsala, vuelve a conectarla** y abre los últimos archivos que copiaste. Si los primeros abren bien y los últimos salen dañados o no abren, la memoria es falsa.

La limitación es que necesitas tantos archivos como capacidad dice tener la memoria, y revisarlos uno por uno es lento.

### Prueba completa con un programa de verificación

La forma confiable es usar un programa que escriba datos de prueba en todo el espacio libre y luego los lea para comparar. Los más conocidos son gratuitos: **H2testw** en Windows y **F3** en Linux y Mac. El proceso es el mismo en ambos:

1. Copia a otro lugar lo que tenga la memoria y déjala vacía.
2. Ejecuta el programa, elige la unidad y deja que escriba en todo el espacio disponible.
3. Espera a que lea y verifique los datos. En una memoria grande o lenta puede tardar horas.
4. Revisa el resultado: si todo coincide, la capacidad es real; si hay sectores dañados o perdidos, el programa te dice cuánto espacio funciona de verdad.

Como bonus, estas pruebas también te muestran la velocidad real de escritura y lectura, que suele ser menor que la del empaque, incluso en memorias originales.

## Criterios de compra

### Vendedor confiable

En Amazon, fíjate en quién vende y quién envía el producto. Lo más seguro es comprar a la marca o a vendedores con muchas calificaciones y buen historial. Desconfía de publicaciones nuevas con pocas reseñas y fotos genéricas.

### Marca reconocida y modelo identificable

Una marca conocida publica la ficha técnica del modelo, ofrece garantía y tiene algo que perder si vende algo falso. Busca que el modelo exacto aparezca con su capacidad, su estándar USB y su velocidad.

### Capacidad acorde a lo que necesitas

No pagues por capacidad que no vas a usar, y menos si viene de un vendedor dudoso. Para documentos y tareas, 16 GB sobran; para fotos, videos y respaldos, 64 a 128 GB es un rango razonable. Si necesitas mucho más, piensa en un disco externo.

### Reseñas con pruebas reales

Las reseñas más útiles son las que mencionan resultados de pruebas de capacidad o velocidad. Si varias personas cuentan que sus archivos se dañaron después de llenar la memoria, no hace falta más.

### Probarla apenas llega

Haz la prueba completa en los primeros días, mientras todavía puedes devolverla. Es mejor perder un par de horas que perder tus archivos.

## Errores comunes

- **Confiar en lo que muestra Windows.** La capacidad de las propiedades es la que dice el controlador, no la real.
- **Formatear para "arreglarla".** Formatear no cambia el controlador; la memoria seguirá mintiendo sobre su capacidad.
- **Seguir usándola como si nada.** Aunque algunos programas pueden limitarla a su capacidad real, el chip de una memoria falsa suele ser de mala calidad. Devuélvela y no guardes ahí nada importante.
- **Probarla con datos que no tienen copia.** La prueba borra o sobrescribe el espacio libre; respalda antes.
- **Creer que una marca famosa en la etiqueta basta.** Las falsificaciones copian logotipos y empaques; lo que importa es a quién le compras.
- **Usar una sola memoria como respaldo.** Incluso las originales se pierden o fallan. Lo importante debe estar en al menos dos lugares.

## Memorias de marca de la selección

Las dos opciones del catálogo son de **PNY**, una marca con modelos identificables y capacidades realistas, y comparten el diseño con collar deslizante que protege el conector sin una tapa que se pierda.

- **[PNY Turbo Attaché 3 de 128 GB, pack de 5](/producto/usb-pny-turbo-attache-3-128gb-pack-5/):** USB 3.0 y hasta 100 MB/s de lectura según PNY. Conviene si vas a guardar fotos, videos o respaldos y quieres varias memorias de buena capacidad en vez de una sola "gigante" de origen dudoso.
- **[PNY Attaché 3 de 16 GB, pack de 10](/producto/usb-pny-attache-3-16gb-pack-10/):** USB 2.0, para documentos, tareas y archivos livianos. Es la opción para salones de clase, oficinas o familias que necesitan muchas memorias sin preocuparse por la velocidad.

Sea cual sea la que elijas, haz la prueba de capacidad cuando llegue: con un pack, basta con revisar una o dos memorias para quedarte tranquilo.

Si todavía dudas entre velocidades, lee nuestra guía sobre [memoria USB 2.0 o 3.0](/guias/memoria-usb-2-0-o-3-0-cual-comprar/), y si vas a usar una memoria para instalar Windows, revisa [cómo crear una USB booteable de Windows 11](/guias/como-crear-usb-booteable-windows-11/).
