import type { HttpContext } from '@adonisjs/core/http'
import InstitucionService from '../services/institucionService.js'

const institucionService = new InstitucionService()

export default class InstitucionController{
  
  async listarInstituciones({ response }: HttpContext) {
    try {
      const resultado = await institucionService.listarInstituciones()
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al listar instituciones' })
    }
  }

  async obtenerInstitucion({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (isNaN(id)) return response.badRequest({ error: 'ID inválido' })
      const resultado = await institucionService.obtenerInstitucion(id)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al obtener institución' })
    }
  }

  async actualizarInstitucion({ params, request, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (isNaN(id)) return response.badRequest({ error: 'ID inválido' })
      const payload = request.body()
      const resultado = await institucionService.actualizarInstitucion(id, payload)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al actualizar institución' })
    }
  }

  async eliminarInstitucion({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (isNaN(id)) return response.badRequest({ error: 'ID inválido' })
      const resultado = await institucionService.eliminarInstitucion(id)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al eliminar institución' })
    }
  }
}