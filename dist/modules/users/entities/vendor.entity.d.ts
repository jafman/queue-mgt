import { BusinessCategory } from '../enums/business-category.enum';
export declare class Vendor {
    id: string;
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    business_name: string;
    business_category: BusinessCategory;
    firstTimeLogin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
