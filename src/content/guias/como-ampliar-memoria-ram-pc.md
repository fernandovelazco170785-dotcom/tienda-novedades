---
titulo: Cómo ampliar la memoria RAM de tu PC sin comprar el módulo equivocado
descripcion: Cómo saber qué RAM tiene tu PC, cuántas ranuras quedan libres, si conviene agregar o reemplazar módulos y cómo instalarlos y activar XMP.
busqueda: cómo ampliar la memoria RAM de mi PC
categoria: componentes
productos:
  - id: ram-gigastone-game-pro-32gb-ddr4-3200
    motivo: Kit de dos módulos de 16 GB DDR4 3200 MHz para llegar a 32 GB en doble canal, con perfil XMP 2.0. Ideal para ampliar equipos AM4 o Intel con tarjeta madre DDR4.
  - id: amd-ryzen-5-9600x
    motivo: "Para cuando ampliar ya no vale la pena: plataforma AM5 con DDR5 y gráficos integrados básicos, útiles si todavía no tienes tarjeta de video. No acepta memoria DDR4."
  - id: intel-core-ultra-5-225f
    motivo: "Alternativa para renovar la plataforma: 10 núcleos (6P + 4E) y memoria DDR5. No trae gráficos integrados, así que necesita tarjeta de video dedicada."
faq:
  - pregunta: ¿Cómo sé cuántas ranuras de RAM libres tiene mi PC?
    respuesta: "Abre el Administrador de tareas con Ctrl + Shift + Esc, entra en Rendimiento y elige Memoria. En el apartado de ranuras usadas verás, por ejemplo, \"2 de 4\": significa que quedan dos libres."
  - pregunta: ¿Puedo agregar un módulo nuevo a los que ya tengo?
    respuesta: Se puede, pero mezclar marcas, velocidades o latencias distintas puede causar inestabilidad o que todo trabaje a la velocidad del módulo más lento. Si tus módulos actuales son pequeños, suele convenir más reemplazarlos por un kit nuevo de dos módulos.
  - pregunta: ¿Sirve una memoria de 3200 MHz si mi tarjeta madre solo admite menos?
    respuesta: Sí. La memoria es compatible hacia abajo dentro de la misma generación, así que trabajará a la velocidad máxima que permitan tu tarjeta madre y tu procesador.
  - pregunta: ¿Puedo poner memoria de laptop en mi computadora de escritorio?
    respuesta: No. Las laptops usan módulos cortos SO-DIMM y las computadoras de escritorio usan módulos largos DIMM. No encajan en la ranura del otro formato.
  - pregunta: ¿Qué hago si la PC no enciende después de instalar la RAM?
    respuesta: Apágala, desconéctala y vuelve a colocar los módulos presionando hasta que las pestañas cierren solas. Prueba con un solo módulo en la ranura que indica el manual. Si así arranca, revisa el otro módulo o si la mezcla con la memoria anterior es la causa.
publicada: "2026-11-26"
---

Ampliar la memoria RAM es una de las mejoras más baratas y más fáciles de hacer en una computadora de escritorio. Si tu PC se traba con muchas pestañas abiertas, tarda en cambiar entre programas o los juegos dan tirones aunque la tarjeta de video alcance, es muy probable que le falte memoria. El problema es que no cualquier módulo sirve: si compras la generación, el formato o la combinación equivocada, la memoria no entra, no enciende o trabaja más lento de lo que debería.

En esta guía vas a ver cómo averiguar qué memoria tiene tu equipo, qué revisar antes de comprar, cómo instalarla y cuándo conviene más cambiar de plataforma que seguir ampliando.

## Antes de comprar: averigua qué memoria tiene tu PC

No abras el gabinete todavía. Casi todo lo que necesitas saber lo puedes ver desde Windows:

1. **Administrador de tareas.** Presiona Ctrl + Shift + Esc, entra en la pestaña **Rendimiento** y elige **Memoria**. Ahí ves la cantidad total, la velocidad a la que trabaja, cuántas **ranuras** están usadas de cuántas hay y el factor de forma.
2. **Modelo de la tarjeta madre.** Presiona Windows + R, escribe msinfo32 y busca el fabricante y el producto de la placa base. Con ese modelo puedes buscar el manual oficial.
3. **Herramientas de diagnóstico.** Programas gratuitos como CPU-Z muestran en sus pestañas de memoria la generación (DDR3, DDR4 o DDR5), la capacidad de cada módulo y su fabricante.

Con el modelo de la tarjeta madre en la mano, abre su página de soporte. Ahí aparecen tres datos clave: qué generación de memoria acepta, cuál es la capacidad máxima y qué velocidades admite. Muchos fabricantes publican además una lista de memorias probadas, conocida como QVL.

## Criterios de compra

### Generación: DDR3, DDR4 o DDR5

La generación la decide la tarjeta madre, no tú. DDR3, DDR4 y DDR5 tienen la muesca en distinta posición, así que un módulo de una generación ni siquiera entra en la ranura de otra. Si tu equipo es AM4 de AMD o un Intel con tarjeta madre DDR4, necesitas DDR4. Si es AM5 o un Intel Core Ultra de escritorio de la serie 200, necesitas DDR5.

### Ranuras libres y capacidad máxima

Las tarjetas madre de escritorio suelen tener dos o cuatro ranuras. Si el Administrador de tareas dice "2 de 4", tienes espacio para agregar módulos. Si dice "2 de 2", la única forma de ampliar es reemplazar lo que tienes por módulos más grandes. Revisa también la capacidad máxima que acepta la tarjeta madre, sobre todo en equipos antiguos.

