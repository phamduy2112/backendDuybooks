export const responseSend = (data: any, message: string, code: number) => {
    return {
      statusCode: code,
      content: data,
      message,
      date: new Date(),
    };
  };