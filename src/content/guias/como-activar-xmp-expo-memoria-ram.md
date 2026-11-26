---
titulo: Cómo activar XMP o EXPO en la BIOS para que tu RAM rinda lo que pagaste
descripcion: Qué son los perfiles XMP y EXPO, por qué tu RAM no va a la velocidad de la caja, cómo activarlos en la BIOS y qué hacer si la PC no arranca.
busqueda: cómo activar XMP en la BIOS
categoria: componentes
productos:
  - id: ram-gigastone-game-pro-32gb-ddr4-3200
    motivo: "Kit de dos módulos de 16 GB DDR4 3200 CL16 con perfil XMP 2.0: activas los 3200 MHz con una sola opción en la BIOS y trabajas en doble canal. Para placas AM4 o Intel DDR4."
  - id: amd-ryzen-5-9600x
    motivo: Para armar una PC nueva en AM5, donde los kits DDR5 con perfil EXPO son la opción más directa. 6 núcleos y 12 hilos Zen 5, con gráficos integrados básicos. No acepta DDR4.
  - id: intel-core-ultra-5-225f
    motivo: Alternativa Intel con 10 núcleos (6P + 4E) y memoria DDR5 con perfiles XMP 3.0. No trae video integrado, así que necesitas tarjeta gráfica dedicada.
faq:
  - pregunta: ¿Activar XMP o EXPO daña la memoria o el procesador?
    respuesta: En uso normal, no. El perfil aplica la velocidad, latencias y voltaje que el fabricante probó para ese kit. Si el equipo no queda estable, basta con desactivarlo o restablecer la BIOS para volver a la configuración estándar.
  - pregunta: ¿Puedo usar una memoria con XMP en una placa AMD?
    respuesta: Sí. Las placas AMD leen los perfiles XMP, aunque cada marca los muestra con su propio nombre en la BIOS, como DOCP, A-XMP o simplemente XMP. En DDR5 para AM5 también existe EXPO, el perfil propio de AMD.
  - pregunta: ¿Por qué CPU-Z muestra la mitad de la velocidad de mi RAM?
    respuesta: Porque la memoria DDR hace dos transferencias por ciclo. Un kit DDR4-3200 con el perfil activo aparece en CPU-Z como unos 1600 MHz, y eso es correcto. El Administrador de tareas muestra la cifra comercial de la caja.
  - pregunta: ¿Se nota activar XMP en juegos y uso diario?
    respuesta: Depende del procesador y del juego, pero la memoria más rápida ayuda sobre todo en juegos que dependen del procesador y cuando usas los gráficos integrados. Como activarlo no cuesta nada, no hay motivo para dejarlo apagado si tu equipo queda estable.
  - pregunta: ¿Qué hago si no encuentro la opción XMP en mi BIOS?
    respuesta: Busca el manual de tu tarjeta madre y revisa la sección de memoria o de overclock. Algunas placas de gama de entrada o de equipos armados por marcas no permiten perfiles de memoria. Actualizar la BIOS a veces agrega opciones, pero si no existe, la RAM funcionará a la velocidad estándar.
publicada: "2026-11-26"
---

Compraste memoria de 3200 MHz, la instalaste y el Administrador de tareas dice 2133 o 2400. No es un defecto ni te vendieron algo falso: casi todas las memorias arrancan a una velocidad básica de seguridad, y la velocidad de la caja solo se activa cuando cargas su perfil en la BIOS. Ese perfil se llama **XMP** en el mundo Intel y **EXPO** en las memorias DDR5 pensadas para AMD.

Aquí vas a ver qué es cada perfil, cómo activarlo y qué revisar antes de comprar memoria.

## Qué es XMP y por qué tu RAM no va a la velocidad de la caja

Cada módulo de memoria guarda en un pequeño chip una lista de configuraciones. La primera es la estándar de JEDEC, el organismo que define las especificaciones de la memoria: es conservadora y funciona en cualquier placa compatible con esa generación. En DDR4 suele ser 2133 o 2400 MHz, y en DDR5, 4800 MHz o cercana.

