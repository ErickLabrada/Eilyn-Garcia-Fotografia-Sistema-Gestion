const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const axios = require('axios');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

let userInputs = {
    place: '',
    name: '',
    phone: '',
    eventDate: '',
    selectedBundleId: null,
    eventId: null,
    appointmentID: null,
};

// Default values
const DEFAULT_HOURS = 2;
const DEFAULT_DESCRIPTION = 'Event description';
const DEFAULT_BUNDLE_ID = 1;
const DEFAULT_COST = 1000;
const DEFAULT_POSTING_CONSENT = false;
const DEFAULT_GUARANTEE = '2024-12-12';
const DEFAULT_STATUS_ID = 1;

// Flow for ending the conversation
const ending = addKeyword([]).addAction(async (ctx, { flowDynamic }) => {
    console.log(ctx.body);
    userInputs.eventDate = ctx.body;

    const client = { phone: userInputs.phone };
    try {
        const clientResponse = await axios.post('http://localhost:3001/clients', client);
        console.log("Cliente guardado:", clientResponse.data);
        userInputs.clientID = clientResponse.data.id;
    } catch (error) {
        console.error('Error guardando el cliente:', error);
    }

    const appointment = {
        date: userInputs.eventDate,
        hours: DEFAULT_HOURS,
        place: userInputs.place,
        description: DEFAULT_DESCRIPTION,
        bundleId: userInputs.selectedBundleId
    };
    try {
        const appointmentResponse = await axios.post('http://localhost:3001/appointment', appointment);
        userInputs.appointmentID = appointmentResponse.data.id;
        console.log("Cita guardada:", appointmentResponse.data);
    } catch (error) {
        console.error('Error guardando la cita:', error);
    }

    const contract = {
        cost: DEFAULT_COST,
        celebratedsName: userInputs.name,
        description: DEFAULT_DESCRIPTION,
        postingConsent: DEFAULT_POSTING_CONSENT,
        guarantee: DEFAULT_GUARANTEE,
        appointmentsID: [userInputs.appointmentID],
        bundleID: userInputs.selectedBundleId,
        clientID: userInputs.clientID,
        eventID: userInputs.eventId,
        statusID: DEFAULT_STATUS_ID
    };

    try {
        console.log(contract);
        await axios.post('http://localhost:3001/contracts', contract);
        console.log("Contrato guardado:", contract);
    } catch (error) {
        console.error('Error guardando el contrato:', error);
    }
})
    .addAnswer(
        ["Genial, en breves recibirá un mensaje confirmando la cita :D"],
        null,
        null,
        []
    );

const askDate = addKeyword([]).addAction(async (ctx, { flowDynamic }) => {
    console.log(ctx.body);
    userInputs.place = ctx.body;
    userInputs.phone = ctx.from;
})
    .addAnswer(
        ["Perfecto!", "Ahora, ¿en qué día y a qué hora es el evento?"],
        null, null,
        [ending]
    );

const askPlace = addKeyword([]).addAction(async (ctx, { flowDynamic }) => {
    console.log(ctx.body);

    try {
        const response = await axios.get(`http://localhost:3001/bundle/by-name/${ctx.body}`);
        const bundle = response.data;
        userInputs.selectedBundleId = bundle.id;
    } catch (error) {
        console.error(error);
        return await flowDynamic('Error al obtener los paquetes.');
    }
})
    .addAnswer(
        ["Excelente!", "¿En qué lugar sería el evento?"],
        null, null,
        [askDate]
    );

const askBundle = addKeyword([])
    .addAction(async (_, { flowDynamic }) => {
        return await flowDynamic("Para su tipo de evento ofrecemos los siguientes paquetes:");
    })
    .addAction(async (ctx, { flowDynamic }) => {
        const selectedEventType = ctx.body;
        userInputs.eventId = (await axios.get(`http://localhost:3001/events/by-name/${selectedEventType}`)).data.id;

        try {
            const response = await axios.get(`http://localhost:3001/bundle/by-event-type/${selectedEventType}`);
            const bundles = response.data;

            if (!Array.isArray(bundles) || bundles.length === 0) {
                return await flowDynamic("Lo siento, no se pudieron cargar los paquetes.");
            }

            const bundleList = bundles.map(bundle => `${bundle.name} - $${bundle.price}`).join('\n');
            return await flowDynamic(`Los paquetes disponibles son:\n${bundleList}\n`);
        } catch (error) {
            console.error(error);
            return await flowDynamic('Error al obtener los paquetes.');
        }
    })
    .addAnswer(
        ["¿Cuál de ellos es el que desea contratar?"],
        null,
        { capture: true },
        [askPlace]
    );

