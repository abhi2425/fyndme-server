import { HttpStatus } from '@nestjs/common';

export interface ResponseType {
  status: HttpStatus;
  message: string;
  token?: string | object;
  data: Array<any> | object;
}
