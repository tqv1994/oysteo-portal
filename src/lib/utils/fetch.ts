export const makeErrorResponse = (
  status: number,
  code: string,
  message: string,
) =>
  new Response(
    JSON.stringify({
      code,
      status,
      message,
    }),
    {
      status,
      headers: {},
    },
  );
