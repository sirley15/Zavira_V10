import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'
import EstilosAprendizaje from './estilos_aprendizaje.js'

export default class TestEaPorEstudiante extends BaseModel {

  @column({ isPrimary: true })
  declare id_test_ea_por_estudiantes: number

  @column()
  declare fecha_presentacion: string

  @column()
  declare estilo_aprendizaje: string 

  @column()
  declare id_usuario: number

  @column()
  declare id_estilos_aprendizajes: number 

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Usuario, { foreignKey: 'id_usuario' })
  declare estudiante: BelongsTo<typeof Usuario>

  @belongsTo(() => EstilosAprendizaje, { foreignKey: 'id_estilos_aprendizajes' })
  declare estilo: BelongsTo<typeof EstilosAprendizaje>
}