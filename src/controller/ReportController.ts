import { Request, Response } from "express";
import { connection } from "../database/connection";

export class ReportController {
    async create(req: Request, res: Response) {
        const {date, cost, brand, amount, userId, petId} = req.body;
        const dateAsDateObject = new Date(date);
        
        if (isNaN(dateAsDateObject)) return res.status(404).send({message: 'Data inválida.', type: 'error'});
        if (isNaN(cost.replace(',','.')) || parseFloat(cost.replace(',','.')) < 0) return res.status(404).send({message: 'Custo inválido.', type: 'error'});
        if (brand.replace(' ', '').length == 0 || brand.replace(' ', '').length > 20) return res.status(404).send({message: 'Nome de marca longo demais.', type: 'error'});
        if (amount <= 0 || isNaN(amount)) return res.status(404).send({message: 'Quantidade inválida.', type: 'error'});
        const report = await connection.report.create({
            data: {
                date, cost, brand, amount, userId, petId
            }
        });
        res.json({message: 'Report added', type: 'success'});
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