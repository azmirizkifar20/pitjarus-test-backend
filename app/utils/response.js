class Response {
    send(response, statusCode, values, message, error=null) {
        let data = {
            code: statusCode,
            data: values,
            error: error,
            message: message,
        }
        response.status(statusCode).json(data)
        response.end()
    }
}

module.exports = new Response()