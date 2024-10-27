const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const axios = require('axios');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

let userInputs = {
    place: '', // To store the initial message (service type)
    name: 'Erick',           // To store the user's name
    phone: '',          // To store the user's phone number
    eventDate: '',      // To store the user's event date
    selectedBundleId: null, // To store selected bundle ID
    eventId: null,
    appointmentID: null,      // To store selected event ID
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
    console.log(ctx.body)
    userInputs.eventDate = (ctx.body);

    // Create the client object
    const client = { phone: userInputs.phone };
    try {
        const clientResponse = await axios.post('http://localhost:3001/clients', client);
        console.log("Cliente guardado:", clientResponse.data);
        userInputs.clientID = clientResponse.data.id
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
        userInputs.appointmentID = appointmentResponse.data.id
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
        console.log(contract)
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
    userInputs.place = ctx.body
    userInputs.phone = ctx.from
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
        userInputs.selectedBundleId = bundle.id
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
    .addAction(async (ctx, { flowDynamic, state }) => {
        const selectedEventType = ctx.body;
        userInputs.eventId = (await axios.get(`http://localhost:3001/events/by-name/${selectedEventType}`)).data.id

        try {
            const response = await axios.get(`http://localhost:3001/bundle/by-event-type/${selectedEventType}`);
            const bundles = response.data;
            console.log(bundles);

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

const askEvent = addKeyword([]).addAction(async (_, { flowDynamic, state }) => {
    return await flowDynamic("Genial, aquí en Eilyn Garcia Fotografía ofrecemos servicio para los siguientes eventos:");
}).addAction(async (ctx, { flowDynamic, state }) => {
    try {
        const response = await axios.get('http://localhost:3001/events');
        const events = response.data;

        if (!Array.isArray(events) || events.length === 0) {
            return await flowDynamic("Lo siento, no se pudieron cargar los eventos.");
        }

        const eventList = events.map(event => event.event).join(', ');
        return await flowDynamic(`Los eventos disponibles son:\n${eventList}\n`);
    } catch (error) {
        return await flowDynamic('Error al obtener los eventos.');
    }
}).addAnswer(
    ["Por favor, elija el paquete que desea contratar:"],
    null,
    { capture: true },
    [askBundle]
);

const hireServices = addKeyword(["hola2"])
.addAction(async (_, { flowDynamic }) => {
    console.log("Antes de hireServices2");
     await flowDynamic("Gracias por escoger nuestros servicios fotográficos");
}).addAction(
    ["Para comenzar, ¿puede decirme el nombre de la persona a la que tomaremos fotos?"],
    null,
    { capture: true },
    []
).addAction(async (ctx, { flowDynamic }) => {
    userInputs.name = ctx.body;
    console.log("Antes de hireServices2");
    return await flowDynamic(`Nombre registrado: ${userInputs.name}. Ahora elija el tipo de evento.`);
    
}).addAnswer(
    ["Por favor, elija un tipo de evento:"],
    null,
    { capture: true },
    [askEvent],
    console.log("Antes de hireServices2")

    
);
const hireServices2 = addKeyword([])
    .addAction(async (ctx, { flowDynamic }) => {
        await flowDynamic('Gracias por escoger nuestros servicios fotográficos');
        await flowDynamic("Para comenzar, ¿puede decirme el nombre de la persona a la que tomaremos fotos?");

    }
);
const flowPrincipal2 = addKeyword([])
    .addAction(async (ctx, { flowDynamic }) => {
        await flowDynamic('Hola, bienvenido al ChatBot de Eilyn Garcia Fotografía!');
        await flowDynamic(
            "¿En qué puedo ayudarle?\n" +
            "👉 *Contratar servicios*: para contratar alguno de nuestros paquetes fotográficos\n" +
            "👉 *Consultar información*: para consultar información acerca de nuestros servicios\n" +
            "👉 *Hablar con un empleado*: para redirigirlo con un empleado"
        );
    })
    .addAnswer(
        { capture: true },  // Capturamos la opción seleccionada por el usuario
        async (ctx, { flowDynamic }) => {
            const input = ctx.body.toLowerCase().trim();
            if (input === 'contratar servicios') {
                await flowDynamic('Usted ha seleccionado *Contratar servicios*.');
                
                console.log("Antes de hireServices2");
                return hireServices;

            } else if (input === 'consultar información') {
                 await flowDynamic('Usted ha seleccionado *Consultar información*. Aquí tiene la información que necesita...');
                 return;
            } else if (input === 'hablar con un empleado') {
                await flowDynamic('Redirigiéndole con un empleado...');
                return;
            } else {
                    // Si la opción no es válida, mostramos un mensaje y volvemos a mostrar el menú
                    await flowDynamic('La opción seleccionada no existe, por favor intente nuevamente.');
              
            }
        }   
    );



const flowPrincipal = addKeyword(["asd"])
    .addAction(async (ctx, { flowDynamic }) => {
        await flowDynamic('Hola, bienvenido al ChatBot de Eilyn Garcia Fotografía!');
        await flowDynamic(
            "¿En qué puedo ayudarle?\n" +
            "👉 *Contratar servicios*: para contratar alguno de nuestros paquetes fotográficos\n" +
            "👉 *Consultar información*: para consultar información acerca de nuestros servicios\n" +
            "👉 *Hablar con un empleado*: para redirigirlo con un empleado"
        );
    })
    .addAction(
        { capture: true },  
        async (ctx, { flowDynamic }) => {
            const input = ctx.body.toLowerCase().trim();
            if (input === 'contratar servicios') {
                await flowDynamic('Usted ha seleccionado *Contratar servicios*.', [hireServices]);
                
                return;

            } else if (input === 'consultar información') {
                 await flowDynamic('Usted ha seleccionado *Consultar información*. Aquí tiene la información que necesita...');
                 return;
            } else if (input === 'hablar con un empleado') {
                await flowDynamic('Redirigiéndole con un empleado...');
                return;
            } else {
                    // Si la opción no es válida, mostramos un mensaje y volvemos a mostrar el menú
                    await flowDynamic('La opción seleccionada no existe, por favor intente nuevamente.');
              return flowPrincipal;
            }
        }   
    );

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterFlow2 = createFlow([flowPrincipal,askEvent,askBundle,askPlace,askDate,ending]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
