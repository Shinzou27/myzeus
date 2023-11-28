import { Request, Response } from "express";
import { connection } from "../database/connection";
export class PetController {
    async create(req: Request, res: Response) {
        const {name, type, breed, userId} = req.body;
        const pet = await connection.pet.create({
            data: {
                name,
                type,
                breed,
                userId
            }
        });
        res.json({message: 'Pet adicionado.'});
        return pet;
    };
    async list(req: Request, res: Response) {
        const user = parseInt(req.query.id as string);
        if (!user) return res.json({message: 'Usuário não encontrado.'})
        const pets = await connection.pet.findMany({
            where: {
                userId: user
            }
        })
        res.json(pets);
    }
    async delete(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        await connection.pet.delete({
            where: {
                id: intId
            }
        })
        res.json({message: "Pet removido."})
    }
    async update(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        const {name, type, breed} = req.body;
        const pet = await connection.pet.update({
            where: {
                id: intId
            },
            data: {
                name, type, breed
            }
        });
        res.json({message: "Pet atualizado."})
        return pet;
    }
    async get(req: Request, res: Response) {
        const {id} = req.params;
        const intId = parseInt(id);
        const pet = await connection.pet.findUnique({
            where: {
                id: intId
            }
        })
        res.json(pet)
    }
}