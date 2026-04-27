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
    mobileNumbers: string[];
    familyMembers?: Customer[];
    addresses?: CustomerAddress[];
}


export interface PageRequest {
	page?: number
	size?: number
	sort?: string
}

export interface PageResponse<T> {
	content: T[]
	totalElements: number
	totalPages: number
	number: number
	size: number
	first: boolean
	last: boolean
	numberOfElements: number
	empty: boolean
}