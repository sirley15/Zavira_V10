import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import TestEaPorEstudiante from './test_ea_por_estudiante.js'
import PreguntaEstiloAprendizaje from './pregunta_estilo_aprendizaje.js'

export default class ResultadoEstudiante extends BaseModel {
  @column({ isPrimary: true })
  declare id_resultado_estudiantes: number

  @column() 
  declare id_test_ea_por_estudiantes: number

  @column() 
  declare id_pregunta_estilo_aprendizajes: number

  @column() 
  declare valor:string

  @column() 
  declare valorx: number

  @column() 
  declare valory: number 

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => TestEaPorEstudiante, { foreignKey: 'id_test_ea_por_estudiantes' })
  declare test: BelongsTo<typeof TestEaPorEstudiante>

  @belongsTo(() => PreguntaEstiloAprendizaje, { foreignKey: 'id_pregunta_estilo_aprendizajes' })
  declare pregunta: BelongsTo<typeof PreguntaEstiloAprendizaje>
}