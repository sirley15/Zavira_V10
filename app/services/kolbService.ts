import ResultadoEstudiante from '../models/resultado_estudiante.js'
import TestPorEstudiantes from '../models/test_ea_por_estudiante.js'
import EstilosAprendizajes from '../models/estilos_aprendizaje.js'
import PreguntaEstiloAprendizajes from '../models/pregunta_estilo_aprendizaje.js'

export default class KolbService {

    async listarPreguntas() {
    try {
      // Aquí traes todas las preguntas desde tu modelo
      const preguntas = await PreguntaEstiloAprendizajes.all()
      return preguntas
    } catch (error) {
      console.error('Error al listar preguntas:', error)
      throw new Error('No se pudieron cargar las preguntas')
    }
  }

  // Guarda las respuestas del estudiante y calcula su estilo de aprendizaje
  async guardarRespuestas(data: any) {
    const { id_usuario, respuestas } = data

    const fecha = new Date().toISOString().slice(0, 10) 
    const test = await TestPorEstudiantes.create({
    id_usuario,
    fecha_presentacion: fecha,        
  })


    const puntajes: any = {
      EC: 0,
      OR: 0,
      CA: 0,
      EA: 0
    }

    const mapEstilo:any = {
      'EXPERIENCIA CONCRETA': 'EC',
      'OBSERVACIÓN REFLEXIVA': 'OR',
      'CONCEPTUALIZACIÓN ABSTRACTA': 'CA',
      'EXPERIMENTACIÓN ACTIVA': 'EA'
    }

    for (const respuesta of respuestas) {
      const { id_pregunta, valor } = respuesta
      const pregunta = await PreguntaEstiloAprendizajes.find(id_pregunta)
      if (!pregunta) continue

      const estilo = mapEstilo[pregunta.tipo_pregunta]
      if (estilo && puntajes[estilo] !== undefined) {
        puntajes[estilo] += valor
      }

      
       await ResultadoEstudiante.create({
       id_test_ea_por_estudiantes: test.id_test_ea_por_estudiantes,
       id_pregunta_estilo_aprendizajes: id_pregunta,
      valor: String(valor),           
      })
    }

    console.log('Puntajes acumulados:', puntajes)

    const valoresEstilos: any = {
      DIVERGENTE: puntajes.EC + puntajes.OR - puntajes.CA - puntajes.EA,
      CONVERGENTE: puntajes.CA + puntajes.EA - puntajes.EC - puntajes.OR,
      ACOMODADOR: puntajes.EA + puntajes.EC - puntajes.OR - puntajes.CA,
      ASIMILADOR: puntajes.OR + puntajes.CA - puntajes.EA - puntajes.EC
    }

    let estiloDominante = ''
    let mayorValor = -Infinity

    for (const estilo in valoresEstilos) {
      if (valoresEstilos[estilo] > mayorValor) {
        mayorValor = valoresEstilos[estilo]
        estiloDominante = estilo
      }
    }

    const estiloAprendizaje = await EstilosAprendizajes.query()
      .where('estilo', estiloDominante)
      .first()

    if (!estiloAprendizaje) {
      return { mensaje: 'No se encontró información del estilo' }
    }

    test.estilo_aprendizaje = estiloAprendizaje.estilo
    test.id_estilos_aprendizajes = estiloAprendizaje.id_estilos_aprendizajes
    await test.save()

    return {
      mensaje: 'Test guardado correctamente',
      estilo_dominante: estiloAprendizaje.estilo,
      caracteristicas: estiloAprendizaje.caracteristicas,
      recomendaciones: estiloAprendizaje.recomendaciones
    }
  }

  // Servicio para obtener el resultado más reciente del estudiante
  async obtenerResultado(id_usuario: number) {
    const test = await TestPorEstudiantes.query()
      .where('id_usuario', id_usuario)
      .orderBy('fecha_presentacion', 'desc')
      .preload('estilo')   // carga datos del estilo
      .preload('estudiante')  // carga datos del estudiante
      .first()

    if (!test) {
      return { mensaje: 'No se encontró un test para este usuario' }
    }

    return {
      nombre: test.estudiante?.nombre_usuario,
      apellido: test.estudiante?.apellido,
      fecha: test.fecha_presentacion,
      estilo: test.estilo_aprendizaje,
      caracteristicas: test.estilo?.caracteristicas,
      recomendaciones: test.estilo?.recomendaciones,
    }
  }
}