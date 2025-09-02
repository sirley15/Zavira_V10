import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo} from '@adonisjs/lucid/orm'
import {type BelongsTo } from '@adonisjs/lucid/types/relations'
import Institucion from './institucion.js'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  declare id_usuario: number

  @column()
  declare nombre_usuario: string

  @column()
  declare apellido: string

  @column()
  declare tipo_documento: string

  @column()
  declare numero_documento: bigint

   @column()
  declare grado: number

   @column()
  declare curso: string

   @column()
  declare jornada: string

  @column()
  declare correo: string

  @column()
  declare password: string

  @column()
  declare rol: string

  @column()
  public id_institucion ?: number | null


  @belongsTo(() => Institucion, {
    foreignKey: 'id_institucion',
  })
  declare institucion: BelongsTo<typeof Institucion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
