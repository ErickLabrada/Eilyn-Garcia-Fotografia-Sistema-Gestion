import { join } from 'path';
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import axios from 'axios';

const PORT = process.env.PORT ?? 3008;
const emojiRegex = /[\p{Emoji}\u200d\u20e3\ufe0f\u00ae\u00a9]+/gu;
let unavailableHours;
let eventList;
let bundleList;
let bundles;
let saleBundle;
let saleBundleList;
let saleBundleOptions = [];
let bundleOptions = [];
let eventOptions = [];
let events = [];
let userInputs = {
    place: '',
    name: '',
    phone: '',
    eventDate: '',
    selectedBundleId: null,
    bundleName: null,
    eventId: null,
    appointmentID: null,
};
let busyHours;
let date=new Date();
let day;
let month;
let year;


// Default values
const DEFAULT_HOURS = 2;
const DEFAULT_DESCRIPTION = 'Event description';
const DEFAULT_BUNDLE_ID = 1;
let DEFAULT_COST = 0;
const DEFAULT_POSTING_CONSENT = false;
const DEFAULT_GUARANTEE = '2024-12-12';
const DEFAULT_STATUS_ID = 1;

// Flow for ending the conversation
const ending = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic }) => {

    userInputs.phone=ctx.from

    const client = { name: ctx.name, phone: userInputs.phone };

try {
    // Check if client already exists by phone
    const response = await axios.get(`http://localhost:3001/clients/by-phone/${userInputs.phone}`);
    const clientResponse = response.data;

    if (!clientResponse) {
        // Client doesn't exist; create a new one
        const newClientResponse = await axios.post('http://localhost:3001/clients/', client);
        console.log("Cliente guardado:", newClientResponse.data);
        userInputs.clientID = newClientResponse.data.id;
    } else {
        // Client exists, use its ID
        userInputs.clientID = clientResponse.id;
    }
} catch (error) {
    console.error('Error guardando el cliente:', error.response ? error.response.data : error.message);
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

        DEFAULT_COST = appointmentResponse.data.bundle.price;
    } catch (error) {
        console.error('Error guardando la cita:', error);
    }

    const contract = {
        cost: DEFAULT_COST,
        celebratedsName: userInputs.name,
        description: DEFAULT_DESCRIPTION,
        postingConsent: DEFAULT_POSTING_CONSENT,
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
        ["Genial, en breves recibirá un mensaje confirmando la cita :D"])
        .addAnswer(['¿Desea realizar otro proceso?, escriba "Si" para reiniciar el sistema.'])
        .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {

            const input = ctx.body.toLowerCase().trim();

            if(input === "si"){
                gotoFlow(flowPrincipal);
            }else if(input === "no"){
                await flowDynamic("¡Entendido!, cualquier otra cosa que necesites, aqui estare!.");
                return;
            } else{
                await flowDynamic("La opcion seleccionada fue erronea intentelo denuevo");
                return fallBack('¿Desea realizar otro proceso?, escriba "Si" para reiniciar el sistema.');
            }


                }
    );

    const validateAppointmentInfo = addKeyword(EVENTS.ACTION)
    .addAnswer(["Genial, ya casi terminamos, esta es la información que has proporcionado. Dime 'Sí' si es correcta o 'No' si no lo es."])
    .addAction({ capture: false },
        async (ctx, { flowDynamic }) => {
            // Formatear la fecha al estilo DD/MM/AAAA
            const eventDate = userInputs.eventDate;
            const formattedDate = eventDate.getDate().toString().padStart(2, '0') + '/' +
                                  (eventDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                  eventDate.getFullYear();

            await flowDynamic([
                `Nombre del festejado: ${userInputs.name}`,
                `Paquete contratado: ${userInputs.bundleName}`,
                `Dirección del evento: ${userInputs.place}`,
                `Fecha del evento: ${formattedDate}`
            ]);
        })
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.trim();
            if (input === "si" || input === "sí") {
                await flowDynamic("¡Genial, procederemos con el guardado de la información!");
                return gotoFlow(ending);
            } else if (input === "no") {
                await flowDynamic("¡Entendido! Iniciaremos de nuevo entonces.");
                return gotoFlow(hireServices);
            } else {
                return fallBack("Opción no válida, ingrese 'Sí' o 'No' como respuesta, por favor.");
            }
        }
    );




    const askHour = addKeyword(EVENTS.ACTION)
    .addAnswer(['Por favor, proporcione la hora en la cual se realizará el evento en formato "HH:MM".'])
    .addAnswer(['Recuerde que el horario permitido es de 9 AM a 11 PM.'])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.trim();
            
            // Patrón para validar el formato "HH:MM"
            const timePattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
            const stringDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
            try {
                // Fetch unavailable hours for the given date (dynamically)
                const unavailableHours = await axios.get(`http://localhost:3001/appointment/unavailableHours/${stringDate}`);
                
                // Convert unavailable hours to start and end times (in hours)
                busyHours = unavailableHours.data.map(period => {
                    const start = new Date(period.startDate);
                    const end = new Date(period.endDate);
                    return {
                        startHour: start.getHours(),
                        startMinute: start.getMinutes(),
                        endHour: end.getHours(),
                        endMinute: end.getMinutes(),
                    };
                });

                console.log('Busy hours:', busyHours); // Check the unavailable periods
            } catch (error) {
                console.log(error);
                await flowDynamic('Hubo un error al obtener las horas ocupadas. Inténtelo nuevamente.');
                return fallBack('Inténtelo nuevamente');
            }

            // Check if the input time is valid
            if (timePattern.test(input)) {
                const [hours, minutes] = input.split(':').map(Number);
                
                // Validación del rango de horas permitidas (9:00 a 23:00)
                if (hours >= 9 && hours < 23) {
                    console.log(busyHours)
                    // Check if there are any busy hours, and if so, check if the selected time conflicts with them
                    if (busyHours.length > 0) {
                        const isBusy = busyHours.some(period => {
                            // Check if the selected time is within any of the busy periods
                            const startMinutes = period.startHour * 60 + period.startMinute;
                            const endMinutes = period.endHour * 60 + period.endMinute;
                            const selectedMinutes = hours * 60 + minutes;

                            return selectedMinutes >= startMinutes && selectedMinutes < endMinutes;
                        });

                        if (isBusy) {
                            // Create a readable format for busy hours
                            const formattedBusyHours = busyHours.map(period => {
                                const startHourFormatted = `${period.startHour.toString().padStart(2, '0')}:${period.startMinute.toString().padStart(2, '0')}`;
                                const endHourFormatted = `${period.endHour.toString().padStart(2, '0')}:${period.endMinute.toString().padStart(2, '0')}`;
                                return `De ${startHourFormatted} a ${endHourFormatted}`;
                            }).join('\n');
                        
                            // Inform the user about the busy hours
                            await flowDynamic('Dicha hora está ocupada, a continuación le mostramos nuestra agenda para el día seleccionado, por favor escoja una fecha diferente o una hora que tengamos libre.');
                            
                            // Display the formatted busy hours
                            await flowDynamic(formattedBusyHours);
                            
                            // Redirect to askDay flow to choose another time
                            return gotoFlow(askDay);
                        }
                        
                    }

                    // If not busy, set the event date and proceed
                    date.setDate(day);
                    date.setMonth(month-1);
                    date.setYear(year);
                    date.setHours(hours, minutes);
                    userInputs.eventDate = date;
                 
                    return gotoFlow(validateAppointmentInfo); // Cambia "ending" al flujo adecuado que debe continuar después de la hora
                } else {
                    await flowDynamic('La hora proporcionada está fuera del horario permitido. Ingrese una hora entre las 9 AM y las 11 PM.');
                    return fallBack('Proporcione una hora válida en formato "HH:MM".');
                }
            } else {
                // Mensaje de error para formato incorrecto o caracteres no válidos
                await flowDynamic('Formato de hora incorrecto o contiene caracteres no válidos. Por favor, ingrese la hora en el formato "HH:MM".');
                await flowDynamic('Ejemplo: "14:30" para 2:30 PM.');
                return fallBack('Proporcione una hora válida en formato "HH:MM".');
            }
        }
    );




    const askDay = addKeyword(EVENTS.ACTION)
    .addAnswer(["Ahora proporcione el día en el cual quiere que se realice el evento."])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.trim();
    
            // Validación de que el input sea un número y esté entre 1 y 31
            if (!isNaN(input) && parseInt(input) > 0 && parseInt(input) <= 31) {
                day=(parseInt(input));
                return gotoFlow(askMonth);
            }
    
            // Mensaje de error para entradas inválidas
            await flowDynamic('Disculpe los inconvenientes, pero el día proporcionado es inválido o contiene caracteres o emojis que no están permitidos.');
            await flowDynamic("El día debe ser un número entre 1 y 31. Ejemplo: '15'.");
            ctx.body = "";  // Reiniciar el valor de ctx.body
            return fallBack('Proporcione el día en el cual quiere que se realice el evento.');
        }
    );
    
    const askMonth = addKeyword(EVENTS.ACTION)
    .addAnswer(["Ahora proporcione el número del mes en el cual quiere que se realice el evento."])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.trim();
    
            // Validación de que el input sea un número y esté entre 1 y 12
            if (!isNaN(input) && parseInt(input) > 0 && parseInt(input) <= 12) {
                month=(parseInt(input)); 
                return gotoFlow(askYear);
            }
    
            // Mensaje de error para entradas inválidas
            await flowDynamic('Disculpe los inconvenientes, pero el mes proporcionado es inválido o contiene caracteres o emojis que no están permitidos.');
            await flowDynamic("El mes debe ser un número entre 1 y 12. Ejemplo: '12' para diciembre.");
            ctx.body = "";  // Reiniciar el valor de ctx.body
            return fallBack('Proporcione el mes en el cual quiere que se realice el evento.');
        }
    );
    
    const askYear = addKeyword(EVENTS.ACTION)
    .addAnswer(["Ahora proporcione el año en el cual quiere que se realice el evento."])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.trim();
    
            // Validación de que el input sea un número de 4 dígitos
            if (!isNaN(input) && input.length === 4) {
                year = (parseInt(input));

                const date2 = new Date();
                date2.setDate(day)
                date2.setMonth(month-1)
                date2.setYear(year)
                console.log(date2)
                const now = new Date();
                const minDate=now
                minDate.setDate(now.getDate() + 5); 
                if (month==2&&(!((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))&&day==29){
                    await flowDynamic("El año proporcionado no es bisiesto, por lo que el día no puede ser 29");
                    return gotoFlow(askDay); 
                }

                if (([4,6,9,11].includes(month)&&day==31)||(month==2&&day<28)) {
                    await flowDynamic("La fecha que ha pedido no parece ser real, por favor verifique que sea una fecha existente");
                    return gotoFlow(askDay); 
                }

                if ((month==12&&[24,25,31]||(month==1&&day==1))){
                    await flowDynamic("Lo lamento, pero ese día no trabajamos");
                    return gotoFlow(askDay); 
                }

                console.log(date2)
                console.log(now)
                console.log(minDate)
                console.log(date2 <= now)
                console.log(date2 <= minDate)

                if (date2 <= now||date2 <= minDate){
                    await flowDynamic("Disculpe, pero no puede agendar una cita para fechas ya pasadas o con menos de 5 días de anticipación, por favor escoja otra fecha");
                    return gotoFlow(askDay); 
                }

                return gotoFlow(askHour); // Cambia "ask" al flujo adecuado que debe continuar después del año
            }
    
            // Mensaje de error para entradas inválidas
            await flowDynamic('Disculpe los inconvenientes, pero el año proporcionado es inválido o contiene caracteres o emojis que no están permitidos.');
            await flowDynamic("El año debe ser un número de 4 dígitos. Ejemplo: '2024'.");
            ctx.body = "";  // Reiniciar el valor de ctx.body
            return fallBack('Proporcione el año en el cual quiere que se realice el evento.');
        }
    );
    


