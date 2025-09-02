import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'
import RegistroService from '../services/registroService.js'
import EstudianteService from '../services/estudianteService.js'

const registroService = new RegistroService()
const estudianteService= new EstudianteService()

export default class EstudiantesController {

  //   SUBIR CSV DE ESTUDIANTES 
  public async subirCSV({ request, response }: HttpContext) {
    try {
      // Se obtiene el archivo CSV enviado desde el formulario
      const archivoCSV = request.file('csv_estudiantes')

      // Se obtiene el ID de la institución desde el body
      const { id_institucion } = request.body()

      // Validaciones iniciales
      if (!archivoCSV?.tmpPath) {
        return response.badRequest({ msj: 'Archivo CSV no válido o no enviado' })
      }

      if (!id_institucion) {
        return response.badRequest({ msj: 'El ID de la institución es obligatorio' })
      }

      // Leer el contenido del archivo CSV
      const contenidoCSV = fs.readFileSync(archivoCSV.tmpPath, 'utf-8')

      // Separar el contenido por líneas (quitamos encabezados y líneas vacías)
      const lineas = contenidoCSV.split('\n').map(l => l.trim()).filter(l => l !== '')
      if (lineas.length <= 1) {
        return response.badRequest({ msj: 'El CSV no contiene estudiantes válidos' })
      }

      // Arrays para estudiantes creados y errores
      const estudiantesCreados: any[] = []
      const estudiantesConError: any[] = []

      // Recorremos desde la línea 1 (saltamos encabezados)
      for (let i = 1; i < lineas.length; i++) {
        const linea = lineas[i]

        try {
          const campos = linea.split(',').map(c => c.trim())

          if (campos.length < 7) {
            throw new Error('Faltan campos obligatorios')
          }

          const estudianteCSV = {
            nombre_usuario: campos[0],
            apellido: campos[1],
            tipo_documento: campos[2],
            numero_documento: campos[3],
            grado: campos[4],
            curso: campos[5],
            jornada: campos[6],
            correo: campos[7] || '',
            id_institucion: Number(id_institucion),
          }

          // 👉 Usamos el service para registrar estudiante (así mantenemos la lógica centralizada)
          const resultado = await registroService.registrarEstudiante(estudianteCSV)

          // Guardamos lo creado
          estudiantesCreados.push({
            id: resultado.estudiante.id_usuario,
            correo: resultado.estudiante.correo,
            password_temporal: resultado.password_temporal,
            token: resultado.token, // el token generado en el registro
          })

        } catch (error: any) {
          estudiantesConError.push({ linea, error: error.message })
        }
      }

      // Respuesta final
      return response.ok({
        msj: 'Procesamiento del CSV completado',
        total_lineas: lineas.length - 1,
        estudiantes_creados: estudiantesCreados.length,
        estudiantes_con_error: estudiantesConError.length,
        errores: estudiantesConError,
        estudiantes: estudiantesCreados,
      })
    } catch (error: any) {
      return response.internalServerError({ msj: 'Error al procesar CSV', error: error.message })
    }
  }

  async filtrarEstudiantes({ params, request, response }: HttpContext) {
    try {
      const id_institucion = Number(params.id_institucion)
      if (isNaN(id_institucion))
        return response.badRequest({ error: 'El id_institucion debe ser un número válido' })

      const grado = request.input('grado')
      const curso = request.input('curso')
      const jornada = request.input('jornada')

      const resultado = await estudianteService.listarEstudiantes(
        id_institucion,
        grado,
        curso,
        jornada
      )
      return response.ok(resultado)
    } catch (error: any) {
      return response.badRequest({
        error: 'Error al filtrar estudiantes',
        detalle: error.message,
      })
    }
  }

  async listarPorInstitucion({ response, params }: HttpContext) {
    try {
      const id_institucion = Number(params.id)
      if (isNaN(id_institucion)) return response.badRequest({ error: 'ID inválido' })
      const estudiantes = await estudianteService.listarPorInstitucion(id_institucion)
      return response.ok(estudiantes)
    } catch {
      return response.badRequest({ error: 'Error al listar estudiantes' })
    }
  }

  async obtenerEstudiante({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (isNaN(id)) return response.badRequest({ error: 'ID inválido' })
      const resultado = await estudianteService.obtenerEstudiante(id)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al obtener estudiante' })
    }
  }

  async actualizarEstudiante({ params, request, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (isNaN(id)) return response.badRequest({ error: 'ID inválido' })
      const payload = request.body()
      const resultado = await estudianteService.actualizarEstudiante(id, payload)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al actualizar estudiante' })
    }
  }

  async eliminarEstudiante({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (isNaN(id)) return response.badRequest({ error: 'ID inválido' })
      const resultado = await estudianteService.eliminarEstudiante(id)
      return response.ok(resultado)
    } catch {
      return response.badRequest({ error: 'Error al eliminar estudiante' })
    }
  }
}
