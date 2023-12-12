export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  statusCode?: number;
}
