// Generates a token in the format 'Swift+<6-digit-number>'
function generateToken() {
    const number = Math.floor(100000 + Math.random() * 900000);
    const companyName = "Swift";
    const token = `${companyName}${number}`;
    return token;
}

export { generateToken };