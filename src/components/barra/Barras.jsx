import React, { useState, useEffect } from 'react' 
import { useNavigate } from 'react-router-dom'
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
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    if (!usuario) {
      // si no hay usuario logueado, redirige a login
      navigate('/')
      } else {
    setUsuarioLogueado(usuario); // guardar usuario en el estado
    }
  }, [])
  
    const cerrarSesion = () => {
    localStorage.removeItem('usuario'); // Borra los datos del usuario
    navigate('/', { replace: true }); // Redirige al login
    toast.info('Sesión cerrada');
  };  

  /* ===========================
     CARGA DE TAREAS
  ============================= */

  useEffect(() => {
    const obtenerTareas = async () => {
    try {
      const tareas2 = await getTask()
      const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
      
       if (!usuarioLogueado) {
        toast.error("No hay usuario logueado");
        return;
      }

      const tareasUsuario = tareas2.filter(t => t.idUser === usuarioLogueado.id);
      const pendientes = tareasUsuario.filter(t => !t.completed);
      const completadas = tareasUsuario.filter(t => t.completed);
      
      setTareasPendientes(pendientes);
      setTareasCompletadas(completadas);
      setTareas(tareasUsuario);

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
         const usuario = JSON.parse(localStorage.getItem('usuario'))
      if (!usuario) {
        toast.error("No se encontró usuario en sesión")
        return
      }
        
        const nuevaTarea = { 
          text: textoMayuscula, 
          completed: false,
          idUser: JSON.parse(localStorage.getItem('usuario')).id
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

        <div className='fila1'>

          <h1>Tareas de {usuarioLogueado?.nombre}</h1>
          <button className='cerrarSesion' onClick={cerrarSesion}>Cerrar Sesión</button>

        </div> 

        <div className='fila2'>

          <div className='agregar'>

            <input className="barraTarea" type="text" placeholder='Escribe una tarea' value={value} onChange={e => setValue(e.target.value)} onKeyDown={enterAgregar } />
            <button className="botonAgregar" onClick={agregarTarea}>Agregar tarea</button>

          </div>

          <div className='buscar'>

            <input className="barraBusqueda" type="text" placeholder='Buscar tarea' value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          
          </div>
        
        </div> 

        <div className='fila3'>  

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