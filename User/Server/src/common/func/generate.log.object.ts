export function createReqLogObj(request) {
  const requestInformation = {
    timestamp: new Date(),
    path: request.url,
    method: request.method,
    body: request.body,
    user: request.user || {},
  };

  const reqResObject = { requestInformation };
  return reqResObject;
}
