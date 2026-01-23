import { obtenerProductos } from './api.js';


const listaProductos = document.querySelector("#lista-productos");
const contenedorFiltros = document.querySelector("#filtros-categorias");
const seccionDetalle = document.querySelector("#detalle-producto");
const infoDetalle = document.querySelector("#info-detalle");
const botonCerrar = document.querySelector("#cerrar-detalle");

// 1. Uso de MAP: Guardaremos los productos usando su ID como clave para acceso rápido
const mapaProductos = new Map();


const iniciar = async () => {
   
    const productos = await obtenerProductos();

    if (productos.length > 0) {
        listaProductos.innerHTML = ""; 

        
        const setCategorias = new Set();

        productos.forEach((producto) => {
           
            mapaProductos.set(producto.id, producto);
            
            
            setCategorias.add(producto.category);
            
          
            renderizarTarjeta(producto);
        });

        
        renderizarFiltros(setCategorias);
    } else {
        listaProductos.innerHTML = "<p>No se pudieron cargar los productos.</p>";
    }
};


const renderizarTarjeta = (producto) => {
    // 3. Destructuring: Extraemos las propiedades del objeto producto
    
    const { id, title, price, image, category } = producto;

    const articulo = document.createElement("article");
    articulo.classList.add("card");
    
    // HTML interno de la tarjeta
    articulo.innerHTML = `
        <img src="${image}" alt="${title}" loading="lazy">
        <div class="cuerpo-tarjeta">
            <h3>${title}</h3>
            <p class="category">${category}</p>
            <p class="price">$${price}</p>
            <button class="btn-detail" data-id="${id}">Ver Detalles</button>
        </div>
    `;

    listaProductos.appendChild(articulo);
};


const renderizarFiltros = (setCategorias) => {
    
    const arrayCategorias = ["Todos", ...setCategorias];

    arrayCategorias.forEach(cat => {
        const boton = document.createElement("button");
        boton.textContent = cat.toUpperCase(); 
        
       
        boton.addEventListener("click", () => filtrarProductos(cat));
        
        contenedorFiltros.appendChild(boton);
    });
};


const filtrarProductos = (categoriaSeleccionada) => {
    listaProductos.innerHTML = ""; 
    
    if (categoriaSeleccionada === "Todos") {
        
        mapaProductos.forEach(valor => renderizarTarjeta(valor));
    } else {
        
        mapaProductos.forEach(valor => {
            if (valor.category === categoriaSeleccionada) {
                renderizarTarjeta(valor);
            }
        });
    }
};

// Delegación de eventos 
listaProductos.addEventListener("click", (e) => {
   
    if (e.target.tagName === "BUTTON" && e.target.classList.contains("btn-detail")) {
        const id = parseInt(e.target.dataset.id); // Obtenemos el ID guardado en el botón
        mostrarDetalle(id);
    }
});

const mostrarDetalle = (id) => {
    // Recuperamos el objeto directamente del MAP (Eficiencia)
    const producto = mapaProductos.get(id); 

    if (producto) {
        const { title, description, image, price } = producto;
        
        infoDetalle.innerHTML = `
            <h2>${title}</h2>
            <img src="${image}" alt="${title}" style="max-width: 150px;">
            <p>${description}</p>
            <p class="price-big">Precio: $${price}</p>
        `;
       
        seccionDetalle.classList.remove("hide");
    }
};


botonCerrar.addEventListener("click", () => {
    seccionDetalle.classList.add("hide");
});


iniciar();