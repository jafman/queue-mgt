export declare enum BusinessCategory {
    FOOD_AND_NUTRITION = "Food and Nutrition",
    FASHION = "Fashion",
    ELECTRONICS = "Electronics"
}
export declare class Vendor {
    id: string;
    username: string;
    password: string;
    name: string;
    business_name: string;
    business_category: BusinessCategory;
    email: string;
    phone: string;
    firstTimeLogin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
