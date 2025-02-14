const baseResponse = (
  statusCode,
  success,
  message,
  data = null,
  error = null
) => {
  return {
    statusCode,
    success,
    message,
    data,
    error,
    timestamp: new Date().toISOString(), // timestamp saat ini
  };
};

module.exports = baseResponse;
