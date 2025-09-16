import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './InicioSesion.css'
import { toast } from 'react-toastify'
import { getUsers } from '../../services/servicesUser';

function InicioSesion() {

  const navigate = useNavigate();

  // Estados para inputs
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Función para manejar login
  const manejarLogin = async () => {
    // Validar campos vacíos
    if (!correo.trim() || !contrasena.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      const usuarios = await getUsers();
      const usuarioEncontrado = usuarios.find(
        (u) =>
          u.correo.toLowerCase() === correo.trim().toLowerCase() &&
          u.contrasena === contrasena.trim()
      );

      if (usuarioEncontrado) {
        // Guardar datos esenciales en localStorage
        localStorage.setItem('usuario', JSON.stringify({
          id: usuarioEncontrado.id,
          nombre: usuarioEncontrado.nombre,
          correo: usuarioEncontrado.correo
        }));

        toast.success('Inicio de sesión exitoso');
        navigate('/Home'); // Redirigir a la página principal de la app
      } else {
        toast.error('Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al verificar usuarios', error);
      toast.error('No se pudo iniciar sesión');
    }
  };



  return (
    <div>
        <div className='contenedorLogin'>

          <div className='tarjetaLogin'>

            <h2>Inicio de Sesión</h2>

            <label htmlFor="correo">Correo:</label>
            <input type="email" id='correo' className='correo' placeholder="ej: juan@gmail.com" value={correo} onChange={(e) => setCorreo(e.target.value)}/>
            <br /><br />

            <label htmlFor="contrasena">Contraseña:</label>
            <input type="password" id='contrasena' className='contrasena' placeholder="Ingrese tu contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)}/>
            <br /><br />
            
            <button className="ingresar" onClick={manejarLogin}>Ingresar</button><br /><br />

            <Link to="/Register">¿No tienes cuenta? Registrate</Link>
            
          </div>

        </div>
    </div>
  )
}

export default InicioSesion