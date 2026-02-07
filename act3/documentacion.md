# Backend de Gestion de Pedidos (Actividad 3)

Este proyecto implementa un backend con **Express y Programacion Orientada a Objetos (POO)** para gestionar el ciclo de vida de pedidos, aplicando reglas de negocio estrictas y separacion de responsabilidades.

## 1. Arquitectura y Separacion de Responsabilidades

Se implemento una arquitectura por capas para desacoplar la logica de negocio del acceso a datos, cumpliendo con los principios de Clean Code:

* **Repository (`src/repositories/pedidos_repository.js`):**
  Es una Clase que actua como la unica fuente de verdad para el acceso a datos. Utiliza propiedades privadas (`#pedidos`) para encapsular el array en memoria, protegiendolo de manipulaciones externas directas. Su responsabilidad es estrictamente el almacenamiento y recuperacion de datos (CRUD basico).

* **Controller (`src/controladores/pedidos_controller.js`):**
  Es el responsable de aplicar las **Reglas de Negocio**. Actua como un filtro o "portero"; recibe la peticion, valida si cumple con las condiciones logicas (estado actual, cantidad valida, existencia) y decide si llama al repositorio o devuelve un error HTTP (400/404).

* **Routes (`src/routes/pedidos_routes.js`):**
  Su unica funcion es definir los endpoints y dirigir el trafico hacia el controlador correspondiente. No contienen logica.

## 2. Reglas de Negocio Implementadas

Las reglas viven dentro del **Controller** para proteger la integridad de los datos antes de que lleguen al repositorio.

### A. Creacion de Pedido
* **Regla:** Todo pedido nuevo inicia siempre en estado "pendiente".
* **Implementacion:** El repositorio asigna `estado: "pendiente"` automaticamente al crear el objeto.
* **Validacion:** El controlador verifica que la `cantidad > 0` antes de procesar.

### B. Inmutabilidad de Estados Finales
* **Regla:** Un pedido "confirmado" o "cancelado" NO puede modificarse.
* **Implementacion:** En el metodo `PUT`, antes de actualizar, se verifica el estado actual del pedido:
  ```javascript
  if (pedidoActual.estado !== 'pendiente') {
      return res.status(400).json({ 
          message: "No se puede modificar un pedido en estado " + pedidoActual.estado 
      });
  }

  https://documenter.getpostman.com/view/51906937/2sBXc7LQQG
  