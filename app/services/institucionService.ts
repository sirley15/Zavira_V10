import Institucion from '../models/institucion.js'
import bcrypt from 'bcrypt'


export default class InstitucionService {

  // Listar todas
  async listarInstituciones() {
    const instituciones = await Institucion.all()
    return { instituciones }
  }

  // Obtener por ID
  async obtenerInstitucion(id_institucion: number) {
    const inst = await Institucion.query().where('id_institucion', id_institucion).first()
    if (!inst) return { error: 'Institución no encontrada' }
    return { institucion: inst }
  }

  // Actualizar por ID
  async actualizarInstitucion(id_institucion: number, payload: any) {
    const inst = await Institucion.query().where('id_institucion', id_institucion).first()
    if (!inst) return { error: 'Institución no encontrada' }

    const {
      nombre_institucion,
      codigo_dane,
      direccion,
      telefono,
      jornada,
      correo,
      password,
    } = payload

    if (nombre_institucion !== undefined) inst.nombre_institucion = nombre_institucion
    if (codigo_dane !== undefined) inst.codigo_dane = codigo_dane
    if (direccion !== undefined) inst.direccion = direccion
    if (telefono !== undefined) inst.telefono = telefono
    if (jornada !== undefined) inst.jornada = jornada
    if (correo !== undefined) inst.correo = correo
    if (password !== undefined && password !== '') {
      inst.password = await bcrypt.hash(String(password), 10)
    }

    await inst.save()
    return { mensaje: 'Institución actualizada correctamente', institucion: inst }
  }

  // Eliminar por ID
  async eliminarInstitucion(id_institucion: number) {
    const inst = await Institucion.query().where('id_institucion', id_institucion).first()
    if (!inst) return { error: 'Institución no encontrada' }
    await inst.delete()
    return { mensaje: 'Institución eliminada' }
  }
}
