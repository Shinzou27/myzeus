import { Request, Response } from "express";
import { connection } from "../database/connection";
import bcrypt from 'bcrypt'
export class UserController {
    async create(req: Request, res: Response) {
        const {username, password} = req.body;
        const hash = await bcrypt.hash(password as string, 12);
        try {
            const user = await connection.user.create({
                data: {
                    username: username,
                    password: hash
                }
            })
            return res.json({message: 'Cadastro realizado com sucesso!', type: 'success'});
        } catch(e: any) {
            console.log(e.message);
            return res.json({message:'Falha no cadastro. Usuário já existe.', type: 'danger'})
        };
    }
    async list(req: Request, res: Response) {
        const users = await connection.user.findMany();
        res.json(users);
    }
    async log(req: Request, res: Response) {
        const {username, password} = req.query;
        if (!username || !password) {
			res.send({message: 'Nome ou senha incorretos.'});
            return;
		}
        const user = await connection.user.findUnique({
            where: {
                username: req.query.username as string
            }
        });
        if (!user) return res.send({message: 'Usuário não encontrado.'});
        const validation = await bcrypt.compare(req.query.password as string, user.password);
        if(!validation) return res.send({message: 'Senha incorreta.'});
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
    async delete(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        const user = await connection.user.delete({
            where: {
                id: intId
            }
        });
        return res.json(user);
    }
}