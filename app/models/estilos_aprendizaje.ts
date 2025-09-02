import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import TestEaPorEstudiante from './test_ea_por_estudiante.js'

export default class EstilosAprendizaje extends BaseModel {

  public static table = 'estilos_aprendizajes'

  @column({ isPrimary: true })
  declare id_estilos_aprendizajes: number

  @column() declare estilo: string
  @column() declare descripcion: string 
  @column() declare caracteristicas: string 
  @column() declare recomendaciones: string 

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

   @hasMany(() => TestEaPorEstudiante, { foreignKey: 'id_estilos_aprendizajes' })
  declare tests: HasMany<typeof TestEaPorEstudiante>
}