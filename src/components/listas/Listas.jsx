import React, { useState, useEffect } from 'react'

import './Listas.css'
import { toast } from 'react-toastify'
import { putTask, patchTask, deleteTask } from '../../services/servicesTask'

function Listas({ tareasPendientes, tareasCompletadas, setTareasPendientes, setTareasCompletadas, tareas, setTareas }) {


  /* ===========================
     COMPLETAR O VOLVER A PENDIENTE
  ============================= */

  const completarTarea = async (id) => {
  try {
    
    const tareaPendiente = tareasPendientes.find(t => t.id === id);
    const tareaCompletada = tareasCompletadas.find(t => t.id === id);

    let nuevaTarea;

    if (tareaPendiente) {
      //Si está en pendientes pasar a completadas
      nuevaTarea = { ...tareaPendiente, completed: true };
      setTareasPendientes(tareasPendientes.filter(t => t.id !== id));
      setTareasCompletadas([...tareasCompletadas, nuevaTarea]);
    } else if (tareaCompletada) {
      //Si está en completadas volver a pendientes
      nuevaTarea = { ...tareaCompletada, completed: false };
      setTareasCompletadas(tareasCompletadas.filter(t => t.id !== id));
      setTareasPendientes([...tareasPendientes, nuevaTarea]);
    } else {

      return;
    }
    // Actualizar lista completa
    const nuevasTareas = tareas.map(t => t.id === id ? nuevaTarea : t);
    setTareas(nuevasTareas);
    // Actualizar backend
    await putTask(nuevaTarea, id);

  } catch (error) {
    console.error("Error al completar la tarea", error);
  }
};

  /* ===========================
     EDITAR TAREA
  ============================= */  

  const editarTarea = async (id) => {
  const tareaActual = tareasPendientes.find(t => t.id === id) || tareasCompletadas.find(t => t.id === id);

  const nuevoTexto = prompt("Edita la tarea:", tareaActual?.text || "");

  if (!nuevoTexto || nuevoTexto.trim() === "") {
    toast.error("El texto no puede estar vacío");
    return;
  }

  const textoMayuscula = nuevoTexto.trim().charAt(0).toUpperCase() + nuevoTexto.trim().slice(1).toLowerCase();
  const tareaExiste = [...tareasPendientes, ...tareasCompletadas].some(t => t.id !== id && t.text.toLowerCase() === textoMayuscula.toLowerCase());

  if (tareaExiste) {
      toast.error("Ya existe otra tarea con ese nombre");
      return;
  }

  try {
    const tareaEditada = { text: textoMayuscula };
    const tareaActualizada = await patchTask(tareaEditada, id);

    // Actualizar en pendientes
    setTareasPendientes(prev =>
      prev.map(t => t.id === id ? { ...t, ...tareaActualizada } : t)
    );

    // Actualizar en completadas
    setTareasCompletadas(prev =>
      prev.map(t => t.id === id ? { ...t, ...tareaActualizada } : t)
    );

    // Actualizar en la lista general
    setTareas(prev =>
      prev.map(t => t.id === id ? { ...t, ...tareaActualizada } : t)
    );

    toast.success("Tarea editada correctamente");

  } catch (error) {
    console.error("Error al editar tarea", error);
    toast.error("No se pudo editar la tarea");
  }
};

  /* ===========================
     ELIMINAR TAREA
  ============================= */

const eliminarTarea = async (id) => {
  const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
  if (!confirmar) return;

  try {
    await deleteTask(id);

    // Actualizar listas locales
    setTareasPendientes(prev => prev.filter(t => t.id !== id));
    setTareasCompletadas(prev => prev.filter(t => t.id !== id));
    setTareas(prev => prev.filter(t => t.id !== id));

    toast.success("Tarea eliminada correctamente");
  } catch (error) {
    toast.error("No se pudo eliminar la tarea");
  }
};
  return (

    <div>

      <div className='contenedorListas'>

        <div className="pendientes">

          <h3>⏳Tareas Pendientes</h3>

          {tareasPendientes.length === 0 ? (
            <p>No existen tareas pendientes</p>) : 
            (tareasPendientes.map((tarea) => (
              <div key={tarea.id} className="filaTarea">
                <input type="checkbox"  checked={tarea.completed} onChange={() => completarTarea(tarea.id)} />
                <span>{tarea.text}</span>
                <button className="botonEditar" onClick={() => editarTarea(tarea.id)}>✏️</button>
                <button className="botonEliminar" onClick={() => eliminarTarea(tarea.id)}>🗑️</button>
              </div>
            ))
        )}
        </div>

        <div className="completadas">

          <h3>✅Tareas Completadas</h3>

          {tareasCompletadas.length === 0 ? (
            <p>No existen tareas completadas</p>) : 
            (tareasCompletadas.map((tarea) => (
              <div key={tarea.id} className="filaTarea">
                <input
                  type="checkbox" checked={tarea.completed} onChange={() => completarTarea(tarea.id)} />
                <span>{tarea.text}</span>
                <button className="botonEditar" onClick={() => editarTarea(tarea.id)}>✏️</button>
                <button className="botonEliminar" onClick={() => eliminarTarea(tarea.id)}>🗑️</button>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  )
}

export default Listas