import Usuario from '../models/usuario.js'
import bcrypt from 'bcrypt'

export default class EstudianteService {

// Listar con filtros opcionales
  async listarEstudiantes(id_institucion: number, grado?: string, curso?: string, jornada?: string) {
    let query = Usuario.query()
      .where('id_institucion', id_institucion)
      .where('rol', 'Usuario')

    if (grado) query.where('grado', grado)
    if (curso) query.where('curso', curso)
    if (jornada) query.where('jornada', jornada)

    return await query
  }

  // Obtener estudiante por ID
  async obtenerEstudiante(id_usuario: number) {
    const user = await Usuario.query().where('id_usuario', id_usuario).first()
    if (!user) return { error: 'Estudiante no encontrado' }
    return { estudiante: user }
  }

  // Actualizar estudiante
  async actualizarEstudiante(id_usuario: number, payload: any) {
    const user = await Usuario.query().where('id_usuario', id_usuario).first()
    if (!user) return { error: 'Estudiante no encontrado' }

    const {
      nombre_usuario,
      apellido,
      tipo_documento,
      numero_documento,
      grado,
      curso,
      jornada,
      correo,
      password,
      id_institucion,
      rol,
    } = payload

    if (nombre_usuario !== undefined) user.nombre_usuario = nombre_usuario
    if (apellido !== undefined) user.apellido = apellido
    if (tipo_documento !== undefined) user.tipo_documento = tipo_documento
    if (numero_documento !== undefined) user.numero_documento = numero_documento
    if (grado !== undefined) user.grado = grado
    if (curso !== undefined) user.curso = curso
    if (jornada !== undefined) user.jornada = jornada
    if (correo !== undefined) user.correo = correo
    if (id_institucion !== undefined) user.id_institucion = id_institucion
    if (rol !== undefined) user.rol = rol
    if (password !== undefined && password !== '') {
      user.password = await bcrypt.hash(String(password), 10)
    }

    await user.save()
    return { mensaje: 'Estudiante actualizado correctamente', estudiante: user }
  }

  // Eliminar estudiante
  async eliminarEstudiante(id_usuario: number) {
    const user = await Usuario.query().where('id_usuario', id_usuario).first()
    if (!user) return { error: 'Estudiante no encontrado' }
    await user.delete()
    return { mensaje: 'Estudiante eliminado' }
  }

  // Listar todos por institución (atajo)
  async listarPorInstitucion(id_institucion: number) {
    return await Usuario.query()
      .where('id_institucion', id_institucion)
      .where('rol', 'Usuario')
  }
}