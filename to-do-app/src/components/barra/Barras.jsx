import React, { useState} from 'react' 

import './Barras.css'

import { postTask } from '../../services/servicesTask'

function Barras() {
  const [value, setValue] = useState('')

  const agregarTarea  = async () => {
    const texto = value.trim()
    if (!texto) {
       toast.error('Ingrese un texto')
      return
    }

    try {
      const nuevaTarea = { text: texto, completed: false } 
      await postTask(nuevaTarea)
      setValue('') 
      toast.success('Tarea agregada')
    } catch (error) {
      console.error('Error al agregar tarea', error)
    }
  }

  const enterAgregar  = (e) => {
    if (e.key === 'Enter') agregarTarea()
  }


  return (
    <div>

      <div className='barras'>
        
        <h1 className='titulo'>Tareas por hacer</h1>

          <div className='fila2'>

            <input className="barraTarea" type="text" placeholder='Escribe una tarea' value={value} onChange={e => setValue(e.target.value)} onKeyDown={enterAgregar } />
            <button className="botonAgregar" onClick={agregarTarea}>Agregar tarea</button>

          </div>

          <div className='buscar'>

            <input className="barraBusqueda" type="text" placeholder='Buscar tarea' />
            <button className="botonBuscar">🔎</button>
            
            
            <div className='contador'>

              <h3>Tareas Completadas</h3>
              <h3>0</h3>

            </div>
        </div>
    </div>
  </div>
  )
}

export default Barras