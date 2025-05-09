import { StudentResponseDto } from './student-response.dto';
export declare class StudentListResponseDto {
    data: StudentResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
