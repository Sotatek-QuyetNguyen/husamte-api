export const modifyException = function (exceptions) {
  const exception = exceptions[0];
  let property: string;
  let errorMessage: string;
  if (exception.children.length) {
    [property, errorMessage] = getErrorFromChilden(exception);
  } else {
    property = exception.property;
    errorMessage = String(Object.values(exception.constraints)[0]);
  }
  return {
    [property]: errorMessage
  }
}

export const getErrorFromChilden = function (exception) {
  let property = "";
  let errorMessage: string;
  let childrenException = exception;
  while (true) {
    property += childrenException.property + ".";
    if (childrenException?.children && childrenException.children.length) {
      childrenException = childrenException.children[0];
    } else {
      errorMessage = String(Object.values(childrenException.constraints)[0]);
      break;
    }
  }
  property = property.slice(0, -1);
  
  return [property, errorMessage];
}