import { Response } from 'express';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common"
import { ResponseUtils } from 'src/share/utils/response.utils';

// @Catch()
// export class ExceptionsFilter extends BaseExceptionFilter implements GqlExceptionFilter {
//   private readonly logger: Logger = new Logger();

//   public override catch(exception: any, host: ArgumentsHost): void {
//     let args: unknown;
//     const status = this.getHttpStatus(exception);
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     if (status === HttpStatus.BAD_GATEWAY) {
//       response.status(400).json({
//         code: 1,
//         message: 'Data validation fail',
//         data: exception?.response.message.map((message: any) => message?.constraints),
//       });
//     } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
//       if (exception instanceof Error) {
//         this.logger.error(`${exception.message}: ${args}`, exception.stack);
//         response.status(status).json({
//           code: 1,
//           message: exception.message,
//           data: null,
//         });
//       } else {
//         // Error Notifications
//         this.logger.error('UnhandledException', exception);
//       }
//     } else {
//       response.status(status).json({
//         code: exception.response.code ? exception.response.code : -1,
//         message: exception.message,
//         data: null,
//       });
//     }
//   }

//   private getHttpStatus(exception: unknown): number {
//     return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
//   }
// }

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter<BadRequestException> {
  public catch (exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse() as Response
    const exceptionResponse = exception.getResponse();
    let responseData = exceptionResponse;
    if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      responseData = { message: exceptionResponse['message'] }
    }
    const message = Object.values(responseData)[0];
    response
      .status(HttpStatus.BAD_REQUEST)
      .json(ResponseUtils.buildCustomResponse(1, {}, message))
  }
}
