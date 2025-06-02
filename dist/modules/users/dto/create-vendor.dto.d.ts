import { BusinessCategory } from '../enums/business-category.enum';
export declare class CreateVendorDto {
    username: string;
    name: string;
    business_name: string;
    business_category: BusinessCategory;
    email: string;
    phone?: string;
}
