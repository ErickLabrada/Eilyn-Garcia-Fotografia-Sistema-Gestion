const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const ending = addKeyword([]).addAnswer(
    ["Genial, en breves recibirá un mensaje confirmando la cita :D"],
    null,
    null,
    []
)

const askDate = addKeyword([]).addAnswer(
    [
        "Perfecto!"
    ]).addAnswer(["Ahora, en qué día y a qué hora es el evento?"],
    null,
    null,
    [ending]
)

const askBundle = addKeyword([]).addAnswer(
    [
        "Para su tipo de evento ofrecemos los siguientes paquetes"
    ]).addAnswer(["Lista"]).addAnswer(["¿Cuál desea contratar?"],
    null,
    null,
    [askDate]
)


const askOtros = addKeyword(["Otros", "otro"]).addAnswer(
    [
        "Cómo se llama el tipo de evento?"
    ],
    null,
    null,
    [askBundle]
)


const askEvent = addKeyword([]).addAnswer(
        "Genial, aquí en Eilyn Garcia Fotografía ofrecemos servicio para los siguientes eventos:")
        .addAnswer([
        "Cumpleaños",
        "Bodas",
        "Bautizos",
        "Quinceaños",
        "Graduaciones",
        "Aniversarios",
        "Primera comunión",
        "Baby showers",
        "Sesión fotograficas",
        "Otros"
    ],).addAnswer(["¿Cuál de ellos es el que desea contratar?"],
    null,
    null,
    [askOtros,askBundle]
)

const hireServices = addKeyword(['Contratar servicios']).addAnswer(
    ["Gracias por escoger nuestros servicios fotográficos"]).addAnswer(
    ["Para comenenzar, ¿por qué no nos dice el nombre de la persona a quién le estaremos tomando fotos?"]
    ,
    null,
    null,
    [askEvent]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('Hola bienvenido al ChatBot de Eilyn Garcia Fotografía*')
    .addAnswer(
        [
            '¿En qué puedo ayudarle?',
            '👉 Responda *Contratar servicios* para contratar alguno de nuestros paquetes fotográficos',
            '👉 Responda *Consultar información*  para consultar información acerca de nuestros servicios',
            '👉 Responda *Hablar con un empleado* para redirigirlo con un empleado',
        ],
        null,
        null,
        [hireServices]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
