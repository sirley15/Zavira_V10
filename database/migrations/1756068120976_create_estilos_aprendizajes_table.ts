import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estilos_aprendizajes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_estilos_aprendizajes')

      table.text('estilo').notNullable().unique() 
      table.text('descripcion').nullable()
      table.text('caracteristicas').nullable()
      table.text('recomendaciones').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}