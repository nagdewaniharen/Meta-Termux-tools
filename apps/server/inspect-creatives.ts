
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const latestPage = await prisma.landingPage.findFirst({
        orderBy: { created_at: 'desc' },
    })

    if (!latestPage) {
        console.log('No landing pages found')
        return
    }

    console.log('Latest Page:', latestPage.title)
    console.log('Creatives:', JSON.stringify(latestPage.creatives, null, 2))
    console.log('Template:', latestPage.template) // verifying template too
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect())
