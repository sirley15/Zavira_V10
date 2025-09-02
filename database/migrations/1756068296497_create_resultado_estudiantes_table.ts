import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resultado_estudiantes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_resultado_estudiantes')

      table.integer('id_test_ea_por_estudiantes').notNullable()
           .references('id_test_ea_por_estudiantes').inTable('test_ea_por_estudiantes')
           .onDelete('CASCADE')
      
      table.integer('id_pregunta_estilo_aprendizajes').notNullable()
           .references('id_pregunta_estilo_aprendizajes').inTable('pregunta_estilo_aprendizajes')
           .onDelete('CASCADE')

       table.enum('valor', ['1', '2', '3', '4'], {
        useNative: true,
        enumName: 'valor_enum',
      }).nullable() 

      table.integer('valorx').nullable()
      table.integer('valory').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}