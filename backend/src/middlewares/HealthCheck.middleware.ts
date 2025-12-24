import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export default (req: Request, res: Response, next: NextFunction) => {
    try{
        const healthStat = {
            status: 'OK',
            uptime: process.uptime(),
            version: process.env.npm_package_version,
            cpu: process.cpuUsage(),
        };
        res.status(StatusCodes.OK).json(healthStat);
    } catch(error){
        throw error;
    }
}