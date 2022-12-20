// função que irá retornar a resposta da inteligência artificial
const askOpenAi = async (query) => {
  try {
    // setup da openAI  
    const { Configuration, OpenAIApi } = require("openai")
    const configuration = new Configuration({
      apiKey: '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',
    })
    const openai = new OpenAIApi(configuration)

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: query,
      temperature: 1,
      max_tokens: 110,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    })

    // se nenhuma resposta foi recebida...
    if ( response.data.choices.length === 0 )
      return 'Estou com preguiça de responder essa pergunta'
    else
      return response.data.choices[0].text

  } catch (err) {
    return 'Estou com preguiça de responder essa pergunta'
  }
}

module.exports = { askOpenAi }
