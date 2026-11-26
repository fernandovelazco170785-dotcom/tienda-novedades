---
titulo: "DDR4 o DDR5: qué memoria RAM comprar para tu PC"
descripcion: "DDR4 o DDR5: en qué se diferencian, cómo saber cuál acepta tu PC, cómo comparar velocidad y latencia, y cuándo conviene cada una."
busqueda: DDR4 o DDR5 cuál comprar
categoria: componentes
productos:
  - id: ram-gigastone-game-pro-32gb-ddr4-3200
    motivo: Kit de dos módulos de 16 GB DDR4 3200 CL16 con perfil XMP 2.0. Es la opción para ampliar una PC AM4 o Intel con placa DDR4 sin cambiar de plataforma.
  - id: amd-ryzen-5-9600x
    motivo: "Para armar una PC nueva con DDR5: 6 núcleos y 12 hilos, Zen 5 y plataforma AM5, que permite cambiar solo el procesador más adelante. Trae gráficos integrados básicos."
  - id: intel-core-ultra-5-225f
    motivo: "Alternativa Intel para una plataforma DDR5: 10 núcleos (6P + 4E) y hasta 4,9 GHz en socket LGA1851. No trae video integrado, así que necesita tarjeta de video."
faq:
  - pregunta: ¿Puedo poner memoria DDR5 en una tarjeta madre DDR4?
    respuesta: No. La muesca de cada generación está en una posición distinta, así que el módulo no entra en la ranura. Tampoco hay adaptadores. Para usar DDR5 necesitas una tarjeta madre DDR5 y un procesador que la admita.
  - pregunta: ¿Vale la pena cambiar de DDR4 a DDR5 si ya tengo PC?
    respuesta: Solo si de todas formas vas a cambiar procesador y tarjeta madre porque el equipo se quedó corto. Si tu procesador todavía rinde bien y lo que te falta es capacidad, ampliar con un kit DDR4 de dos módulos sale mucho más conveniente.
  - pregunta: ¿Por qué la DDR5 tiene una latencia CL más alta?
    respuesta: "Porque trabaja a más velocidad y sus ciclos son más cortos. Para comparar, calcula la latencia real: CL × 2000 ÷ velocidad. Un DDR4 3200 CL16 y un DDR5 6000 CL30 dan los dos 10 nanosegundos, pero el DDR5 mueve más datos por segundo."
  - pregunta: ¿Cómo sé si mi PC usa DDR4 o DDR5?
    respuesta: Abre el Administrador de tareas con Ctrl + Shift + Esc, entra en Rendimiento y luego en Memoria. Si no aparece la generación, usa un programa gratuito como CPU-Z o busca el manual de tu tarjeta madre con el modelo que muestra msinfo32.
  - pregunta: ¿Es normal que la PC tarde en encender la primera vez con DDR5?
    respuesta: Sí. En el primer arranque, la tarjeta madre hace un entrenamiento de memoria que puede dejar la pantalla negra un rato. No la apagues; espera a que termine. Los arranques siguientes son normales.
publicada: "2026-11-26"
---

Si estás por comprar memoria RAM, tarde o temprano te topas con la misma duda: ¿DDR4 o DDR5? La respuesta corta es que casi nunca eliges tú. La decide la tarjeta madre y, detrás de ella, el procesador. Lo que sí eliges es si te quedas en una plataforma DDR4 y la aprovechas al máximo, o si das el salto a una plataforma DDR5 nueva.

En esta guía vas a ver en qué se diferencian de verdad las dos generaciones, cómo saber cuál te toca, qué números mirar en la caja y en qué casos conviene cada camino.

## Lo básico: qué cambia entre DDR4 y DDR5

DDR4 y DDR5 son dos generaciones de memoria para computadoras de escritorio y laptops. No son intercambiables: la muesca del módulo está en una posición distinta, así que un módulo DDR4 ni siquiera entra en una ranura DDR5, y al revés. No existen adaptadores.

