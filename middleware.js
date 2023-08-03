const errorHandler = (err, req, res, _next) => {
    res.status(500).json({
      code: 500,
      message: err.message,
      result: {},
      success: false,
    })
}

const errorWrap = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {
    errorHandler,
    errorWrap
}