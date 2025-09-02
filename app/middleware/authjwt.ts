import jwt from 'jsonwebtoken'
import type { HttpContext } from '@adonisjs/core/http'

const SECRET = process.env.JWT_SECRET || 'secret123'

export default class Authjwt {
    async handle({ request, response }: HttpContext, next: any) {
        const authHeader = request.header('Authorization')
        const token = authHeader ? authHeader.replace('Bearer ', '').trim() : null

        if (!token) {
            return response.unauthorized({ msj: "Token obligatorio" })
        } else {
            try {
                const jwtcode = jwt.verify(token, SECRET)
                request.updateBody({ authUsuario: jwtcode })
                await next()
            } catch (e) {
                return response.unauthorized({ msj: "Token invalido" })
            }
        }
    }
}