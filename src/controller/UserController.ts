import { Request, Response } from "express";
import { connection } from "../database/connection";
import bcrypt from 'bcrypt'
export class UserController {
    async create(req: Request, res: Response) {
        const {username} = req.body;
        const hash = await bcrypt.hash(req.body.password as string, 12);
        const user = await connection.user.create({
            data: {
                username: username,
                password: hash
            }
        })
        return res.json({userId: user.id})
    }
    async list(req: Request, res: Response) {
        const users = await connection.user.findMany();
        res.json(users);
    }
    async updatePassword(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        const {current} = req.body;
        const hash = await bcrypt.hash(req.body.new as string, 12);
        if (current == hash) return res.json({message: 'Senhas iguais.'})
        const user = await connection.user.update({
            where: {
                id: intId
            },
            data: {
                password: hash
            }
        });
        return res.json(user);
    }
}