Las diferencias más importantes son estas:

- **Velocidad.** DDR4 llega de forma oficial hasta 3200 MT/s, aunque hay kits más rápidos con perfiles de fábrica. DDR5 arranca más arriba y los kits comunes para jugar rondan los 5600 a 6000 MT/s o más. Más velocidad significa más ancho de banda, es decir, más datos por segundo entre la memoria y el procesador.
- **Organización del módulo.** Cada módulo DDR5 se divide en dos subcanales independientes de 32 bits, en lugar de un solo canal de 64 bits como en DDR4. Esto ayuda a que el procesador atienda más pedidos a la vez.
- **Energía.** DDR5 trabaja a 1,1 V de forma estándar, frente a los 1,2 V de DDR4, y lleva su propio regulador de voltaje (PMIC) dentro del módulo, en lugar de depender solo de la tarjeta madre.
- **Corrección de errores interna.** DDR5 incluye corrección de errores dentro del chip (on-die ECC). Ojo: no es lo mismo que la memoria ECC de servidores; sirve para que los chips de alta densidad sean más confiables, no para proteger todo el sistema.

Un detalle: en las cajas y fichas verás "MHz" donde técnicamente debería decir MT/s. Cuando un kit dice 3200 MHz o 6000 MHz, se refiere a la velocidad efectiva y puedes compararlos directamente.

## Criterios de compra

### Primero mira tu plataforma

Este es el criterio que manda sobre todos los demás:

- **AMD AM4** (Ryzen 1000 a 5000 de escritorio): solo DDR4.
- **AMD AM5** (Ryzen 7000, 8000 y 9000 de escritorio): solo DDR5.
- **Intel de 12.ª, 13.ª y 14.ª generación** (socket LGA1700): el procesador acepta ambas, pero cada tarjeta madre trae ranuras de una sola generación. Tienes que revisar el modelo exacto de tu placa.
- **Intel Core Ultra de escritorio serie 200** (socket LGA1851): solo DDR5.

Si no sabes qué tienes, abre el Administrador de tareas con Ctrl + Shift + Esc, entra en Rendimiento y luego en Memoria. Con msinfo32 averiguas el modelo de la tarjeta madre y, con eso, su manual.

### Si ya tienes la computadora: no cambies todo por la RAM

Si tu equipo es DDR4 y funciona bien, pasar a DDR5 obliga a cambiar tarjeta madre y casi siempre procesador. Ese gasto solo se justifica si el procesador ya se quedó corto. Si lo que falta es capacidad, un kit DDR4 de 32 GB resuelve el problema por mucho menos.

### Si vas a armar una PC nueva: piensa en el futuro

Para un equipo nuevo de gama media en adelante, la opción sensata hoy es DDR5. No porque DDR4 sea mala, sino porque las plataformas actuales de AMD e Intel ya no la usan, y una plataforma nueva te deja cambiar el procesador más adelante sin tocar el resto. Una placa DDR4 te ata a procesadores que ya no tendrán sucesores.

### Velocidad y latencia: mira los dos números juntos

La latencia CL indica cuántos ciclos tarda la memoria en responder. DDR5 tiene CL más altos que DDR4, pero sus ciclos son más cortos, así que el número solo no sirve para comparar. La cuenta útil es la latencia real en nanosegundos: CL × 2000 ÷ velocidad. Un kit DDR4 3200 CL16 da 10 ns, y un kit DDR5 6000 CL30 también da 10 ns. Es decir, responden igual de rápido, pero el DDR5 mueve muchos más datos por segundo.

### Perfiles XMP y EXPO

La velocidad de la caja casi nunca se activa sola. Hay que entrar en la BIOS y activar el perfil del kit: **XMP** en memorias pensadas para Intel (y en muchas placas AMD, con nombres como DOCP o A-XMP) y **EXPO**, el perfil de AMD para DDR5 en AM5. Muchos kits DDR5 traen ambos. Si no lo activas, la memoria trabaja a una velocidad base más lenta.

