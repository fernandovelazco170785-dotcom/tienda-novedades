---
titulo: "Cómo elegir procesador y memoria RAM para tu PC sin errores de compatibilidad"
descripcion: "Socket, núcleos, gráficos integrados, DDR4 o DDR5 y doble canal: qué revisar antes de comprar procesador y RAM para que todo encaje a la primera."
busqueda: "cómo elegir procesador y memoria RAM para PC"
categoria: componentes
productos:
  - id: amd-ryzen-5-9600x
    motivo: "Seis núcleos y doce hilos con gráficos integrados básicos, así que la PC da imagen aunque todavía no tengas tarjeta de video. Usa socket AM5 y solo memoria DDR5, y no trae disipador."
  - id: intel-core-ultra-5-225f
    motivo: "Diez núcleos (seis de rendimiento y cuatro de eficiencia) para socket LGA1851 y memoria DDR5. La F indica que no tiene gráficos integrados: necesitas tarjeta de video sí o sí."
  - id: ram-gigastone-game-pro-32gb-ddr4-3200
    motivo: "Kit de 32 GB en dos módulos para trabajar en doble canal. Es DDR4: sirve para equipos AM4 o Intel con tarjeta madre DDR4, no para los dos procesadores de arriba, que piden DDR5."
faq:
  - pregunta: "¿Puedo usar memoria DDR4 con el Ryzen 5 9600X o el Core Ultra 5 225F?"
    respuesta: "No. Los dos usan plataformas que solo aceptan DDR5: AM5 en el caso del Ryzen y LGA1851 en el del Intel. Un módulo DDR4 ni siquiera entra en esas tarjetas madre, porque la muesca está en otra posición."
  - pregunta: "¿El Ryzen 5 9600X trae disipador?"
    respuesta: "No. Se vende sin disipador, así que hay que comprarlo aparte. Como su consumo base es de 65 W, un disipador de torre sencillo y compatible con AM5 suele ser suficiente."
  - pregunta: "¿Necesito tarjeta de video con el Core Ultra 5 225F?"
    respuesta: "Sí. La letra F indica que no tiene gráficos integrados. Sin una tarjeta de video dedicada, la computadora enciende pero no da imagen."
  - pregunta: "¿Me alcanza con 16 GB de RAM o compro 32 GB?"
    respuesta: "Para jugar y para uso general, 16 GB en doble canal funcionan bien. Si juegas títulos exigentes con el navegador abierto, editas video o usas máquinas virtuales, 32 GB te dan margen y evitan tener que ampliar pronto."
  - pregunta: "¿Qué pasa si instalo un solo módulo de memoria?"
    respuesta: "La computadora funciona, pero la memoria trabaja en un solo canal y el procesador recibe datos más lento. Se nota en juegos y, sobre todo, cuando se usan los gráficos integrados."
publicada: 2026-11-26
---

Elegir procesador y memoria RAM parece una decisión de rendimiento, pero antes que nada es una decisión de compatibilidad. El procesador define qué tarjeta madre necesitas, y la tarjeta madre define qué memoria acepta. Si una de las tres piezas no encaja con las otras, la PC no enciende o rinde por debajo de lo que pagaste.

En esta guía vas a ver qué revisar en cada pieza, cómo leer los nombres de los modelos y cuáles son los errores que más se repiten al armar o mejorar una computadora de escritorio. Al final están los procesadores y la memoria de la [selección de componentes](/categoria/componentes/), con lo que conviene saber de cada uno.

## Primero, la plataforma: procesador, tarjeta madre y RAM van juntos

Cada procesador se instala en un **socket**, que es el zócalo físico de la tarjeta madre. Los AMD Ryzen de escritorio más recientes usan el socket **AM5**, y los Intel Core Ultra de escritorio de la serie 200 usan **LGA1851**. Un procesador de un socket no entra en una tarjeta madre de otro, así que la tarjeta madre se elige después del procesador, nunca antes.

