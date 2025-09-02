import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_ea_por_estudiantes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_test_ea_por_estudiantes')

      table.integer('id_usuario').notNullable()
           .references('id_usuario').inTable('usuarios')
           .onDelete('CASCADE')
      
      table.date('fecha_presentacion').notNullable()

      table.string('estilo_aprendizaje').nullable()

      table.integer('id_estilos_aprendizajes').nullable()
           .references('id_estilos_aprendizajes').inTable('estilos_aprendizajes')
           .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}