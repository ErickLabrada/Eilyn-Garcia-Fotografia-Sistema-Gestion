import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import axios from 'axios'; // Change this line


const PORT = process.env.PORT ?? 3008

let eventOptions=[];
let events=[];
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
    const askBundle = addKeyword(EVENTS.ACTION)
    .addAnswer("Para su tipo de evento ofrecemos los siguientes paquetes:", { delay: 3000 })
    .addAction(async (ctx, { flowDynamic }) => {

        const selectedEventType = ctx.body;
        userInputs.eventId = (await axios.get(`http://localhost:3001/events/by-name/${selectedEventType}`)).data.id;

        try {
            const response = await axios.get(`http://localhost:3001/bundle/by-event-type/${selectedEventType}`);
            const bundles = response.data;

            if (!Array.isArray(bundles) || bundles.length === 0) {
                return await flowDynamic("Lo siento, no se pudieron cargar los paquetes.");
            }




    for (const bundle of bundles) {
        await flowDynamic([{ 
            body: bundle.name, // Send the bundle name
            media: join('assets',bundle.url) ,
            delay: 100
        }]);
    }

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


    const askEvent = addKeyword([])
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic('Genial, aquí en Eilyn Garcia Fotografía ofrecemos servicio para los siguientes eventos:');
        await flowDynamic('Seleccione el evento escribiéndolo:');
        try {
            const response = await axios.get('http://localhost:3001/events');
            events = response.data;
            console.log(events)
            eventOptions = events.map(event => event.event.toLowerCase());
            const eventList = eventOptions.join('\n');

            if (!eventOptions.length) {
                await flowDynamic("Lo siento, hubo un error al intentar cargar los eventos.");
                return fallBack();  // Ensure fallBack is returned
            } else {
                await flowDynamic(`Los eventos disponibles son:\n${eventList}\n`);
            }
    }catch(error){
        console.log(error);
        await flowDynamic('Error1');
        return fallBack(); // Ensure fallBack is returned on error
    }})
    .addAction({ capture: true },async (ctx, {gotoFlow, fallBack, flowDynamic }) => {
        try{

                const input = ctx.body.toLowerCase().trim();

                if (eventOptions.includes(input)) {
                    const selectedEvent = events.find(event => event.event.toLowerCase() === input);
                    userInputs.eventId = selectedEvent.id;  // Store selected event ID
                    return gotoFlow(askBundle); // Transition to askBundle if input is valid
                } else {
                    await flowDynamic('La opción seleccionada no existe o es errónea, por favor intente nuevamente.');
                    return fallBack();  // Ensure fallBack is returned here
                }

        } catch (error) {
            console.log(error);
            await flowDynamic('Error .');
            return fallBack(); // Ensure fallBack is returned on error
        }
    })


    const hireServices = addKeyword(["Contratar servicios"])
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic("Gracias por escoger nuestros servicios fotográficos");
        await flowDynamic("Para comenzar, ¿puede decirme el nombre de la persona a la que tomaremos fotos?");
    })
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            let input = ctx.body.toLowerCase().trim();

            if (input !== null && input !== '') {
                userInputs.name = input;
                await flowDynamic('El nombre registrado fue: ' + input);
            } else {
                await flowDynamic('Tu nombre es inválido, intentalo de nuevo por favor.');
                return fallBack();
            }
        }, [askEvent]
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
        }, [hireServices]
    );


const main = async () => {
    const adapterFlow = createFlow([flowPrincipal,hireServices,askEvent,askBundle])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
