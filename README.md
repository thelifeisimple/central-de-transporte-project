# Proyecto QA Automation — E2E (Playwright/POM) + API (SWAPI)

Suite de testing automatizado que combina:
- **Tests E2E** sobre un sitio de venta de pasajes (formulario de búsqueda origen/destino, fechas, pasajeros) usando **Playwright** con patrón **Page Object Model (POM)**.
- **Tests de API** contra **SWAPI** (Star Wars API), con un cliente HTTP propio y schemas de validación de respuesta por recurso (films, people, planets).

> ⚠️ Nota: varios archivos del repo (`swapiClient.ts`, `basPage.ts`, `resultsPages.ts`, `logger.ts`, `results_assertions.ts`, `search_assertions.ts`, `testData.ts`, `people_schema.ts`, `planets_schema.ts`) están actualmente vacíos — son el scaffolding previsto para la arquitectura descrita abajo. Este README documenta la estructura **objetivo** del proyecto y sirve como guía de implementación.

---

## 1. Instrucciones de uso

### Requisitos previos
- Node.js 18+
- npm o yarn

### Instalación

```bash
npm install
npx playwright install --with-deps
```

### Estructura de carpetas (propuesta)

```
/
├── src/
│   ├── pages/
│   │   ├── basePage.ts          # Page Object base (wrappers comunes de Playwright)
│   │   ├── searchPages.ts       # Page Object del formulario de búsqueda
│   │   └── resultsPages.ts      # Page Object de la página de resultados
│   ├── api/
│   │   └── swapiClient.ts       # Cliente HTTP para SWAPI (fetch/axios wrapper)
│   ├── schemas/
│   │   ├── films.schema.ts      # Validación de shape de /films
│   │   ├── people.schema.ts     # Validación de shape de /people
│   │   └── planets.schema.ts    # Validación de shape de /planets
│   ├── utils/
│   │   ├── logger.ts            # Logger centralizado
│   │   └── test-data/
│   │       ├── searchData.ts    # Fixtures de datos para el buscador (ciudades, labels)
│   │       ├── testData.ts      # Fixtures generales
│   │       └── jsons.json       # Fixtures/mocks de respuestas de API
│   └── assertions/
│       ├── search.assertions.ts   # Aserciones custom del flujo de búsqueda
│       └── results.assertions.ts  # Aserciones custom de resultados
├── tests/
│   ├── e2e/
│   └── api/
├── playwright.config.ts
└── README.md
```

### Correr los tests

```bash
# Todos los tests
npm run playwright test

# un test en especifico para debug se agrega .only
npm run playwright test:debug 

#un test para verlo headed
npm run playwright test:headed

# Solo E2E
npx playwright test --project=ui

# Solo API
npx playwright test --project=api

# Con UI mode (debug)
npm run test:ui

# Un archivo puntual
npx playwright test tests/e2e/search.spec.ts
```

### Ver el reporte

```bash
npx playwright show-report
```

---

## 2. Arquitectura

### 2.1 Page Object Model (E2E)

- **`basePage.ts`**: clase base con métodos comunes reutilizables (navegación, esperas, screenshots) que las demás Page Objects extienden.
- **`searchPages.ts`**: encapsula todos los locators y acciones del formulario de búsqueda (origen, destino, fechas, tipo de viaje, pasajeros, botón "Buscar"). Los textos usados en los `getByRole` se resuelven contra `searchData.ts`, evitando strings hardcodeados dispersos por el código.
- **`resultsPages.ts`**: encapsula locators/acciones de la página de resultados de búsqueda (listado de pasajes, filtros, selección de un resultado).
- **`search.assertions.ts` / `results.assertions.ts`**: aserciones de dominio (ej. `expect(searchPage).toHaveOrigenSeleccionado(ciudad)`), separadas de los Page Objects para que estos últimos solo tengan responsabilidad de interacción, no de verificación.

### 2.2 Cliente API (SWAPI)