### Capacidad y doble canal

En cualquiera de las dos generaciones, compra dos módulos iguales para trabajar en doble canal. Para jugar y trabajar, 16 GB es el mínimo razonable y 32 GB te da margen. En DDR5, mejor dos módulos que cuatro: con cuatro, muchas placas tienen que bajar la velocidad para mantener la estabilidad.

## Errores comunes

- **Comprar la memoria antes que la tarjeta madre.** La placa decide la generación; si compras al revés, puedes quedarte con un kit que no entra.
- **Creer que el procesador Intel define la generación.** En LGA1700 depende de la tarjeta madre, no del procesador.
- **Comparar solo el CL.** Un CL30 en DDR5 no es "más lento" que un CL16 en DDR4; calcula los nanosegundos.
- **Armar una PC nueva con DDR4 solo para ahorrar en memoria.** Ahorras hoy, pero te quedas en una plataforma sin futuro.
- **Cambiar de plataforma solo por la RAM.** Si tu procesador todavía rinde, ampliar la DDR4 sale mucho mejor.
- **Olvidar XMP o EXPO.** Pagas por una velocidad que la memoria no usa.
- **Asustarse con el primer arranque de DDR5.** La placa hace un entrenamiento de memoria y la pantalla puede quedarse negra un rato; no apagues el equipo.

## Qué comprar según tu caso

### Si tu PC es DDR4 y quieres más memoria

El kit [Gigastone Game PRO de 32 GB DDR4 3200](/producto/ram-gigastone-game-pro-32gb-ddr4-3200/) trae dos módulos de 16 GB para trabajar en doble canal, con latencia CL16 y perfil XMP 2.0 para activar los 3200 MHz desde la BIOS. Es la opción lógica para un equipo AM4 o Intel con placa DDR4 que se queda corto con 8 o 16 GB. Antes de comprar, confirma en el Administrador de tareas que tu memoria actual es DDR4: este kit no entra en una placa DDR5.

### Si vas a armar una PC nueva con DDR5 y AMD

El [AMD Ryzen 5 9600X](/producto/amd-ryzen-5-9600x/) tiene 6 núcleos y 12 hilos con arquitectura Zen 5 y hasta 5,4 GHz. Usa la plataforma AM5, que solo acepta DDR5 y admite PCIe 5.0. Su ventaja es la continuidad: AMD mantiene el socket varias generaciones, así que más adelante puedes cambiar solo el procesador. Trae gráficos integrados básicos, útiles para arrancar mientras consigues tarjeta de video.

### Si vas a armar una PC nueva con DDR5 e Intel

El [Intel Core Ultra 5 225F](/producto/intel-core-ultra-5-225f/) tiene 10 núcleos (6 de rendimiento y 4 de eficiencia) y llega a 4,9 GHz. Usa el socket LGA1851, que también es solo DDR5, y rinde bien con varias aplicaciones abiertas a la vez. La F significa que no trae video integrado: necesitas tarjeta de video dedicada desde el primer día.

Con cualquiera de los dos, busca un kit DDR5 de dos módulos con perfil EXPO o XMP según la plataforma, y revisa la lista de memorias compatibles (QVL) de tu tarjeta madre.

## Para cerrar

La pregunta "DDR4 o DDR5" se resuelve casi sola cuando sabes qué plataforma tienes o quieres. Si ya tienes una placa DDR4 que funciona, amplíala. Si armas desde cero, ve por DDR5. Para elegir el resto de la plataforma, sigue con la guía de [AMD o Intel: qué procesador comprar](/guias/amd-o-intel-que-procesador-comprar/) o, si te quedas en DDR4, con la de [cómo ampliar la memoria RAM de tu PC](/guias/como-ampliar-memoria-ram-pc/). También puedes ver toda la [selección de componentes](/categoria/componentes/).
