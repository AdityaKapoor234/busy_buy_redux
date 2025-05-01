
export default function loggerMiddleware(store) {
    return function (next) {
        return function (action) {
            // log action
            console.log("[LOG]: ", action?.type);

            // call next middleware in the pipeline
            next(action);

            // log the modified state of app
            console.log("Store ", store?.getState());
        }
    }
}