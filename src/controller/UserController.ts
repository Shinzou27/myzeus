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
    async log(req: Request, res: Response) {
        const user = await connection.user.findUnique({
            where: {
                username: req.query.username as string
            }
        });
        if (!user) return res.status(401).send('Usuário não encontrado.');
        const validation = await bcrypt.compare(req.query.password as string, user.password);
        if(!validation) return res.status(401).send('Senha incorreta.');
        console.log(validation);
        return res.json(user);
    }
    async updatePassword(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        const {current} = req.body;
        const hash = await bcrypt.hash(req.body.new as string, 12);
        const validation = await bcrypt.compare(current, hash);
        if (validation) return res.json({message: 'Senhas iguais.'});
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