const askPlace = addKeyword(EVENTS.ACTION)
    .addAnswer(["Buena elección!, ahora proporcioname la dirección del lugar donde se realizara el evento porfavor."])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.trim();

            if (input.length < 125) {
                    userInputs.place = input;

                    return gotoFlow(askDay);
         
            }

            console.log(input);
            await flowDynamic('Disculpe los inconvenientes, pero la dirección proporcionada es inválida o contiene caracteres o emojis que no están permitidos.');
            
            ctx.body = "";
            
            return fallBack('proporcioname la dirección del lugar donde se realizara el evento porfavor.');

        }
    );


const askBundle = addKeyword(EVENTS.ACTION)
    .addAnswer("Para su tipo de evento ofrecemos los siguientes paquetes:", { delay: 1000 })
    .addAction(
        async (ctx, { flowDynamic }) => {
            const selectedEventType = ctx.body;
            userInputs.eventId = (await axios.get(`http://localhost:3001/events/by-name/${selectedEventType}`)).data.id;


            try {
                const response = await axios.get(`http://localhost:3001/bundle/by-event-type/${selectedEventType}`);
                bundles = response.data;
                bundleOptions = bundles.map(bundle => bundle.name.toLowerCase());
                bundleList = bundleOptions.join('\n');

                const responseSales = await axios.get(`http://localhost:3001/sale-bundles/by-event-type/${selectedEventType}`);
                saleBundle = responseSales.data;
                saleBundleOptions = saleBundle.map(saleBundle => saleBundle.name.toLowerCase());
                saleBundleList = saleBundleOptions.join('\n');


                if (!Array.isArray(bundles) || bundles.length === 0) {
                    return await flowDynamic("Lo siento, no se pudieron cargar los paquetes.");
                }

                for (const bundle of bundles) {
                    await flowDynamic([{
                        body: bundle.name, // Send the bundle name
                        media: join('assets', bundle.url),
                        delay: 100
                    }]);
                }
                if (Array.isArray(saleBundle) || saleBundle.length < 0) {
                    await flowDynamic("También tenemos las siguientes promociones");
                    for (const sale of saleBundle) {
                        await flowDynamic([{
                            body: sale.name, // Send the bundle name
                            media: join('assets', sale.url),
                            delay: 100
                        }]);
                    }
                }


                await flowDynamic("Escriba el que desee contratar");

            } catch (error) {
                console.error(error);
                return await flowDynamic('Error al obtener los paquetes.');
            }
        })
    .addAction({ capture: true }, async (ctx, { fallBack, gotoFlow, flowDynamic }) => {
        try {
            const input = ctx.body.toLowerCase().trim();
            if (bundleOptions.includes(input)) {
                const selectedBundle = bundles.find(bundle => bundle.name.toLowerCase() === input);
                userInputs.bundleID = selectedBundle.id;
                userInputs.bundleName=input;
                return gotoFlow(askPlace);
            } else if (saleBundleOptions.includes(input)){
                const selectedBundle = saleBundle.find(saleBundle => saleBundle.name.toLowerCase() === input);
                userInputs.bundleID = selectedBundle.id;
                return gotoFlow(askPlace);
            }else {
                await flowDynamic('La opción seleccionada no existe o es errónea, por favor intente nuevamente.');
                await flowDynamic(`Los paquetes disponibles son:`);

                for (const bundle of bundles) {
                    await flowDynamic([{
                        body: bundle.name, // Send the bundle name
                        media: join('assets', bundle.url),
                        delay: 100
                    }]);
                }
                await flowDynamic("También tenemos las siguientes promociones");
                    for (const sale of saleBundle) {
                        await flowDynamic([{
                            body: sale.name, // Send the bundle name
                            media: join('assets', sale.url),
                            delay: 100
                        }]);
                    }

                return fallBack();
            }
        } catch (error) {
            console.error(error);
            await flowDynamic('Error al procesar evento');
        }
    });

