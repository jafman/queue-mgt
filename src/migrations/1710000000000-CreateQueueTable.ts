import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateQueueTable1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'queue',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vendorId',
            type: 'uuid',
          },
          {
            name: 'studentId',
            type: 'uuid',
          },
          {
            name: 'transactionId',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'SERVING', 'COMPLETED'],
            default: "'PENDING'",
          },
          {
            name: 'position',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'servedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'queue',
      new TableForeignKey({
        columnNames: ['vendorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vendor',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'queue',
      new TableForeignKey({
        columnNames: ['studentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'student',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'queue',
      new TableForeignKey({
        columnNames: ['transactionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transaction',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('queue');
    const foreignKeys = table.foreignKeys;
    
    await Promise.all(
      foreignKeys.map(foreignKey => queryRunner.dropForeignKey('queue', foreignKey)),
    );
    
    await queryRunner.dropTable('queue');
  }
} 