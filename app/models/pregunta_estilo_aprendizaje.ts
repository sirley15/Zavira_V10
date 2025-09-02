import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import ResultadoEstudiante from './resultado_estudiante.js'

export default class PreguntaEstiloAprendizaje extends BaseModel {
  public static table = 'pregunta_estilo_aprendizajes'
  
  @column({ isPrimary: true })
  declare id_pregunta_estilo_aprendizajes: number

  @column() declare tipo_pregunta: string
  @column() declare titulo: string
  @column() declare pregunta: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ResultadoEstudiante, { foreignKey: 'id_pregunta_estilo_aprendizajes' })
  declare respuestas: HasMany<typeof ResultadoEstudiante>
}