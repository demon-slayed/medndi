import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
    try {
        const SALT_ROUND = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error while hashing password");   
    }
    
}

export const verifyPassword = async (password, hashedPassword) => {
      try {
         const response =await bcrypt.compare(password, hashedPassword);
         return response;
      } catch (error) {
        throw new Error("Error while verifying password");    
      }
}