const askEvent = addKeyword(["Preguntar Evento"])
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic('Genial ' + userInputs.name + ' aquí en Eilyn Garcia Fotografía ofrecemos servicio para los siguientes eventos,');
        await flowDynamic('Seleccione el evento escribiendolo:');
    })
    .addAction(async (ctx, { fallBack, flowDynamic }) => {
        try {
            const response = await axios.get('http://localhost:3001/events');
            const events = response.data;

            const eventList = events.map(event => event.event).join(', ');

            if (events.length === 0) {
                await flowDynamic("Lo siento, hubo un error al intentar cargar los eventos.");
                return await flowDynamic(flowPrincipal);
            } else {
                await flowDynamic(`Los eventos disponibles son:\n${eventList}\n`);

                const input = ctx.body.toLowerCase().trim();

                for (let index = 0; index < events.length; index++) {

                    if (input === events[index].event) {
                        await flowDynamic('Usted ha seleccionado *' + events[index].event + ' *.');
                        return await flowDynamic(askBundle);
                    }
                }


                await flowDynamic('La opción seleccionada no existe o es erronea, por favor intente nuevamente.');
                await flowDynamic("Seleccione el evento escribiendolo:");
                await flowDynamic(`Los eventos disponibles son:\n${eventList}\n`);

                return fallBack()

            }

        } catch (error) {
            console.log(error);
            return await flowDynamic('Error al obtener los eventos.');
        }
    }, [askBundle]);


const hireServices = addKeyword(["Contratar servicios"])
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic("Gracias por escoger nuestros servicios fotográficos");
        await flowDynamic("'Para comenzar, ¿puede decirme el nombre de la persona a la que tomaremos fotos?'");
    })
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            let input = ctx.body.toLowerCase().trim();

            if (input !== null && input !== '') {
                userInputs.name = input;
                await flowDynamic('El nombre registrado fue: ' + input);
                return await flowDynamic(askEvent);
            } else {
                await flowDynamic('Tu nombre es inválido, intentalo de nuevo por favor.');
                return fallBack();
            }
        }
    );



const flowPrincipal = addKeyword(["hola", "ola", "que", "tal", "disponible", "estan"])
    .addAnswer(["Hola, bienvenido al ChatBot de Eilyn Garcia Fotografía!"])
    .addAnswer([
        "¿En qué puedo ayudarle?\n" +
        "👉 *Contratar servicios*: para contratar alguno de nuestros paquetes fotográficos\n" +
        "👉 *Consultar información*: para consultar información acerca de nuestros servicios\n" +
        "👉 *Hablar con un empleado*: para redirigirlo con un empleado"])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {

            const input = ctx.body.toLowerCase().trim();
            if (input === 'contratar servicios' || input === 'contratar servicio') {
                await flowDynamic('Usted ha seleccionado *Contratar servicios*.');
            } else if (input === 'consultar información') {
                await flowDynamic('Usted ha seleccionado *Consultar información*. Aquí tiene la información que necesita...');
                return;
            } else if (input === 'hablar con un empleado') {
                await flowDynamic('Redirigiéndole con un empleado...');
                return;
            } else {

                await flowDynamic('La opción seleccionada no existe, por favor intente nuevamente.');
                await flowDynamic(
                    "¿En qué puedo ayudarle?\n" +
                    "👉 *Contratar servicios*: para contratar alguno de nuestros paquetes fotográficos\n" +
                    "👉 *Consultar información*: para consultar información acerca de nuestros servicios\n" +
                    "👉 *Hablar con un empleado*: para redirigirlo con un empleado"
                );

                return fallBack()
            }
        }
    );

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, hireServices, askEvent,askBundle]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();