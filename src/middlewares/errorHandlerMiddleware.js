const errorHandlerMiddleware = (err, req, res, next) => {
    console.error("Error capturado por el middleware:", err);

    const statusCode = err.status || 500; 
    const message = err.message || "Internal Server Error"; 

    res.status(statusCode).json({
        ok: false,
        status: statusCode,
        message: message,
    });
};

export default errorHandlerMiddleware;