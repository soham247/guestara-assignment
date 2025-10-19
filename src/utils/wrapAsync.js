// Wrap async functions
const wrapAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => next(error))
    }
} 
export default wrapAsync;