La memoria, a su vez, depende de la tarjeta madre. Las plataformas AM5 y LGA1851 trabajan solo con memoria **DDR5**. Las plataformas anteriores, como AM4 de AMD, usan DDR4, y las tarjetas madre Intel de 12.ª a 14.ª generación pueden ser DDR4 o DDR5: cada modelo de tarjeta madre admite una u otra.

Piénsalo como un trío. Si cambias de plataforma, lo normal es cambiar también tarjeta madre y memoria. Por eso conviene presupuestar las tres piezas juntas antes de decidir, y no comprar ninguna "porque estaba en oferta" sin saber dónde va a ir.

## Criterios de compra

### 1. Socket y chipset

Una vez elegido el procesador, revisa que la tarjeta madre tenga el mismo socket. Dentro de un mismo socket hay varios **chipsets**, por ejemplo B650 o X670 en AM5, y B860 o Z890 en LGA1851. El chipset cambia la cantidad de puertos USB, ranuras M.2 para discos y opciones de ajuste. Para la mayoría de usuarios, un chipset de gama media alcanza; los de gama alta tienen sentido si vas a exprimir el equipo o necesitas muchas conexiones.

Un detalle práctico: si la tarjeta madre salió antes que tu procesador, puede necesitar una actualización de BIOS para reconocerlo. Antes de comprar, busca la lista de procesadores compatibles en la página del fabricante de la tarjeta madre.

### 2. Núcleos e hilos según lo que haces

Los **núcleos** son las unidades que procesan el trabajo y los **hilos** son las tareas que el procesador puede atender al mismo tiempo. Para jugar y para uso general, seis núcleos modernos siguen siendo suficientes. Si además editas video, transmites mientras juegas o usas programas que reparten la carga, más núcleos ayudan.

No compares solo el número. En los Intel Core Ultra conviven núcleos de rendimiento (P) y de eficiencia (E), que no rinden igual. Además, en esta generación de Intel cada núcleo atiende un solo hilo, mientras que en los Ryzen cada núcleo atiende dos. Por eso un procesador con menos núcleos puede rendir parecido a otro con más: lo que manda son las pruebas independientes en las tareas que tú usas.

### 3. Gráficos integrados: la letra F importa

Algunos procesadores traen una pequeña tarjeta de video integrada que permite usar la computadora sin tarjeta gráfica dedicada. En Intel, la **F** al final del nombre indica que el modelo **no** tiene gráficos integrados. El Ryzen 5 9600X sí trae gráficos integrados básicos: sirven para tareas de oficina, para ver videos o para tener imagen mientras consigues una tarjeta de video, pero no están pensados para juegos exigentes.

Si tu PC va a tener tarjeta de video desde el primer día, un modelo F puede ser una forma de ahorrar. Si la tarjeta llegará después, o quieres un respaldo por si algún día falla, los gráficos integrados se agradecen.

### 4. Disipador: revisa si viene en la caja

No todos los procesadores incluyen disipador. El Ryzen 5 9600X, por ejemplo, se vende sin él, así que hay que sumarlo a la compra desde el principio. Para procesadores de 65 W de consumo base, un disipador de torre sencillo suele bastar. Antes de comprarlo, confirma que sea compatible con tu socket y que quepa en tu gabinete: la altura máxima del disipador aparece en la ficha del gabinete.

### 5. DDR4 o DDR5: no se mezclan

La generación de memoria no es una preferencia, la decide la tarjeta madre. Los módulos DDR4 y DDR5 tienen la muesca en distinta posición, así que físicamente no entran en la ranura equivocada. Si tu plataforma es AM5 o LGA1851, compra DDR5. Si estás mejorando un equipo AM4 o un Intel con tarjeta madre DDR4, la memoria DDR4 sigue siendo la opción correcta, y ampliar la RAM es de las mejoras que más se notan en un equipo que se queda corto.

### 6. Capacidad, doble canal y perfil de velocidad