- **`swapiClient.ts`**: wrapper fino sobre `fetch`/`axios` con métodos por recurso (`getFilms()`, `getPeople(id)`, `getPlanets(id)`, etc.), manejo centralizado de errores HTTP y headers.
- **`*_schema.ts`**: schemas (tipo Zod/JSON Schema) que validan el *shape* de cada respuesta, desacoplando la validación estructural de las aserciones de negocio en los tests.
- **`jsons.json`**: fixtures estáticos usados para mockear respuestas o comparar contra datos esperados (ej. paginación de `search_films`).

### 2.3 Datos de test

- Los datos (`searchData.ts`, `testData.ts`) están separados del código de interacción para que un cambio de copy/UI en el sitio no obligue a tocar los Page Objects.

### 2.4 Logging

- **`logger.ts`**: logger centralizado (nivel info/warn/error) usado tanto en hooks de Playwright como en el cliente API, para tener trazabilidad uniforme en CI.

---

## 3. Decisiones técnicas

| Decisión | Justificación |
|---|---|
| **TypeScript** en todo el proyecto | Tipado fuerte para locators, fixtures y responses de API; evita errores de "propiedad no existe" en tiempo de ejecución. |
| **POM con `basePage`** | Evita duplicar boilerplate de Playwright (waits, navegación) en cada Page Object. |
| **Separación de `assertions` de `pages`** | Los Page Objects solo interactúan con la UI; las aserciones viven aparte para poder reusarlas entre distintos specs sin acoplarlas a una sola página. |
| **`test-data` desacoplado del código** | Cambios de copy (labels, ciudades) no requieren tocar lógica de test. |
| **Schemas de validación por recurso de API** | Permite detectar breaking changes de contrato de SWAPI independientemente de si el dato de negocio es "correcto". |
| **Cliente API propio (`swapiClient`)** | Un único punto de mantenimiento para baseURL, headers, reintentos y manejo de errores HTTP. |

---

## 4. Preguntas teóricas

### 1. Escalabilidad — de la suite actual a 500 tests

- **Paralelización real**: configurar `workers` y sharding (`--shard=1/4`) en CI para correr la suite en paralelo entre varios runners.
- **Tagging/organización por dominio**: agrupar specs por feature (`@search`, `@results`, `@api`) usando `test.describe` + tags de Playwright, para poder correr subconjuntos (smoke, regression, API-only) sin ejecutar todo.
- **Fixtures de Playwright** en vez de instanciar Page Objects a mano en cada test, para reducir boilerplate y centralizar el setup/teardown.
- **Separar API tests de E2E** en proyectos (`projects` en `playwright.config.ts`) con distinta config (timeouts, retries, browser vs sin browser), porque los API tests no necesitan levantar un navegador.
- **Data-driven tests**: reemplazar tests casi idénticos con distintos inputs por `test.each`/loops sobre fixtures, para no multiplicar archivos.
- **Aislar el estado**: asegurar que cada test sea independiente (no dependa del orden ni de datos creados por otro test), clave para que el sharding funcione bien.
- **Monitoreo de duración de la suite**: si empieza a superar cierto umbral en CI, revisar tests lentos candidatos a mockear (por ejemplo, reemplazar llamadas reales a SWAPI por fixtures en `jsons.json` cuando el objetivo no sea probar la integración real).
- **Convenciones de naming y linting** (ESLint + reglas específicas de Playwright) para que 500 tests mantengan un estilo consistente entre distintos autores.

### 2. Flakiness

Antes de marcar un test como `skip`, diagnóstico en este orden:

1. **Reproducir localmente** varias veces (`--repeat-each=10`) para confirmar que es intermitente y no un fallo determinístico disfrazado.
2. **Revisar el trace/video/screenshot** que genera Playwright (`trace: 'on-first-retry'`) para ver el estado real del DOM en el momento del fallo.
3. **Buscar condiciones de carrera**: waits implícitos vs explícitos, animaciones, requests de red que no terminaron (ej. el `select2` de origen/destino, que depende de un dropdown async), timers/debounce.
4. **Revisar si depende de datos compartidos** o de orden de ejecución con otros tests (estado no aislado).
5. **Revisar el entorno**: ¿falla solo en CI? Puede ser un tema de recursos (CPU/memoria), red, o timing distinto al local.

