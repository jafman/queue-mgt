import { Student } from '../entities/student.entity';
export declare class StudentResponseDto {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId: string;
    createdAt: Date;
    updatedAt: Date;
    static fromEntity(entity: Student): StudentResponseDto;
}
