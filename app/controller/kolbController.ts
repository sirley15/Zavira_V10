import type { HttpContext } from '@adonisjs/core/http'
import KolbService from '../services/kolbService.js'
import jwt from 'jsonwebtoken'

const kolbService = new KolbService()
const SECRET = process.env.jwt_secret || 'secret123'

export default class KolbController {

  async listarPreguntas({ response }: HttpContext) {
    try {
      const preguntas = await kolbService.listarPreguntas()
      return response.json(preguntas)
    } catch (error) {
      return response.json({ error: 'Error al obtener preguntas' })
    }
  }

  async guardarRespuestas({ request, response }: HttpContext) {
    try {
      const data = request.body()
      const resultado = await kolbService.guardarRespuestas(data)
      return response.json(resultado)
    } catch (error) {
      return response.json({ error: 'Error al guardar respuestas del test' })
    }
  }

async obtenerResultado({ request, response }: HttpContext) {
    try {
      const authHeader = request.header('Authorization')

      if (!authHeader) {
        return response.json({ error: 'Token obligatorio' })
      }

      const token = authHeader.replace('Bearer ', '').trim()
      const decoded: any= jwt.verify(token, SECRET)

      const id_usuario = decoded.id

      const resultado = await kolbService.obtenerResultado(id_usuario)
      return response.json(resultado)

    } catch (error) {
      return response.json({ error: 'Error al obtener resultado del test' })
    }
  }

}
