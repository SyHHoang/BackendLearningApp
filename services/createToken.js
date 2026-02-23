import jwt from 'jsonwebtoken';

export { createToken };

const createToken = (id,expire,role) => {
    const payload = {
        id:id,
        role:role
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expire });
}