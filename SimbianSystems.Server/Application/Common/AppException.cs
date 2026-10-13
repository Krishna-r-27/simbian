namespace SimbianSystems.Server.Application.Common;

public class AppException : Exception
{
    public int StatusCode { get; }

    public AppException(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }

    public static AppException NotFound(string message = "Resource not found.") =>
        new(message, 404);

    public static AppException BadRequest(string message) => new(message, 400);

    public static AppException Unauthorized(string message = "Unauthorized.") =>
        new(message, 401);

    public static AppException Forbidden(string message = "Forbidden.") =>
        new(message, 403);
}