Opciones antes de skipear:
- Reemplazar `waitForTimeout` por `waitFor` sobre el estado real (locator visible/habilitado, response de red esperada).
- Usar `expect.poll` o auto-retrying assertions en vez de asserts únicos.
- Aislar el test (mockear la red si la causa es un servicio externo inestable).
- Marcarlo como flaky conocido (`test.fixme` o anotación) con un ticket asociado y fecha, en vez de un `skip` silencioso que se olvida para siempre.
- Solo como último recurso, y con el ticket de causa raíz abierto, subir el `retries` puntual para ese test (no global) mientras se investiga.

`skip` sin investigar es la peor opción: esconde un problema real (de producto o de test) y erosiona la confianza en la suite.

### 3. POM — cambio de selector del botón "Buscar"

Con la estructura actual, **un solo archivo**: `searchPages.ts`, donde vive el locator `botonBuscar` (`page.getByRole('button', { name: 'Buscar' })`).

Justificación: ese es justamente el valor de POM — el selector está encapsulado en un único lugar, y todos los tests/assertions que interactúan con el botón lo hacen a través del método público `buscarPasaje()`, no referenciando el selector directamente. Si el cambio es solo de selector (no de comportamiento), ningún test debería tocarse.

La única excepción sería si el nombre accesible del botón cambia y ese mismo texto está hardcodeado también en `testData.ts`/`searchData.ts` (por ejemplo si en algún momento se reusa el label "Buscar" como dato de test) — en ese caso también habría que actualizar ese archivo de datos.

### 4. AI assistant — uso responsable

Antes de mergear un test generado por IA que pasa al primer intento, reviso:

- **Que falle cuando tiene que fallar**: rompo la funcionalidad a propósito (o comento una validación) y confirmo que el test efectivamente detecta el fallo. Un test que "pasa a la primera" y nunca fue visto fallar es sospechoso — puede estar testeando el mock, no el comportamiento real, o tener un assert trivial (`expect(true).toBe(true)`, o un locator demasiado laxo).
- **Que los selectors sean robustos y no frágiles** (evitar XPaths absolutos, IDs auto-generados, `nth()` innecesarios).
- **Que no dependa de esperas mágicas** (`waitForTimeout` fijo) en vez de esperar estado real.
- **Que las aserciones sean específicas al caso de negocio**, no genéricas ("el elemento existe") cuando el objetivo era validar un valor concreto.
- **Que no haya datos sensibles o hardcodeados** que deberían venir de fixtures/env vars.
- **Que siga las convenciones del proyecto** (POM, ubicación de archivos, naming) y no reimplemente lógica que ya existe en `basePage` o en `assertions`.

**Caso donde decidí NO usar el asistente**: al definir los *schemas de validación* de las respuestas de SWAPI (`films_schema.ts`, `people_schema.ts`, `planets_schema.ts`), preferí escribirlos a mano leyendo la documentación real de la API y probando contra respuestas reales, en vez de pedirle al asistente que "adivinara" el schema a partir de un solo ejemplo de JSON. El riesgo era que generara un schema sobreajustado a ese único caso (por ejemplo, marcando como `required` un campo que en realidad es opcional, o asumiendo un tipo que solo aplica a ese registro puntual), lo cual me hubiera dado falsos negativos en producción — tests verdes con un contrato de API mal modelado.

### 5. Criterio del rol — responsabilidad no delegable de un QA Senior

Lo que un asistente de IA no puede reemplazar es el **criterio de qué vale la pena testear y por qué**, es decir:

