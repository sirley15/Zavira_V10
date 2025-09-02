import Institucion from '../models/institucion.js'
import Usuario from '../models/usuario.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET = process.env.jwt_secret || 'secret123'

export default class RegistroService {
  
  //        INSTITUCIONES

  // Crear registro + TOKEN
  async registrarInstitucion(datos: any) {
    const {
      nombre_institucion,
      codigo_dane,
      direccion,
      telefono,
      jornada,
      correo,
      password,
    } = datos

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(String(password), 10)

    const institucion = await Institucion.create({
      nombre_institucion,
      codigo_dane,
      direccion,
      telefono,
      jornada,
      correo,
      password: hashedPassword,
    })

    // Generar token al registrar
    const token = jwt.sign(
      {
        id: institucion.id_institucion,
        correo: institucion.correo,
        rol: 'Administrador',
        timestamp: Date.now(),
      },
      SECRET,
      { expiresIn: '24h' }
    )

    return {
      mensaje: 'Institución registrada correctamente',
      institucion,
      token,
    }
  }

  // Login + TOKEN
  async loginInstitucion(Correo: string, password: string) {
    if (!Correo || !password) return 'Correo o Contraseña son obligatorio'

    const respuesta = await Institucion.findBy('correo', Correo)
    if (!respuesta) return 'El Correo no existe'

    const passwordValida = await bcrypt.compare(String(password), respuesta.password)
    if (!passwordValida) return 'La contraseña es incorrecta'

    const token = jwt.sign(
      {
        id: respuesta.id_institucion,
        correo: respuesta.correo,
        rol: 'Administrador',
        timestamp: Date.now(),
      },
      SECRET,
      { expiresIn: '24h' }
    )

    return {
      mensaje: 'Login exitoso',
      token,
      nombre_institucion: respuesta.nombre_institucion,
      rol: 'Administrador',
    }
  }

  // Cambiar contraseña
  async cambiarPasswordInstitucion(correo: string, nuevaPassword: string) {
    const institucion = await Institucion.findBy('correo', correo)
    if (!institucion) return { error: 'Institución no encontrada' }

    institucion.password = await bcrypt.hash(String(nuevaPassword), 10)
    await institucion.save()
    return { mensaje: 'Contraseña actualizada correctamente' }
  }

  // Perfil (verifica token)
  async perfilInstitucion(token: string) {
    try {
      const jwtcode = jwt.verify(token, SECRET)
      return { mensaje: 'JWT válido', datos: jwtcode }
    } catch (e) {
      return { error: 'Token INVÁLIDO' }
    }
  }

  
  //         ESTUDIANTES
 

  // Crear registro + TOKEN
async registrarEstudiante(data: any, token: string) {
  try {
    // Verificar el token y extraer payload
    const payload: any = jwt.verify(token, SECRET)
    
    if (!payload || payload.rol !== 'Administrador') {
      throw new Error('No autorizado')
    }

    // Extraer id_institucion del token
    const id_institucion = payload.id_institucion
    if (!id_institucion) {
      throw new Error('Institución no encontrada en token')
    }

    // Extraer datos del estudiante
    const {
      nombre_usuario,
      apellido,
      tipo_documento,
      numero_documento,
      grado,
      curso,
      jornada,
      correo,
      // ya no se usa id_institucion acá, porque viene del token
    } = data

    // Generar password temporal y hash
    const ap = String(apellido || '')
    const passwordPlana = String(numero_documento) + ap.slice(-3)
    const passwordEncriptada = await bcrypt.hash(passwordPlana, 10)

    // Crear estudiante con id_institucion del token
    const estudiante = await Usuario.create({
      nombre_usuario,
      apellido,
      tipo_documento,
      numero_documento,
      grado,
      curso,
      jornada,
      correo,
      password: passwordEncriptada,
      rol: 'Usuario',
      id_institucion,  // viene del token
    })

    // Generar token para el estudiante
    const tokenEstudiante = jwt.sign(
      {
        id: estudiante.id_usuario,
        documento: estudiante.numero_documento,
        rol: estudiante.rol,
        timestamp: Date.now(),
      },
      SECRET,
      { expiresIn: '24h' }
    )

    return {
      mensaje: 'Estudiante registrado correctamente',
      password_temporal: passwordPlana,
      estudiante,
      token: tokenEstudiante,
    }
  } catch (error) {
    return { error: error.message || 'Error desconocido' }
  }
}


  // Login + TOKEN
  async loginEstudiante(numero_documento: string, password: string) {
    if (!numero_documento || !password)
      return 'Numero de documento o Contraseña son obligatorio'

    const estudiante = await Usuario.findBy('numero_documento', numero_documento)
    if (!estudiante) return 'El usuario no existe'

    const passwordValida = await bcrypt.compare(String(password), estudiante.password)
    if (!passwordValida) return 'Contraseña incorrecta'

    const token = jwt.sign(
      {
        id: estudiante.id_usuario,
        documento: estudiante.numero_documento,
        rol: estudiante.rol,
        timestamp: Date.now(),
      },
      SECRET,
      { expiresIn: '24h' }
    )

    return {
      mensaje: 'Login exitoso',
      token,
      nombre_usuario: estudiante.nombre_usuario,
      rol: estudiante.rol,
    }
  }

  // Cambiar contraseña
  async cambiarPasswordEstudiante(correo: string, nuevaPassword: string) {
    const estudiante = await Usuario.query()
      .where('correo', correo)
      .where('rol', 'Usuario')
      .first()

    if (!estudiante) return { error: 'Usuario no encontrado' }

    estudiante.password = await bcrypt.hash(String(nuevaPassword), 10)
    await estudiante.save()

    return { mensaje: 'Contraseña actualizada correctamente' }
  }

  // Perfil (verifica token)
  async perfilEstudiante(token: string) {
    try {
      const jwtcode = jwt.verify(token, SECRET)
      return { mensaje: 'JWT válido', datos: jwtcode }
    } catch (e) {
      return { error: 'Token INVÁLIDO' }
    }
  }

}
  