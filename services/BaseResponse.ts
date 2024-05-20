export interface BaseResponse<T> {
    code: number,
    message: string,
    data: T
}

export interface PaginationResponse<T> {
    total_pages: number;
    total_elements: number;
    contents: T;
}