const askEvent = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic, gotoFlow }) => {
        await flowDynamic('Genial ' + userInputs.name + ', aquí en Eilyn Garcia Fotografía ofrecemos servicio para los siguientes eventos:');
        await flowDynamic('Seleccione su evento escribiendo el nombre del evento:');


        try {
            const response = await axios.get('http://localhost:3001/events');
            events = response.data;
            eventOptions = events.map(event => event.event.toLowerCase());
            eventList = eventOptions.join('\n');

            if (!eventOptions.length) {
                await flowDynamic("Lo siento, hubo un error al intentar cargar los eventos.");
                return gotoFlow(flowPrincipal);
            } else {
                await flowDynamic(`Los eventos disponibles son:\n${eventList}\n`);
            }
        } catch (error) {
            console.error(error);
            
            await flowDynamic('Error al cargar eventos');
            return gotoFlow(flowPrincipal);
        }
    })
    .addAction({ capture: true }, async (ctx, { fallBack, gotoFlow, flowDynamic }) => {
        try {
            const input = ctx.body.toLowerCase().trim();
            if (eventOptions.includes(input)) {
                const selectedEvent = events.find(event => event.event.toLowerCase() === input);
                userInputs.eventId = selectedEvent.id;
                return gotoFlow(askBundle);
            } else {
                await flowDynamic('La opción seleccionada no existe o es errónea, por favor intente nuevamente.');
                return fallBack(`Los eventos disponibles son:\n${eventList}\n`);

            }
        } catch (error) {
            console.error(error);
            await flowDynamic('Error al procesar evento');
        }
    });