Además de esa configuración básica, el fabricante graba uno o más perfiles con la velocidad, las latencias y el voltaje que probó para ese kit. Esos son los perfiles de rendimiento:

- **XMP (Extreme Memory Profile):** creado por Intel. Existe en DDR4 (XMP 2.0) y en DDR5 (XMP 3.0). Las placas AMD también lo leen, aunque cada marca le pone su propio nombre en la BIOS, como DOCP, A-XMP o simplemente XMP.
- **EXPO:** el equivalente de AMD para memoria DDR5 en plataforma AM5. Muchos kits DDR5 traen los dos perfiles.

La placa no lo carga sola porque, técnicamente, superar la velocidad estándar es un overclock de memoria. Por eso lo activas tú, pero sin tocar números: eliges el perfil y la placa aplica todo.

### MHz o MT/s: por qué ves la mitad en algunos programas

La cifra de la caja, como "3200 MHz", en rigor son 3200 MT/s (millones de transferencias por segundo). La memoria DDR hace dos transferencias por ciclo, así que el reloj real es la mitad. Por eso programas como CPU-Z muestran unos 1600 MHz en un kit DDR4-3200 con el perfil activo. Eso es correcto. El Administrador de tareas de Windows, en cambio, muestra la cifra comercial.

## Cómo activar XMP o EXPO paso a paso

1. **Revisa la velocidad actual.** Abre el Administrador de tareas con Ctrl + Shift + Esc, entra en **Rendimiento** y luego en **Memoria**. Anota la velocidad que aparece.
2. **Entra en la BIOS.** Reinicia y presiona repetidamente la tecla que indique tu placa al encender. Lo más común es Supr (Delete) o F2.
3. **Busca el perfil.** En muchas placas aparece en la pantalla principal del modo fácil (EZ Mode). Si no, búscalo en la sección de overclock o ajustes avanzados de memoria. El nombre cambia según la marca: XMP, EXPO, DOCP o A-XMP.
4. **Elige el perfil.** Si hay varios, el primero suele ser el de la velocidad anunciada en la caja. No hace falta tocar latencias ni voltajes.
5. **Guarda y reinicia.** Normalmente con F10 o en el menú de salida, con la opción de guardar cambios.
6. **Ten paciencia en el primer arranque.** Sobre todo con DDR5, la placa hace un "entrenamiento" de memoria y la pantalla puede quedarse en negro un buen rato. No apagues el equipo a la fuerza.
7. **Confirma en Windows.** Vuelve al Administrador de tareas y comprueba que la velocidad ahora coincide con la de la caja.

## Criterios de compra

Si vas a comprar memoria nueva, estos son los puntos que deciden si el perfil va a funcionar a la primera.

### Que la generación coincida con tu placa

El perfil no cambia la generación. Un kit DDR4 solo sirve en placas DDR4, y uno DDR5 solo en placas DDR5. Si tu procesador es AM5 o un Intel Core Ultra de escritorio de la serie 200, necesitas DDR5. Si tienes una placa AM4 o un Intel anterior con placa DDR4, necesitas DDR4.

### Que tu placa permita perfiles de memoria

La mayoría de las placas actuales permiten cargar XMP o EXPO, pero algunas de gama de entrada o de equipos armados por marcas tienen la BIOS limitada. Antes de pagar por memoria rápida, busca el manual de tu placa y confirma que tiene la opción. Si no la tiene, la memoria funcionará igual, solo que a la velocidad estándar.

### Qué perfil trae el kit

Para una placa AM5, un kit DDR5 con perfil EXPO es lo más cómodo, aunque XMP 3.0 también suele funcionar. Para Intel, busca XMP. En DDR4 el estándar es XMP 2.0, que las placas AMD también aceptan con el nombre que use cada marca.

