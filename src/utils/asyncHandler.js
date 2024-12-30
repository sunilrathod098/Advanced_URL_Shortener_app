export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        requestHandler(req, res, next)
        .catch((error) => next(error));
    };

}