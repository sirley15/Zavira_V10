import { DateTime } from 'luxon'
import { BaseModel, column ,hasMany} from '@adonisjs/lucid/orm'
import  {type HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'
export default class Institucion extends BaseModel {

  // Especificar el nombre exacto de la tabla
  public static table = 'institucion'

  @column({ isPrimary: true })
  declare id_institucion : number

  @column()
  declare nombre_institucion : string
 
  @column()
  declare codigo_dane : number

  @column()
  declare direccion : string  

  @column()
  declare telefono : bigint

  @column()
  declare jornada : string 

  @column()
  declare correo : string  
  
  @column()
  declare password : string  

   @hasMany(() => Usuario, {
    foreignKey: 'id_institucion', 
  })
  declare usuarios: HasMany<typeof Usuario>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}