const hireServices = addKeyword(EVENTS.ACTION)
    .addAnswer(["Gracias por escoger nuestros servicios fotográficos"])
    .addAnswer(["Para comenzar, ¿puede decirme el nombre de la persona a la que tomaremos fotos"])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.trim();

            if (input.length < 50 && !(emojiRegex.test(input))) {

                if (!(emojiRegex.test(input))) {
                    userInputs.name = input;

                    return gotoFlow(askEvent);

                    ;
                }
            }
            await flowDynamic('Disculpe los inconvenientes, pero el nombre proporcionado es inválido o contiene caracteres o emojis que no están permitidos.');
            ctx.body = "";
            return fallBack('¿Puede decirme el nombre de la persona a la que tomaremos fotos?.');

        }
    );


    const mediaFlow = addKeyword(EVENTS.MEDIA)
  .addAnswer('Disculpa, pero no podemos leer imagenes o video, por favor contesta mediante mensajes de texto')

  const documentFlow = addKeyword(EVENTS.DOCUMENT)
  .addAnswer('Disculpa, pero no podemos leer documentos, por favor contesta mediante mensajes de texto')

  const audioFlow = addKeyword(EVENTS.VOICE_NOTE)
  .addAnswer('Disculpa, pero no podemos escuchar audios, por favor contesta mediante mensajes de texto')
  const locationFLow = addKeyword(EVENTS.LOCATION)
  .addAnswer('Disculpa, pero no interpretar lugares, por favor contesta mediante mensajes de texto')

  



