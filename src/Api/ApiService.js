const setAuthHeader = (userToken, isFormData = false) => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', userToken);

  if (!isFormData) {
    myHeaders.append('Content-Type', 'application/json');
  }

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
    const isFormData = body instanceof FormData;

    const response = await fetch(url, {
      method: 'POST',
      headers: setAuthHeader(userToken, isFormData),
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
};

export const apiPut = async (url, userToken, body) => {
  try {
    const isFormData = body instanceof FormData;

    const response = await fetch(url, {
      method: 'PUT',
      headers: setAuthHeader(userToken, isFormData),
      body: body,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in PUT request:', error);
    throw error;
  }
};

export const apiDelete = async (url, userToken) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: setAuthHeader(userToken),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in DELETE request:', error);
    throw error;
  }
};
