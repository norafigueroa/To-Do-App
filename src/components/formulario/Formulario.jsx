import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Formulario.css'
import { toast } from 'react-toastify'
import { postUsers, getUsers } from '../../services/servicesUser';

function Formulario() {

  const navigate = useNavigate();

  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');

  // Función para manejar registro
  const manejarRegistro = async () => {

  // 1. Validar campos vacíos
  if (!nombre.trim() || !correo.trim() || !contrasena.trim() || !confirmar.trim()) {
    toast.error('Todos los campos son obligatorios');
    return;
  }

  // 2. Validar longitud del nombre
  if (nombre.trim().length < 3) {
    toast.error('El nombre debe tener al menos 3 caracteres');
    return;
  }

  // 3. Validar email
  console.log(correo.trim())
  const validarEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validarEmail.test(correo.trim())) {
    toast.error('Ingrese un correo válido');
    return;
  }

  // 4. Validar longitud de la contraseña
  if (contrasena.trim().length < 8) {
    toast.error('La contraseña debe tener al menos 8 caracteres');
    return;
  }

  // 5. Validar que las contraseñas coincidan
  if (contrasena !== confirmar) {
    toast.error('Las contraseñas no coinciden');
    return;
  }

  // 6. Validar usuario único
  try {
    const usuariosExistentes = await getUsers();
    const correoExiste = usuariosExistentes.some(
      u => u.correo.toLowerCase() === correo.trim().toLowerCase()
    );
    if (correoExiste) {
      toast.error('Ya existe un usuario con ese correo');
      return;
    }
  } catch (error) {
    console.error('Error al verificar usuarios existentes', error);
    toast.error('Error al validar el correo');
    return;
  }    

    const nuevoUsuario = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena: contrasena.trim()
    };

    try {
      await postUsers(nuevoUsuario); // Guardar usuario en db.json
      toast.success('Registro exitoso');

      setNombre('');
      setCorreo('');
      setContrasena('');
      setConfirmar('');
      navigate('/'); // Redirigir al login
    } catch (error) {
      console.error('Error al registrar usuario', error);
      toast.error('No se pudo registrar el usuario');
    }
  };


  return (
    <div>
        <div className='contenedorLogin'>

          <div className='tarjetaContenedor'>

            <h2>Registro</h2>

            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id='nombre' className='nombre' placeholder="Escribe un nombre y un apellido" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
            <br /><br />

            <label htmlFor="correo">Correo:</label>
            <input type="email" id='correo' className='correo' placeholder="ej: juan@gmail.com" value={correo} onChange={(e) => setCorreo(e.target.value)}/>
            <br /><br />

            <label htmlFor="contrasena">Contraseña:</label>
            <input type="password" id='contrasena' className='contrasena' placeholder="Escribe tu contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)}/>
            <br /><br />

            <label htmlFor="confirmar">Confirmar Contraseña:</label>
            <input type="password" id='confirmar' className='confirmar' placeholder="Vuelve a escribir tu contraseña" value={confirmar} onChange={(e) => setConfirmar(e.target.value)}/>
            <br /><br />

            <button id="registrarse" onClick={manejarRegistro}>Registrarse</button> <br /><br />

            <Link to="/">Ya tengo cuenta</Link>

          </div>

        </div>
    </div>
  )
}

export default Formulario