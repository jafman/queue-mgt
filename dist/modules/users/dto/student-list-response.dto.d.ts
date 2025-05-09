import { Student } from '../entities/student.entity';
export declare class StudentListResponseDto {
    data: Student[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