### Velocidad realista para tu procesador

Con una memoria más rápida de lo que admiten tu procesador o tu placa, puede que el perfil no arranque estable y tengas que bajar un escalón. Revisa las velocidades admitidas en la página oficial de ambos.

### Kit de dos módulos, no módulos sueltos

Los perfiles se prueban con el kit completo. Dos módulos sueltos, aunque sean del mismo modelo, pueden traer chips distintos y no llevarse bien con el perfil. Comprar un kit de dos módulos te da doble canal y más probabilidades de que XMP funcione a la primera.

### Latencia: el otro número de la etiqueta

Junto a la velocidad verás algo como CL16. Es la latencia CAS: cuántos ciclos tarda la memoria en responder. A igual velocidad, un número menor es mejor. El perfil XMP o EXPO aplica esa latencia automáticamente, así que no tienes que configurarla a mano.

## Errores comunes

- **No activar nunca el perfil.** Es el error más frecuente: pagas por 3200 MHz y la memoria trabaja a 2133 o 2400 durante años.
- **Apagar a la fuerza en el primer arranque.** El entrenamiento de memoria puede tardar; interrumpirlo solo complica las cosas.
- **Mezclar módulos distintos y esperar que el perfil funcione.** Con módulos de kits diferentes, la placa puede no arrancar con XMP o EXPO activo.
- **Poner dos módulos en ranuras contiguas.** En placas de cuatro ranuras, el manual indica cuáles usar para el doble canal; casi siempre son la segunda y la cuarta desde el procesador.
- **No actualizar la BIOS.** Si el perfil da problemas, una versión nueva de la BIOS suele mejorar la compatibilidad con memorias, sobre todo en plataformas recientes.

## Qué hacer si la computadora no arranca con XMP

No rompiste nada. Muchas placas vuelven solas a la configuración segura tras varios arranques fallidos. Si la tuya no lo hace, apaga, desconecta la corriente y borra la CMOS con el botón o puente que indique el manual. Luego prueba, en orden:

1. Actualiza la BIOS a la versión más reciente.
2. Revisa que los módulos estén en las ranuras correctas y bien encajados.
3. Si hay un segundo perfil más conservador, pruébalo.
4. Como último recurso, deja el perfil activo pero baja la velocidad un escalón.

## Qué comprar según tu caso

### Si tu placa es DDR4

El kit [Gigastone Game PRO de 32 GB DDR4 3200 CL16](/producto/ram-gigastone-game-pro-32gb-ddr4-3200/) trae dos módulos de 16 GB con perfil XMP 2.0, así que activas los 3200 MHz con una sola opción en la BIOS y trabajas en doble canal desde el primer día. Sirve para placas AM4 e Intel DDR4; en placas AMD el perfil aparece con el nombre que use cada marca. No es compatible con placas DDR5.

### Si vas a armar una PC nueva con DDR5

El [AMD Ryzen 5 9600X](/producto/amd-ryzen-5-9600x/) usa la plataforma AM5, donde los kits DDR5 con perfil EXPO son la opción más directa. Tiene 6 núcleos y 12 hilos con arquitectura Zen 5 y gráficos integrados básicos. El [Intel Core Ultra 5 225F](/producto/intel-core-ultra-5-225f/), con 10 núcleos (6P + 4E), también usa DDR5 y se lleva bien con kits que traen XMP 3.0. Recuerda que la F significa que no tiene video integrado, así que necesitas tarjeta gráfica sí o sí. Ninguno de los dos acepta el kit DDR4 de arriba.

## Para cerrar

Activar XMP o EXPO toma unos minutos y te da la velocidad por la que pagaste. Si todavía no sabes qué generación te conviene, revisa la guía [DDR4 o DDR5: qué memoria RAM comprar](/guias/ddr4-o-ddr5-cual-comprar/) o mira toda la [selección de componentes](/categoria/componentes/).
