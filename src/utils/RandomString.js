/*
here we generate a random string for use as a short URL or identifies a user.
@param{number} length - the length of the random string generate and default is 6.
@return{string} - the random string generated in alphanumerical string type.
*/

import asyncHandler from "./asyncHandler.js";


const generateRandomString = asyncHandler(async(length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = "";
    for (let i = 0; i< length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
})

export { generateRandomString };


