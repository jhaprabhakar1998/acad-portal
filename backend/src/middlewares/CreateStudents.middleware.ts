import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        next();
    } catch(error){
        throw error;
    }
};