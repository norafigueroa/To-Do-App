import React, { useState, useEffect } from 'react' 
import './Barras.css'
import { postTask, getTask, putTask, patchTask, deleteTask } from '../../services/servicesTask'
import Listas from '../listas/Listas'
import { toast } from 'react-toastify'

function Barras() {
  const [value, setValue] = useState('')
  const [tareas, setTareas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [tareasPendientes, setTareasPendientes] = useState([])
  const [tareasCompletadas, setTareasCompletadas] = useState([]) 

  /* ===========================
     CARGA DE TAREAS
  ============================= */

  useEffect(() => {
    const obtenerTareas = async () => {
    try {
      const tareas2 = await getTask() 
      const pendientes = tareas2.filter(t => !t.completed);
      const completadas = tareas2.filter(t => t.completed);
      setTareasPendientes(pendientes);
      setTareasCompletadas(completadas);
      setTareas(tareas2);
    } catch (error) {
      console.error('Error al obtener tareas', error)
    }
  }

    obtenerTareas()
  }, [])

  /* ===========================
     AGREGAR TAREA
  ============================= */

  const agregarTarea  = async () => {
    const texto = value.trim()
    if (!texto) {
       toast.error('Ingrese un texto')
      return
    }

    const textoMayuscula  = texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
    const tareaExiste = [...tareasPendientes, ...tareasCompletadas].some(t => t.text.toLowerCase() === texto.toLowerCase());

      if (tareaExiste) {
          toast.error('Ya existe una tarea con ese nombre');
          setValue('');
          return;
      }
      try {
        const nuevaTarea = { 
          text: textoMayuscula, 
          completed: false
        } 

        const tareaRespuesta = await postTask(nuevaTarea)
          setValue('') 
          setTareasPendientes([...tareasPendientes, tareaRespuesta]); 
          setTareas([...tareas, tareaRespuesta]);
          toast.success('Tarea agregada')
      } catch (error) {
          console.error('Error al agregar tarea', error)
        }
  }

  /* ===========================
    AGREGAR TAREA CON ENTER
  ============================= */

  const enterAgregar  = (e) => {
    if (e.key === 'Enter') agregarTarea()
  }

  /* ===========================
     HTML
  ============================= */

  return (
    <div>

      <div className='barras'>
        
        <h1 className='titulo'>Mis Tareas</h1>

          <div className='fila2'>

            <input className="barraTarea" type="text" placeholder='Escribe una tarea' value={value} onChange={e => setValue(e.target.value)} onKeyDown={enterAgregar } />
            <button className="botonAgregar" onClick={agregarTarea}>Agregar tarea</button>

          </div>

          <div className='buscar'>

            <input className="barraBusqueda" type="text" placeholder='Buscar tarea' value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            
            <div className='contador'>

              <h3>Tareas Completadas</h3>
              <h3>{tareas.filter(tarea => tarea.completed).length}</h3>

            </div>
        </div>
    </div>

  {/* ===========================
     RENDERIZADO DE LISTAS
     ============================= */}

    <Listas
      tareasPendientes={tareasPendientes.filter(t => t.text.toLowerCase().includes(busqueda.toLowerCase()))} 
      tareasCompletadas={tareasCompletadas.filter(t => t.text.toLowerCase().includes(busqueda.toLowerCase()))}
      setTareasPendientes = {setTareasPendientes} setTareasCompletadas = {setTareasCompletadas}
      tareas = {tareas} setTareas = {setTareas}
    />
  </div>
  )
}

export default Barras