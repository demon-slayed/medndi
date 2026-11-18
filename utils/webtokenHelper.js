import jwt from 'jsonwebtoken'

export const createJWT = async (user_id, expiresIn='7d') => {
    const secretKey = process.env.JWT_SECRET_KEY  
    const token = jwt.sign({user_id}, secretKey, { expiresIn });
    return token;
  };
  