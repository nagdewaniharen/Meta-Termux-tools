
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const lp = await prisma.landingPage.findFirst({
        orderBy: { created_at: 'desc' }
    })

    if (!lp) {
        console.log('No landing pages found')
        return
    }

    console.log('--- ID ---')
    console.log(lp.id)
    console.log('--- SLUG ---')
    console.log(lp.slug)
    console.log('--- GENERATED HTML PREVIEW (First 500 chars) ---')
    console.log(lp.generated_html?.substring(0, 500))
    console.log('--- GENERATED HTML END (Last 500 chars) ---')
    console.log(lp.generated_html?.substring(lp.generated_html.length - 500))
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
