import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'institucion'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_institucion')

      table.string('nombre_institucion').notNullable().unique()
      table.integer('codigo_dane').notNullable().unique()
      table.string('direccion').notNullable()
      table.bigInteger('telefono').notNullable()
      table.string('jornada').notNullable()
      table.string('correo').notNullable()
      table.string('password').notNullable()
      

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}