Para jugar y trabajar con varias aplicaciones abiertas, **16 GB** es el mínimo razonable hoy y **32 GB** dan margen para juegos exigentes, edición o muchas pestañas del navegador. Más allá de eso, solo compensa si tu trabajo lo pide.

Compra la memoria en **kit de dos módulos**, por ejemplo dos de 16 GB en lugar de uno de 32 GB. Así la tarjeta madre trabaja en **doble canal**, que duplica el ancho de banda teórico entre memoria y procesador. Instálalos en las ranuras que indica el manual; en tarjetas madre de cuatro ranuras suelen ser la segunda y la cuarta.

Por último, la velocidad anunciada en la caja, como 3200 MHz, no siempre se activa sola. Muchas memorias arrancan a una velocidad más baja hasta que activas su perfil en la BIOS: **XMP** en Intel y **EXPO** en memorias DDR5 para AMD. En tarjetas madre AMD con DDR4, el perfil XMP puede aparecer con otro nombre, como DOCP o A-XMP, según la marca. La latencia (el número CL) importa menos que la capacidad y el doble canal.

## Los procesadores de la selección, lado a lado

| Característica | Ryzen 5 9600X | Core Ultra 5 225F |
|---|---|---|
| Socket | AM5 | LGA1851 |
| Núcleos e hilos | 6 núcleos, 12 hilos | 10 núcleos (6 P + 4 E), 10 hilos |
| Frecuencia máxima | Hasta 5,4 GHz | Hasta 4,9 GHz |
| Gráficos integrados | Sí, básicos | No |
| Memoria | Solo DDR5 | Solo DDR5 |
| Disipador en la caja | No | Revisa la ficha del vendedor |

Las comparativas publicadas suelen darle ventaja al Ryzen 5 9600X en juegos; en tareas que aprovechan muchos núcleos, la distancia se acorta. Como el precio de cada uno cambia seguido, la decisión práctica es esta: si juegas y los dos cuestan parecido, el 9600X; si el 225F te sale claramente más conveniente y vas a usar tarjeta de video de todos modos, es una opción razonable.

La memoria Gigastone de la selección es DDR4, así que no acompaña a ninguno de estos dos procesadores. Es una buena opción para quien tiene un equipo AM4 o un Intel con tarjeta madre DDR4 y quiere llegar a 32 GB en doble canal sin cambiar de plataforma.

## Errores comunes

- **Comprar la RAM antes que la tarjeta madre.** Es el error más caro: un kit DDR4 no sirve en una plataforma DDR5 y no hay adaptador que lo arregle.
- **Elegir un procesador F sin tarjeta de video.** La PC enciende, pero no da imagen. Con un modelo F, la tarjeta gráfica es obligatoria.
- **Olvidar el disipador.** Si la caja no lo trae, la PC no puede funcionar hasta que lo instales.
- **Usar un solo módulo de memoria.** Funciona, pero pierdes el doble canal y parte del rendimiento, sobre todo con gráficos integrados.
- **Dejar la memoria a la velocidad por defecto.** Si no activas el perfil XMP o EXPO, pagas por una velocidad que no usas.
- **Mezclar módulos distintos.** Memorias de marcas, velocidades o latencias diferentes pueden fallar o trabajar a la velocidad de la más lenta. Si necesitas más, compra un kit completo nuevo.
- **No revisar la BIOS.** Una tarjeta madre anterior al procesador puede pedir una actualización antes de reconocerlo.

## Cómo decidir en tres pasos

1. **Elige la plataforma** según tu uso: procesador y, con él, el socket.
2. **Elige la tarjeta madre** con ese socket y confirma en su página que acepta tu procesador.
3. **Elige la memoria** de la generación que pide esa tarjeta madre, en kit de dos módulos y con la capacidad que necesitas.

Si sigues ese orden, todo encaja a la primera. Y si también vas a renovar lo que tocas todos los días, sigue con la guía para [elegir un teclado mecánico](/guias/como-elegir-teclado-mecanico/).
