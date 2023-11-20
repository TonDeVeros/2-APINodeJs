import { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionIdExists(
    request: FastifyRequest, reply: FastifyReply
){
    const sessionId = request.cookies.sessionId

    if(!sessionId){
        return reply.status(401).send({
            error: 'Unathorized'
        })
    }

    //cmo é um interceptador, se nao der nenhum erro vai retornar normalmente
}