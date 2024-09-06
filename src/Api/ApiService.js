const setAuthHeader = userToken => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', userToken);
  myHeaders.append('Content-Type', 'application/json');

  return myHeaders;
};

export const apiGet = async (url, userToken) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: setAuthHeader(userToken),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
};

export const apiPost = async (url, userToken, body) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: setAuthHeader(userToken),
      body: body,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
};

export const apiDelete = async (url, userToken) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE', // Use DELETE method for deletion
      headers: setAuthHeader(userToken),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in DELETE request:', error);
    throw error;
  }
};

export const apiPut = async (url, userToken, body) => {
  try {
    const response = await fetch(url, {
      method: 'PUT', // Use PUT method for updating
      headers: setAuthHeader(userToken),
      body: body, // Assuming body needs to be sent as JSON
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in PUT request:', error);
    throw error;
  }
};
