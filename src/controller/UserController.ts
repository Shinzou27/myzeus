import { Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';
import { connection } from "../database/connection";
import bcrypt from 'bcrypt'
export class UserController {
    async create(req: Request, res: Response) {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password as string, 12);
        try {
            const user = await connection.user.create({
                data: {
                    username: username,
                    password: hash
                }
            })
            //res.json({ message: 'Cadastro realizado com sucesso!', type: 'success' });
            const token = jsonwebtoken.sign({
                id: user.id,
                username: user.username,
            }, process.env.JWT_SECRET!, {
                expiresIn: '1d'
            })
            return res.json({
                token: token,
                id: user.id,
                username: user.username
            });
        } catch (e: any) {
            console.log(e.message);
            return res.json({ message: 'Falha no cadastro. Usuário já existe.', type: 'danger' })
        };
    }
    async list(req: Request, res: Response) {
        const users = await connection.user.findMany();
        res.json(users);
    }
    async log(req: Request, res: Response) {
        const { username, password } = req.body;
        if (!username || !password) {
            res.send({ message: 'Nome ou senha incorretos.' });
            return;
        }
        const user = await connection.user.findUnique({
            where: {
                username: username as string
            }
        });
        if (!user) return res.send({ message: 'Usuário não encontrado.' });
        const validation = await bcrypt.compare(password as string, user.password);
        if (!validation) return res.send({ message: 'Senha incorreta.' });
        const token = jsonwebtoken.sign({
            id: user.id,
            username: user.username,
        }, process.env.JWT_SECRET!, {
            expiresIn: '1d'
        })
        return res.json({
            token: token,
            id: user.id,
            username: user.username
        });
    }
    async updatePassword(req: Request, res: Response) {
        const { id } = req.params;
        const intId = parseInt(id);
        const { current } = req.body;
        const hash = await bcrypt.hash(req.body.new as string, 12);
        const inputValidation = await bcrypt.compare(current, hash);
        if (inputValidation) return res.json({ message: 'Senhas iguais.', type: 'danger' });
        const user = await connection.user.findUnique({
            where: {
                id: intId
            }
        });
        if (user) {
            const passwordValidation = await bcrypt.compare(current, user.password);
            if (passwordValidation) {
                await connection.user.update({
                    where: {
                        id: intId
                    },
                    data: {
                        password: hash
                    }
                })
                return res.json({ message: 'Senha atualizada!', type: 'success' });
            }
            return res.json({ message: 'A senha inserida não corresponde à sua senha atual.', type: 'danger' });
        }
        return res.json({ message: 'Usuário não encontrado.', type: 'danger' });
    }
    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const intId = parseInt(id);
        const user = await connection.user.delete({
            where: {
                id: intId
            }
        });
        return res.json(user);
    }
}