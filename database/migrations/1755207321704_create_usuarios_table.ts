import { BaseSchema } from '@adonisjs/lucid/schema'


export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_usuario')

      table.string('nombre_usuario').notNullable()
      table.string('apellido').notNullable()
      table.enum('tipo_documento',['CC', 'TI', 'CE', 'NIT'], {
        useNative: true,
        enumName: 'tipo_documento_enum',
      }).notNullable()
      table.bigInteger('numero_documento').notNullable().unique()
      table.integer('grado').notNullable()
      table.string('curso').notNullable()
      table.string('jornada').notNullable()
      table.string('correo').notNullable()
      table.string('password').notNullable()
      table.enum('rol',['Administrador','Usuario'],{
        useNative: true,
        enumName: 'rol_enum',
      }).notNullable().defaultTo('Usuario')

      table.integer('id_institucion').unsigned().nullable().references('id_institucion').inTable('institucion')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}