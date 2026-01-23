export const obtenerProductos = async () => {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products");
        
        if (!respuesta.ok) {
            throw new Error("Error en la petición");
        }
        
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.log(error);
        return [];
    }
};