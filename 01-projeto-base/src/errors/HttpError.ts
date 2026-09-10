/**
 * ============================================================
 * TODO 8 (Encontro 2) -- Hierarquia de HttpError
 * ============================================================
 * Esta pasta esta vazia de proposito -- ela e do Encontro 1,
 * mas o conteudo e do Encontro 2. Nao implemente antes da aula.
 *
 * Quando chegar a hora, crie aqui:
 *   class HttpError extends Error { statusCode, message, details? }
 *   class BadRequestError extends HttpError          -> 400
 *   class NotFoundError extends HttpError            -> 404
 *   class ConflictError extends HttpError            -> 409
 *   class UnprocessableEntityError extends HttpError -> 422
 *   class PayloadTooLargeError extends HttpError     -> 413
 *
 * Depois disso, volte aos Services (TODO 3 e TODO 6) e troque
 * os retornos especiais de erro por `throw new AlgumHttpError()`.
 * ============================================================
 */

export class HttpError extends Error {
    constructor(public statusCode: number, message: string, public details?: unknown) { 
        super(message) 
    }
}

export class BadRequestError extends HttpError {
    constructor(msg = "Requisição inválida!", details?: unknown) {
        super(400, msg, details)
    }
}

export class NotFoundError extends HttpError {
    constructor(msg = "Recurso não encontrado!") {
        super(404, msg)
    }
}

export class ConflictError extends HttpError {
    constructor(msg = "Conflito com o estado atual") {
        super(409, msg)
    }
}

export class UnprocessableEntityError extends HttpError {
    constructor(msg = "Não foi possível processar os dados!", details?: unknown) {
        super(422, msg, details)
    }
}

export class PayloadTooLargeError extends HttpError {
    constructor(msg = "Arquivo excede o tamanho permitido!") {
        super(413, msg)
    }
}

