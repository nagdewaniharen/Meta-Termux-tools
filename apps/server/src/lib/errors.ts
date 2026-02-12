
import { ZodError } from 'zod'

export function toApiError(err: unknown): { error: string, status: number } {
    console.error(err)

    if (err instanceof ZodError) {
        return {
            error: err.errors.map(e => e.message).join(', '),
            status: 400
        }
    }

    if (err instanceof Error) {
        return { error: err.message, status: 500 }
    }

    return { error: 'Internal Server Error', status: 500 }
}