const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer(["Hola, bienvenido al ChatBot de Eilyn Garcia Fotografía!"])
    .addAnswer([
        "¿En qué puedo ayudarle?\n" +
        "👉 *Contratar servicios*: para contratar alguno de nuestros paquetes fotográficos\n" +
        "👉 *Consultar información*: para consultar información acerca de nuestros servicios\n" +
        "👉 *Hablar con un empleado*: para redirigirlo con un empleado"])
    .addAction(
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const input = ctx.body.toLowerCase().trim();
            if (input === 'contratar servicios' || input === 'contratar servicio') {
                await flowDynamic('Usted ha seleccionado *Contratar servicios*.');
                return gotoFlow(hireServices);
            } else if (input === 'consultar información') {
                await flowDynamic('Usted ha seleccionado *Consultar información*. Aquí tiene la información que necesita...');
                return gotoFlow(consultInformation);
            } else if (input === 'hablar con un empleado') {
                await flowDynamic('Redirigiéndole con un empleado...');
                return gotoFlow(talkToAnEmployee);
            } else {
                await flowDynamic('La opción seleccionada no existe, por favor intente nuevamente.');
                await flowDynamic(
                    "¿En qué puedo ayudarle?\n" +
                    "👉 *Contratar servicios*: para contratar alguno de nuestros paquetes fotográficos\n" +
                    "👉 *Consultar información*: para consultar información acerca de nuestros servicios\n" +
                    "👉 *Hablar con un empleado*: para redirigirlo con un empleado");
                return fallBack();
            }
        }
    );


    
const consultInformation = addKeyword(["Consultar informacion"])
    .addAnswer(["Esta es la informacion de nuestro horario y promociones existentes"])
    .addAnswer(["Para comenzar, ¿puede decirme el nombre de la persona a la que tomaremos fotos"]);

const talkToAnEmployee = addKeyword(["Hablar con un empleado"])
    .addAnswer(["Gracias por contactar con nuestros servicios fotográficos"])
    .addAnswer(["Espere unos momentos, nos contactaremos con usted lo antes posible!"])
    .addAnswer(["Si desea volver al menu principal escriba 'Hola' o 'Menu principal'."]);


const main = async () => {
    const adapterFlow = createFlow([flowPrincipal, hireServices, askEvent, askBundle, askPlace, askDay,askMonth,askYear,askHour,ending,documentFlow,locationFLow,mediaFlow,audioFlow,validateAppointmentInfo])

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
        const { message, urlMedia } = req.body
        const fixedNumber = '6442304259' // Coloca aquí el número deseado
        await bot.sendMessage(fixedNumber, message, { media: urlMedia ?? null })
        return res.end('sended')
    })
)


adapterProvider.server.post(
  '/v1/notify',
  handleCtx(async (bot, req, res) => {
    try {
      const { number, message } = req.body;
 await bot.sendMessage(number, message, {});
      return res.end('notificación enviada');
    } catch (error) {
      console.error('Dispatch Error:', error);
      return res.end(JSON.stringify({
        error: error.message || error,
        code: error.code,
        docs: "https://builderbot.vercel.app/errors"
      }));
    }
  })
);
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