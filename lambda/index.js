/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to the Unit Converter, you can say: Convert 10 meters to feet, or just say Cancel to stop. How can I help you?',
            HELP_MESSAGE: 'You can say convert 10 meters to feet, or you can say exit. How can I help you?',
            GOODBYE_MESSAGE: 'Goodbye Angel!',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again Angel.',
            CONVERSION_RESULT: ' are equal to... ',
            END_MSG: '. If you want another conversion say... Convert fifty centimeters to inches... or if you want to stop me just say Cancel! ...so how can I help you?',
            
            UNITS: {
                'centimeters': { 'inches': 0.393701, 'feet': 0.0328084, 'yards': 0.0109361 },
                'meters': { 'inches': 39.3701, 'feet': 3.28084, 'yards': 1.09361 },
                'kilometers': { 'inches': 39370.1, 'feet': 3280.84, 'yards': 1093.61 },
                'inches': { 'centimeters': 2.54, 'meters': 0.0254, 'kilometers': 0.0000254 },
                'feet': { 'centimeters': 30.48, 'meters': 0.3048, 'kilometers': 0.0003048 },
                'yards': { 'centimeters': 91.44, 'meters': 0.9144, 'kilometers': 0.0009144 }
            }
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido al Conversor de Unidades, puedes decir: Convierte 10 metros a pies, o simplemente di Cancelar para detener. ¿Cómo te puedo ayudar?',
            HELP_MESSAGE: 'Puedes decir convierte 10 metros a pies, o puedes decir salir. ¿Cómo te puedo ayudar?',
            GOODBYE_MESSAGE: '¡Adiós Angel!',
            ERROR_MESSAGE: 'Lo siento, hubo un error. Por favor intenta de nuevo Angel.',
            CONVERSION_RESULT: ' son equivalentes a... ',
            END_MSG: '. Si quieres otra conversión di... Convierte cincuenta centímetros a pulgadas... o si quieres detenerme solo di ¡Cancelar! ...entonces ¿en qué puedo ayudarte?',
            
            UNITS: {
                'centímetros': { 'pulgadas': 0.393701, 'pies': 0.0328084, 'yardas': 0.0109361 },
                'metros': { 'pulgadas': 39.3701, 'pies': 3.28084, 'yardas': 1.09361 },
                'kilómetros': { 'pulgadas': 39370.1, 'pies': 3280.84, 'yardas': 1093.61 },
                'pulgadas': { 'centímetros': 2.54, 'metros': 0.0254, 'kilómetros': 0.0000254 },
                'pies': { 'centímetros': 30.48, 'metros': 0.3048, 'kilómetros': 0.0003048 },
                'yardas': { 'centímetros': 91.44, 'metros': 0.9144, 'kilómetros': 0.0009144 }
            }
        }
    }
};

const ConvertUnitsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertUnitsIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const { unitFrom, unitTo, value } = handlerInput.requestEnvelope.request.intent.slots;
        const unitConversions = requestAttributes.t('UNITS');

        const fromUnit = unitFrom.value.toLowerCase();
        const toUnit = unitTo.value.toLowerCase();
        const amount = parseFloat(value.value);
        
        if (unitConversions[fromUnit] && unitConversions[fromUnit][toUnit]) {
            const conversionFactor = unitConversions[fromUnit][toUnit];
            const result = amount * conversionFactor;
            const speakOutput = amount + ' ' +  fromUnit + requestAttributes.t('CONVERSION_RESULT') + result.toFixed(2) + ' ' + toUnit + requestAttributes.t('END_MSG');

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        } else {
            const speechText = `Lo siento, no puedo convertir de ${fromUnit} a ${toUnit}.`;
            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('WELCOME_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('HELP_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('GOODBYE_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('FALLBACK_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('ERROR_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertUnitsIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();