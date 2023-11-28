import { Request, Response } from "express";
import { connection } from "../database/connection";

export class ReportController {
    async create(req: Request, res: Response) {
        const {date, cost, brand, amount, userId, petId} = req.body;
        
        const report = await connection.report.create({
            data: {
                date, cost, brand, amount, userId, petId
            }
        });
        res.json({message: 'Report added'})
        return report;
    }
    async list(req: Request, res: Response) {
        const user = parseInt(req.query.id as string);
        if (!user) return res.json({message: 'Usuário não encontrado.'})
        const reports = await connection.report.findMany({
            where: {
                userId: user
            }
        })
        res.json(reports);
    }
    async delete(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        await connection.report.delete({
            where: {
                id: intId
            }
        })
        res.json({message: "Report deleted"})
    }
    async update(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        const {date, cost, brand, amount, petId} = req.body;
        const report = await connection.report.update({
            where: {
                id: intId
            },
            data: {
                date, cost, brand, amount, petId
            }
        });
        res.json({message: "Report updated"})
        return report;
    }
    async get(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        const report = await connection.report.findUnique({
            where: {
                id: intId
            }
        })
        res.json(report)
    }
}