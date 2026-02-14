# Actividad: Busqueda Avanzada, Filtrado y Paginacion en Backend

Este repositorio contiene la extension del backend para el sistema de gestion de inventario. El objetivo principal es implementar un endpoint de busqueda avanzada que integre filtros dinamicos, proteccion contra inyeccion SQL y paginacion real.

## 1. Justificacion de la Arquitectura

Siguiendo los estandares de orden y limpieza vistos en clase, el proyecto mantiene una arquitectura de capas clara:

* **Patron MVC (Modelo-Vista-Controlador):** Se utilizo para separar la definicion de los puntos de acceso (Rutas), la gestion de la logica y codigos de estado (Controlador) y la interaccion con la base de datos (Repositorio). Esto facilita el mantenimiento y escalabilidad.
* **Patron Repository:** Siguiendo el ejemplo de clase donde aislamos los datos en arreglos o mapas, aqui el repositorio actua como el "dueño" de las consultas SQL, asegurando que el controlador no conozca detalles internos de la base de datos PostgreSQL.
* **Capa de Dominio (Validaciones):** Se implemento la logica de "Fail Fast" (Fallo Rapido) vista en clase. Antes de intentar cualquier operacion costosa en la base de datos, los datos pasan por `validarProducto` para asegurar que cumplen con los requisitos de negocio (nombres validos y precios positivos).



## 2. Implementacion Tecnica y Aprendizajes

### Construccion de Query Dinamica (Filtros Opcionales)
A diferencia de los CRUD basicos donde las consultas son estaticas, aqui se implemento una logica de construccion dinamica.
* **Justificacion:** En una aplicacion real, el usuario puede querer filtrar solo por nombre, solo por precio, o por ambos. 
* **Solucion:** Se utilizo un arreglo de filtros y un contador de indices dinamico (`indice++`). Esto permite que el sistema genere el `WHERE` adecuado (`AND`) solo para los campos que el usuario envia en la URL (query params).

### Seguridad Proactiva (Prevencion de SQL Injection)
Retomando las pruebas de base de datos vistas en clase donde usamos `ILIKE $1`, se extendio este concepto a multiples parametros.
* **Tecnica:** Se prohibio la concatenacion de strings (`+` o `${}`). En su lugar, se usaron parametros posicionales ($1, $2, etc.).
* **Resultado:** El driver de PostgreSQL sanea los valores automaticamente, tratando cualquier intento de inyeccion de codigo malicioso como simple texto plano.



### Logica de Paginacion Real
Se paso de una visualizacion simple a una paginacion profesional a nivel de servidor utilizando `LIMIT` y `OFFSET`.
* **LIMIT:** Se baso en el comando `limit` visto en los scripts iniciales de clase para controlar la cantidad de registros.
* **OFFSET:** Se añadio para permitir el "salto" de registros segun la pagina solicitada.
* **Doble Consulta:** Se implemento una consulta secundaria con `COUNT(*)` para obtener el total de registros. Esto es fundamental para que el frontend sepa cuantas paginas existen en total, un estandar en aplicaciones de inventario profesionales.



## 3. Guia de Uso de Endpoints

El nuevo endpoint avanzado es `GET /productos/search`. A continuacion se detallan los parametros aprendidos para su consumo:

* `nombre`: Busqueda parcial (ILIKE) para coincidencias en el nombre.
* `minPrecio` / `maxPrecio`: Filtros numericos para rangos comerciales.
* `page` (Pagina actual) y `limit` (Resultados por pagina): Control de navegacion.

---

## 4 URL for published documentation
https://documenter.getpostman.com/view/51906937/2sBXcBnhaF


## Datos del Alumno
* **Nombre:** Juan Esteban Campos Cruz
* **Materia:** Desarrollo FullStack
* **Institucion:** Universidad Tecmilenio