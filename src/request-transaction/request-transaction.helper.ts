import { Logger } from '@nestjs/common';

export const CONTEXT_NAME = Symbol('REQUEST_TRANSACTION_CONTEXT_NAME');

export const logger = new Logger('RequestTransaction');
