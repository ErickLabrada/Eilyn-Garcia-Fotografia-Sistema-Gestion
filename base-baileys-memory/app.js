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
    appointmentID:null,      // To store selected event ID
};

    // Default values
    const DEFAULT_HOURS = 2;  // Hardcoded default value for hours
    const DEFAULT_DESCRIPTION = 'Event description';  // Hardcoded description
    const DEFAULT_BUNDLE_ID = 1;  // Example hardcoded bundle ID
    const DEFAULT_COST = 1000;  // Example cost
    const DEFAULT_POSTING_CONSENT = false;  // Default posting consent
    const DEFAULT_GUARANTEE = '2024-12-12';  // Example hardcoded guarantee
    const DEFAULT_STATUS_ID = 1;  // Example status ID



// Flow for ending the conversation
const ending = addKeyword([]).addAction(async (ctx, { flowDynamic }) => {

    console.log(ctx.body)
    userInputs.eventDate=(ctx.body);

     // Create the client object
     const client = { phone: userInputs.phone };
     try {
         // Save the client to the database
         const clientResponse = await axios.post('http://localhost:3001/clients', client);
         console.log("Cliente guardado:", clientResponse.data);
         userInputs.clientID=clientResponse.data.id

         // Store client ID if needed
     } catch (error) {
         console.error('Error guardando el cliente:', error);
     }
 
     const appointment = {
        date: userInputs.eventDate,
        hours: DEFAULT_HOURS,
        place: userInputs.place,  // Replace with actual place if necessary
        description: DEFAULT_DESCRIPTION,
        bundleId: userInputs.selectedBundleId
    };
    try {
        // Save the appointment to the database
        const appointmentResponse = await axios.post('http://localhost:3001/appointment', appointment);
        userInputs.appointmentID=appointmentResponse.data.id
        console.log("Cita guardada:", appointmentResponse.data);
        // Store appointment ID if needed
    } catch (error) {
        console.error('Error guardando la cita:', error);
    }

     // Prepare the contract object
     const contract = {
        cost: DEFAULT_COST,
        celebratedsName: userInputs.name,
        description: DEFAULT_DESCRIPTION,
        postingConsent: DEFAULT_POSTING_CONSENT,
        guarantee: DEFAULT_GUARANTEE,
        appointmentsID: [userInputs.appointmentID], // Assuming the appointment has an ID
        bundleID: userInputs.selectedBundleId,
        clientID: userInputs.clientID, // Assuming you store the client ID
        eventID: userInputs.eventId, // Replace with actual event ID if necessary
        statusID: DEFAULT_STATUS_ID
    };

    // Save the contract to the database
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

// Ask Date Flow
const askDate = addKeyword([]).addAction(async (ctx, { flowDynamic }) => {
    console.log(ctx.body); // Access user's response or any other data

    userInputs.place=ctx.body
    userInputs.phone=ctx.from

})
    .addAnswer(
        ["Perfecto!", "Ahora, ¿en qué día y a qué hora es el evento?"],
        null,null,
        [ending]
    )
    
    const askPlace = addKeyword([]).addAction(async (ctx, { flowDynamic }) => {
        console.log(ctx.body); // Access user's response or any other data
    
        try {
            const response = await axios.get(`http://localhost:3001/bundle/by-name/${ctx.body}`);
            const bundle = response.data; 
            userInputs.selectedBundleId=bundle.id
        } catch (error) {
            console.error(error); 
            return await flowDynamic('Error al obtener los paquetes.');
        }
    
    })
        .addAnswer(
            ["Excelente!", "¿En qué lugar sería el evento?"],
            null,null,
            [askDate]
        )
        



const askBundle = addKeyword([])

.addAction(async (_, { flowDynamic }) => {
    return await flowDynamic("Para su tipo de evento ofrecemos los siguientes paquetes:");
})

.addAction(async (ctx, { flowDynamic, state }) => {
    const selectedEventType = ctx.body; 
    userInputs.eventId=(await axios.get(`http://localhost:3001/events/by-name/${selectedEventType}`)).data.id
    
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
)



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

// Flow to ask for the user's name
const hireServices = addKeyword(['Contratar servicios']).addAction(async (_, { flowDynamic }) => {
    userInputs.initialMessage = 'Contratar servicios'; // Store the initial message
    return await flowDynamic("Gracias por escoger nuestros servicios fotográficos");
}).addAnswer(
    ["Para comenzar, ¿puede decirme el nombre de la persona a la que tomaremos fotos?"],
    null,
    { capture: true },  // Capture user's response for name
    []
).addAction(async (ctx, { flowDynamic }) => {
    // Store the user's name temporarily
    userInputs.name = ctx.body;

    // Proceed to ask for event type after getting the name
    return await flowDynamic(`Nombre registrado: ${userInputs.name}. Ahora elija el tipo de evento.`);
}).addAnswer(
    ["Por favor, elija un tipo de evento:"],
    null,
    { capture: true },  // Capture user's response for event
    [askEvent]
);

// Main flow for greeting and directing the user
const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('Hola, bienvenido al ChatBot de Eilyn Garcia Fotografía!')
    .addAnswer(
        [
            '¿En qué puedo ayudarle?',
            '👉 Responda *Contratar servicios* para contratar alguno de nuestros paquetes fotográficos',
            '👉 Responda *Consultar información* para consultar información acerca de nuestros servicios',
            '👉 Responda *Hablar con un empleado* para redirigirlo con un empleado',
        ],
        null,
        null,  // Capture user's response for event
        [askEvent]
    );


const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
