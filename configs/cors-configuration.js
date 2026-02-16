const corsOption = {
    // Permite que cualquier origen acceda a la API
    origin: true,
    // Permite que la API envie y reciba cookies
    credentials: true,
    // Establece los métodos permitidos en la API
    method: "GET, POST, PUT, DELETE",
    // Define los headers que el cliente pueda enviar
    allowedHeaders: "Content-Type, Authorization"
}

export { corsOption }