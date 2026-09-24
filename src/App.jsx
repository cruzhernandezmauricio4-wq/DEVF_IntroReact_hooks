import React, { useState, useEffect, useMemo } from "react";

function App() {
  const [tareas, setTareas] = useState(() => {
    // Recuperar tareas guardadas en localStorage al iniciar
    const saved = localStorage.getItem("tareas");
    return saved ? JSON.parse(saved) : [];
  });

  const [nuevaTarea, setNuevaTarea] = useState("");
  const [duracion, setDuracion] = useState("");
  const [filtroDuracion, setFiltroDuracion] = useState("");
  const [mostrarRecientes, setMostrarRecientes] = useState(false);

  // Guardar tareas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  // Calcular tiempo total con useMemo
  const calcularTiempoTotal = useMemo(() => {
    return tareas.reduce((total, tarea) => total + tarea.duracion, 0);
  }, [tareas]);

  // Actualizar título de la página con useEffect
  useEffect(() => {
    document.title = `Total: ${calcularTiempoTotal} minutos`;
  }, [calcularTiempoTotal]);

  // Agregar tarea
  const agregarTarea = () => {
    if (nuevaTarea && duracion) {
      const nuevaTareaObj = {
        nombre: nuevaTarea,
        duracion: parseInt(duracion),
        fecha: new Date().toISOString(), // guardar fecha de creación
      };
      setTareas([...tareas, nuevaTareaObj]);
      setNuevaTarea("");
      setDuracion("");
    }
  };

  // Filtrar tareas según duración o recientes
  const tareasFiltradas = useMemo(() => {
    let filtradas = [...tareas];

    if (filtroDuracion) {
      filtradas = filtradas.filter(
        (t) => t.duracion >= parseInt(filtroDuracion)
      );
    }

    if (mostrarRecientes) {
      filtradas = filtradas.slice(-3); // mostrar solo las últimas 3
    }

    return filtradas;
  }, [tareas, filtroDuracion, mostrarRecientes]);

  return (
    <div style={{ fontFamily: "Arial", maxWidth: "500px", margin: "auto" }}>
      <h1>Contador de Tareas</h1>
      <div>
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nombre de la tarea"
        />
        <input
          type="number"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          placeholder="Duración en minutos"
        />
        <button onClick={agregarTarea}>Agregar tarea</button>
      </div>

      <h2>Filtros</h2>
      <div>
        <input
          type="number"
          value={filtroDuracion}
          onChange={(e) => setFiltroDuracion(e.target.value)}
          placeholder="Duración mínima"
        />
        <label>
          <input
            type="checkbox"
            checked={mostrarRecientes}
            onChange={() => setMostrarRecientes(!mostrarRecientes)}
          />
          Mostrar solo recientes
        </label>
      </div>

      <h2>Tareas</h2>
      <ul>
        {tareasFiltradas.map((tarea, index) => (
          <li key={index}>
            {tarea.nombre}: {tarea.duracion} minutos
          </li>
        ))}
      </ul>

      <h3>Total de tiempo: {calcularTiempoTotal} minutos</h3>
    </div>
  );
}

export default App;
