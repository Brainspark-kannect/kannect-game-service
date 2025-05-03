module.exports = (data, message = 'Success') => {
    return {
      statusCode: 200,
      status: 'OK',
      message,
      data,
    };
  };