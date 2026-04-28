import apiClient from './apiClient'
import type { Customer, PageRequest, PageResponse, UploadStatus } from '../types/types'

export type CustomerRequest = Omit<Customer, 'id'>

export interface CustomerRequestInput extends Omit<CustomerRequest, 'mobileNumbers'> {
	mobileNumbers?: string[]
	mobileNumber?: string
}

const getValidatedMobileNumbers = (input: CustomerRequestInput): string[] => {
	const numbers = [
		...(input.mobileNumbers ?? []),
		...(input.mobileNumber ? [input.mobileNumber] : []),
	]
		.map((value) => value.trim())
		.filter(Boolean)

	if (numbers.length === 0) {
		throw new Error('Mobile number is mandatory')
	}

	return numbers
}

const toCustomerRequest = (input: CustomerRequestInput): CustomerRequest => {
	return {
		...input,
		mobileNumbers: getValidatedMobileNumbers(input),
	}
}

const CUSTOMER_BASE_PATH = '/customer'

export const getCustomers = async (
	params: PageRequest = { page: 0, size: 10, sort: 'id,asc' },
): Promise<PageResponse<Customer>> => {
	const response = await apiClient.get<PageResponse<Customer>>(CUSTOMER_BASE_PATH, { params })
	return response.data
}

export const getCustomerById = async (id: number): Promise<Customer> => {
	const response = await apiClient.get<Customer>(`${CUSTOMER_BASE_PATH}/${id}`)
	return response.data
}

export const createCustomer = async (customer: CustomerRequestInput): Promise<Customer> => {
	const payload = toCustomerRequest(customer)
	const response = await apiClient.post<Customer>(`${CUSTOMER_BASE_PATH}/create-customer`, payload)
	return response.data
}

export const updateCustomer = async (id: number, customer: CustomerRequestInput): Promise<Customer> => {
	const payload = toCustomerRequest(customer)
	const response = await apiClient.put<Customer>(`${CUSTOMER_BASE_PATH}/${id}`, payload)
	return response.data
}

export const uploadCustomerExcelAsync = async (file: File): Promise<{ uploadId: string; message: string }> => {
	const formData = new FormData()
	formData.append('file', file)

	const response = await apiClient.post<{ uploadId: string; message: string }>('customer/upload-async', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return response.data
}

export const getUploadStatus = async (uploadId: string): Promise<UploadStatus> => {
	const response = await apiClient.get<UploadStatus>(`customer/upload-status/${uploadId}`)
	return response.data
}

const customerService = {
	getCustomers,
	getCustomerById,
	createCustomer,
	updateCustomer,
	uploadCustomerExcelAsync,
	getUploadStatus,
}

export default customerService
