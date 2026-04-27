export interface City {
    city: string;
}

export interface Country {
    country: string;
}

export interface CustomerAddress {
    addressLine1: string;
    addressLine2: string;
    city: City;
    country: Country;
}

export interface Customer {
    id: number;
    name: string;
    dateOfBirth: string;
    nic: string;
    familyMembers: Customer[];
    addresses: CustomerAddress[];
}