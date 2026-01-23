# Catálogo de Productos - JavaScript Avanzado

Este proyecto es una aplicación web Frontend desarrollada con **Vanilla JavaScript** (sin frameworks) que consume la API pública de [FakeStoreAPI](https://fakestoreapi.com/). 

El objetivo principal es demostrar el dominio de conceptos modernos de ES6+, manipulación del DOM y manejo de asincronía.

##  Datos del Alumno
* **Nombre:** Juan Esteban Campos Cruz
* **Universidad:** Universidad Tecmilenio
* **Materia:** Desarrollo FullStack
* **Fecha:** 23 de Enero 2026

##  Características Técnicas (Justificación)

Para cumplir con los requerimientos de optimización y buenas prácticas, se implementaron las siguientes estructuras y lógicas:

### 1. Mapa de Productos (`Map`)
* **Implementación:** Se almacenan todos los productos en un `new Map()` usando el `id` del producto como clave.
* **Por qué:** Para optimizar la búsqueda. Cuando el usuario hace clic en "Ver Detalles", recuperar el producto desde un Map es instantáneo (complejidad O(1)), mientras que buscar en un Array requeriría recorrer la lista (complejidad O(n)).

### 2. Manejo de Categorías Únicas (`Set`)
* **Implementación:** `new Set()` al recorrer los productos.
* **Por qué:** La API devuelve categorías repetidas. El `Set` elimina automáticamente los duplicados, permitiendo generar un menú de filtros limpio sin necesidad de lógica extra de validación.

### 3. Asincronía (`Async / Await`)
* **Implementación:** Función `iniciar()` y `obtenerProductos()`.
* **Por qué:** JavaScript es monohilo. Usamos `async/await` para esperar la respuesta del servidor antes de intentar renderizar la interfaz, evitando errores de datos nulos y mejorando la legibilidad respecto a las promesas tradicionales (`.then`).

### 4. Operador de Propagación (`Spread Operator`)
* **Implementación:** `["Todos", ...setCategorias]`.
* **Por qué:** El `Set` no es un arreglo iterable directamente por métodos de renderizado. Usamos `...` para "esparcir" los valores del Set dentro de un nuevo Array y agregar manualmente la opción "Todos" al inicio.

### 5. Destructuring
* **Implementación:** `const { title, price, image } = producto`.
* **Por qué:** Permite extraer las propiedades del objeto JSON directamente a variables, haciendo el código más limpio y fácil de leer, evitando repeticiones como `producto.title`, `producto.price`, etc.

## Tecnologías Usadas
* **HTML5 Semántico:** Uso de etiquetas `<main>`, `<section>`, `<article>` para mejor estructura y SEO.
* **CSS3:** Diseño responsivo (Grid Layout) y modo oscuro estilo "Apple Dark".
* **JavaScript (ES6+):** Módulos (`import/export`), Fetch API, Arrow Functions.

