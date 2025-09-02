import type { HttpContext } from '@adonisjs/core/http'
import RegistroService from '../services/registroService.js'

const registroService = new RegistroService()

export default class RegistroController {
  //         INSTITUCIONES 
  public async registrarInstitucion({ request, response }: HttpContext) {
    try {
      const datos = request.body()
      const resultado = await registroService.registrarInstitucion(datos)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al registrar institución' })
    }
  }

  async loginInstitucion({ request, response }: HttpContext) {
    try {
      const { correo, password } = request.body()
      const resultado = await registroService.loginInstitucion(correo, password)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error en el servidor durante el login' })
    }
  }

  public async cambiarPasswordInstitucion({ request, response }: HttpContext) {
    try {
      const { correo, nueva_password } = request.body()
      const resultado = await registroService.cambiarPasswordInstitucion(correo, nueva_password)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al cambiar contraseña' })
    }
  }

  async perfilInstitucion({ request, response }: HttpContext) {
    const authHeader = request.header('Authorization')
    if (!authHeader) return response.unauthorized({ error: 'Token obligatorio' })

    const token = authHeader.replace('Bearer ', '').trim()
    const resultado = await registroService.perfilInstitucion(token)
    return response.ok(resultado)
  }


  //         ESTUDIANTES 
  async registrarEstudiante({ request, response }: HttpContext) {
  try {
    const data = await request.body() // extraer body con await
    const token = request.header('Authorization') || ''

    // Extraer solo el token si viene con Bearer
    const tokenClean = token.startsWith('Bearer ') ? token.slice(7) : token

    const resultado = await registroService.registrarEstudiante(data, tokenClean)
    return response.ok(resultado)
  } catch (error) {
    console.error('Error registrarEstudiante:', error)
    return response.badRequest({ error: 'Error al registrar estudiante' })
  }
}


  async loginEstudiante({ request, response }: HttpContext) {
    try {
      const { numero_documento, password } = request.body()
      if (!numero_documento || !password)
        return response.badRequest({ error: 'Numero de documento y contraseña son obligatorios' })

      const resultado = await registroService.loginEstudiante(numero_documento, password)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error en el servidor durante el login' })
    }
  }

  public async cambiarPassword({ request, response }: HttpContext) {
    try {
      const { correo, nueva_password } = request.body()
      const resultado = await registroService.cambiarPasswordEstudiante(correo, nueva_password)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al cambiar contraseña' })
    }
  }

  async perfilEstudiante({ request, response }: HttpContext) {
    const authHeader = request.header('Authorization')
    if (!authHeader) return response.unauthorized({ error: 'Token obligatorio' })

    const token = authHeader.replace('Bearer ', '').trim()
    const resultado = await registroService.perfilEstudiante(token)
    return response.ok(resultado)
  }

}
