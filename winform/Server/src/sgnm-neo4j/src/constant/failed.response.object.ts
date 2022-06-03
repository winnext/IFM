export function failedResponse(error) {
  const responseObject = {
    message: `failed due to ${error}`,
    status: 400,
  };

  return JSON.stringify(responseObject);
}