### Agregar o reemplazar

Agregar módulos a los que ya tienes parece lo más económico, pero mezclar memorias de distinta marca, velocidad o latencia puede dar problemas: inestabilidad, pantallazos o que todo el conjunto trabaje a la velocidad del módulo más lento. Si tus módulos actuales son pequeños, por ejemplo dos de 4 GB, muchas veces conviene más retirarlos y poner un kit nuevo de dos módulos de mayor capacidad.

### Doble canal: mejor dos módulos que uno

Con dos módulos iguales en las ranuras correctas, la tarjeta madre trabaja en **doble canal**, que duplica el ancho de banda teórico entre la memoria y el procesador. Por eso es mejor comprar dos de 16 GB que uno de 32 GB. Se nota en juegos y, sobre todo, si usas los gráficos integrados del procesador.

### Velocidad y perfil XMP

La velocidad de la caja, por ejemplo 3200 MHz, es la máxima del módulo. Si tu tarjeta madre o tu procesador admiten menos, la memoria trabaja a lo que ellos permitan. Además, muchas memorias arrancan a una velocidad más baja hasta que activas su perfil en la BIOS: **XMP** en Intel y, en tarjetas madre AMD, el mismo perfil con nombres como DOCP o A-XMP, según la marca.

### Cuánta memoria agregar

Para uso general y juegos, **16 GB** en doble canal es el mínimo razonable hoy. **32 GB** te dan margen para juegos exigentes con el navegador abierto, edición de fotos o video y máquinas virtuales. Si ya vas a abrir el gabinete, apuntar a 32 GB suele evitar que tengas que repetir la mejora en poco tiempo.

### Formato: DIMM o SO-DIMM

Las computadoras de escritorio usan módulos largos, llamados DIMM. Las laptops y algunas mini PC usan módulos cortos, SO-DIMM. No son intercambiables, así que revisa el formato antes de comprar. Ojo: muchas laptops modernas tienen la memoria soldada y no se puede ampliar.

## Cómo instalar la memoria paso a paso

1. Apaga la computadora, desconecta el cable de corriente y presiona el botón de encendido unos segundos para descargar la energía residual.
2. Toca una parte metálica del gabinete antes de manipular los módulos para descargar la estática.
3. Abre las pestañas de las ranuras, alinea la muesca del módulo con la de la ranura y presiona firme por ambos extremos hasta que las pestañas cierren solas.
4. Si usas dos módulos en una tarjeta madre de cuatro ranuras, ponlos en las que indica el manual. Suelen ser la segunda y la cuarta, contando desde el procesador.
5. Enciende el equipo. El primer arranque puede tardar más de lo normal mientras la tarjeta madre reconoce la memoria nueva.
6. Entra en la BIOS, activa el perfil XMP y confirma en el Administrador de tareas la capacidad y la velocidad.

## Errores comunes

- **Comprar sin revisar la generación.** Un kit DDR4 no sirve en una tarjeta madre DDR5, ni al revés, y no hay adaptador que lo arregle.
- **Confundir DIMM con SO-DIMM.** La memoria de laptop no entra en una computadora de escritorio.
- **Comprar un solo módulo grande.** Funciona, pero pierdes el doble canal.
- **Mezclar módulos distintos.** Si algo falla después de agregar memoria, la mezcla es la primera sospechosa.
- **Ponerlos en las ranuras equivocadas.** Dos módulos en ranuras contiguas pueden quedar en un solo canal.
- **No activar el perfil XMP.** Pagas por 3200 MHz y la memoria trabaja más lento.
- **Ampliar un equipo que ya no da más.** Si el cuello de botella es el procesador, más RAM no lo va a resolver.

## Qué comprar según tu caso

### Si tu PC es DDR4 y quieres llegar a 32 GB

El kit [Gigastone Game PRO de 32 GB DDR4 3200](/producto/ram-gigastone-game-pro-32gb-ddr4-3200/) trae dos módulos de 16 GB, así que trabaja en doble canal desde el primer día, y su perfil XMP 2.0 activa los 3200 MHz desde la BIOS. Es una buena opción para equipos AM4 o Intel con tarjeta madre DDR4 que se quedan cortos con 8 o 16 GB. Si tu tarjeta madre admite menos de 3200 MHz, la memoria funciona igual, solo que a la velocidad máxima que permita la placa.

### Si tu PC es DDR3 o ya no vale la pena ampliarla

Cuando el equipo usa DDR3 o el procesador ya está al límite, gastar en memoria suele ser dinero perdido. En ese caso conviene cambiar procesador, tarjeta madre y memoria juntos. El [AMD Ryzen 5 9600X](/producto/amd-ryzen-5-9600x/) usa la plataforma AM5 con DDR5 y trae gráficos integrados básicos, útiles mientras consigues tarjeta de video. El [Intel Core Ultra 5 225F](/producto/intel-core-ultra-5-225f/) tiene 10 núcleos y también pide DDR5, pero no trae gráficos integrados, así que necesitas tarjeta de video sí o sí. Ninguno de los dos acepta la memoria DDR4 de arriba.

## Para cerrar

Ampliar la RAM es sencillo si sigues el orden: averigua qué tienes, confirma lo que acepta tu tarjeta madre, compra un kit de dos módulos iguales y activa el perfil XMP. Si decides renovar la plataforma completa, sigue con la guía para [elegir procesador y memoria RAM sin errores de compatibilidad](/guias/como-elegir-procesador-y-memoria-ram/) o revisa toda la [selección de componentes](/categoria/componentes/).
