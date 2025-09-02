import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pregunta_estilo_aprendizajes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_pregunta_estilo_aprendizajes')

      table.enum('tipo_pregunta', ['EXPERIENCIA CONCRETA', 'OBSERVACIÓN REFLEXIVA', 'CONCEPTUALIZACIÓN ABSTRACTA', 'EXPERIMENTACIÓN ACTIVA'], {
        useNative: true,
        enumName: 'ttipo_pregunta_enum',
      }).notNullable()
      
      table.string('titulo').notNullable()
      table.text('pregunta').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}