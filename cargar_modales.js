// cargar_modales.js
document.addEventListener("DOMContentLoaded", () => {
    fetch('modales.html')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar los modales');
            return response.text();
        })
        .then(html => {
            // Se inserta el HTML de los modales directamente en el body
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(error => console.error('Error cargando modales:', error));
});