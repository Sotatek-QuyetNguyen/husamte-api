interface NormalResponse {
  code: number;
  data: any;
  message: string;
  status: string;
}

export class ResponseUtils {
  public static buildSuccessResponse(data: any): NormalResponse {
    return {
      code: 0,
      message: '',
      data,
      status: 'success',
    };
  }

  public static buildCustomResponse(
    code: number,
    data: any,
    message: string,
  ): NormalResponse {
    return {
      code,
      message,
      data,
      status: code === 0 ? 'success' : 'fail',
    };
  }
}