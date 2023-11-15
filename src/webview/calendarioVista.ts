// calendario.ts
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendario");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid'],
        events: [
            // Aquí debes cargar dinámicamente las fechas de las tareas creadas
            // Ejemplo: { title: 'Tarea 1', start: '2023-11-15' },
            // Puedes obtener las fechas de tus tareas desde tu gestor de tareas
        ],
    });

    calendar.render();
});

//Si no funciona cambiar a TS