- **Definir la estrategia de testing**: qué se automatiza, qué queda manual/exploratorio, qué nivel de la pirámide (unit/API/E2E) es el correcto para cada riesgo. Un asistente puede generar un test si se lo pedís, pero no decide que "el flujo de ida y vuelta con pasajeros discapacitados es más riesgoso de negocio que el de solo ida" — eso requiere entender el producto y al usuario real.
- **Identificar riesgo de negocio real**, no solo cobertura de código. Ejemplo concreto: decidir que hay que agregar un test específico para el caso "origen = destino" en el buscador de pasajes porque en producción eso generó una venta inválida, algo que ningún generador automático va a inferir sin ese contexto de incidente real.
- **Juzgar la severidad de un bug encontrado** y decidir si bloquea un release, en base a impacto de negocio, no solo a que "el test está en rojo".
- **Diseñar la arquitectura del framework** (cómo se organiza POM, qué se mockea, qué corre en cada etapa de CI) en función de cómo va a escalar el equipo y el producto.
- **Revisar y aprobar** el código que el asistente genera, con responsabilidad final sobre lo que se mergea.

### 6. CI/CD — fallos recurrentes cada lunes 15:00 por red

1. **No descartar la corrida sin investigar primero**: un patrón tan específico (mismo día, misma hora) es información valiosa — probablemente coincide con un job de mantenimiento, backup, o pico de carga en el ambiente de test/staging.
2. **Alertar al equipo de infraestructura/DevOps** con el patrón detectado (día/hora + logs de red) para que investiguen la causa raíz en el ambiente. La suite de tests es el síntoma, no la causa.
3. **Retries acotados y específicos**, no un `retries` global alto: agregar reintentos solo a nivel de request de red (o del test que efectivamente depende del ambiente inestable) con backoff, documentando por qué existen.
4. **Alertar en el pipeline, pero no bloquear el merge** si se confirma que es un problema conocido y transitorio del ambiente (no del código) — por ejemplo, marcando esa corrida como "infra failure" en el reporte en vez de "test failure", para no perder confianza en la suite ni entrenar al equipo a ignorar rojos.
5. **Evaluar mover ese job de CI** fuera de la ventana horaria conflictiva si el mantenimiento de infra es fijo y no se puede resolver del lado de la app.
6. Si después de todo esto el problema persiste y es real e inevitable (ej. mantenimiento programado de un proveedor externo), documentarlo formalmente y pausar la ejecución automática en esa ventana específica — nunca ignorar el fallo silenciosamente.

---

## 5. Uso de asistente de IA + MCPs

Sugiero usar el MCPS de Grafa K6 actualmente no usado en el proyecto

### Qué se usó IA para
- Generar el scaffolding inicial de carpetas y convenciones de naming del proyecto.
- Sugerir la estructura de Page Objects (`basePage` → `searchPages`/`resultsPages`) siguiendo el patrón POM.
- Redactar boilerplate repetitivo (constructores de Page Objects, wrappers de locators) que luego se revisó y ajustó a mano contra el sitio real.
- Documentación

### Qué NO se delegó a IA
- La definición de los schemas de validación de la API SWAPI (ver pregunta 4), por el riesgo de sobreajuste a un único ejemplo.
- La decisión de qué escenarios de negocio ameritan un test (criterio de riesgo, ver pregunta 5).
- La revisión final y aprobación de cualquier test antes de mergear — siempre validado manualmente contra el sitio/API real, no solo "test en verde".

### MCPs (Model Context Protocol)
 MCP de Playwright para inspección de selectors en vivo.

Para cada MCP usado se recomienda documentar:
- **Nombre/herramienta**: `playwright-mcp`.
- **Para qué se usó**: inspeccionar el DOM real del formulario de búsqueda y confirmar el `role`/`name` accesible del botón "Buscar" antes de escribirlo en `searchPages.ts`.
- **Verificación posterior**: a partir de corridas se confirmó que lo que devolvió el MCP era viable o no y necesitaba ajustes.