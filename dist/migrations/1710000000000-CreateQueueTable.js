"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQueueTable1710000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateQueueTable1710000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('queue', new typeorm_1.TableForeignKey({
            columnNames: ['vendorId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'vendor',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('queue', new typeorm_1.TableForeignKey({
            columnNames: ['studentId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'student',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('queue', new typeorm_1.TableForeignKey({
            columnNames: ['transactionId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'transaction',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('queue');
        const foreignKeys = table.foreignKeys;
        await Promise.all(foreignKeys.map(foreignKey => queryRunner.dropForeignKey('queue', foreignKey)));
        await queryRunner.dropTable('queue');
    }
}
exports.CreateQueueTable1710000000000 = CreateQueueTable1710000000000;
//# sourceMappingURL=1710000000000-CreateQueueTable.js.map