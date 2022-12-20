/* *
 * Super Adega
 *
 * Desenvolvido por: 
 *
 *    Fábio Berbert de Paula <sou@mestrefabio.com>
 *    Instagram: @alexabolada
 *
 * Início: 12-2022
 *
 * */
const Alexa = require('ask-sdk-core')
const tools = require('./functions')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
  },
  handle(handlerInput) {
    // frase de boas vindas
    const speakOutput = 'Por favor, fale o nome do vinho que deseja maiores informações'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

const VinhoGetIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'VinhoIntent'
      && !handlerInput.requestEnvelope.request.intent.slots.vinho.value
  },
  handle(handlerInput) {
    const speakOutput = 'Mais algum vinho?'
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .addElicitSlotDirective('vinho')
      .getResponse()
  }
}

const VinhoIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'VinhoIntent'
      && handlerInput.requestEnvelope.request.intent.slots.vinho.value
  },
  async handle(handlerInput) {
    // recuperar o nome do vinho da pessoa
    const vinho = handlerInput.requestEnvelope.request.intent.slots.vinho.value

    // sair se responder não
    if ( vinho.match(/(não|nao)/) && vinho.length < 5 ) {
      return handlerInput.responseBuilder
        .speak('Espero ter ajudado. Até a próxima!')
        .getResponse()
    }

    /* const speakOutput = await tools.askOpenAi(`
      fale sobre o vinho ${vinho}, seja o mais objetivo possível, 
      me dê uma descrição curta
      `)
    console.log(speakOutput)
    */

    const speakOutput = `estou aqui no vinho ${vinho}`

    return handlerInput.responseBuilder
      .speak(speakOutput.replace(/^[^a-zA-Z0-9]*/, ''))
      .reprompt('Mais algum vinho?')
      .getResponse()
      // .addElicitSlotDirective('vinho')
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    const speakOutput = 'Fale o nome de qualquer vinho e eu lhe trarei maiores informações.'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
  },
  handle(handlerInput) {
    const speakOutput = 'Espero ter ajudado. Até a próxima!'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse()
  }
}
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
  },
  handle(handlerInput) {
    const speakOutput = 'Desculpe, estava distraída e não entendi o que você falou. Por favor tente novamente.'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`)
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse() // notice we send an empty response
  }
}
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope)
    const speakOutput = `You just triggered ${intentName}`

    return handlerInput.responseBuilder
      .speak(speakOutput)
    //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
      .getResponse()
  }
}
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    const speakOutput = 'Me desculpe, eu dei uma cochilada. Por favor tente novamente.'
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    VinhoIntentHandler,
    VinhoGetIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler)
  .addErrorHandlers(
    ErrorHandler)
  .withCustomUserAgent('sample/hello-world/v1.2')
  .lambda()
