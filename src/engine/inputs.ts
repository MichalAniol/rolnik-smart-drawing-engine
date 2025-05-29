const inputs = (function () {
    const { getAllById } = dom

    const weightsParams = {
        lastUsed: 'last-used',
        nextUse: 'next-use',
        appearance: 'appearance',
        rating: 'rating',
        littleUsed: 'little-used',
        temperature: 'temperature',
    } as const
    type WeightsParamsKeysT = keyof typeof weightsParams
    type WeightsParamsValuesT = typeof weightsParams[WeightsParamsKeysT]

    const weightsEndParams = {
        lastUsed: 'last-used-end',
        nextUse: 'next-use-end',
        appearance: 'appearance-end',
        rating: 'rating-end',
        littleUsed: 'little-used-end',
        temperature: 'temperature-end',
    } as const
    type WeightsEndParamsKeysT = keyof typeof weightsEndParams
    type WeightsEndParamsValuesT = typeof weightsEndParams[WeightsEndParamsKeysT]

    const weightsMonitor = {
        lastUsed: 'last-used-monitor',
        nextUse: 'next-use-monitor',
        appearance: 'appearance-monitor',
        rating: 'rating-monitor',
        littleUsed: 'little-used-monitor',
        temperature: 'temperature-monitor',
    } as const
    type WeightsMonitorKeysT = keyof typeof weightsMonitor
    type WeightsMonitorValuesT = typeof weightsMonitor[WeightsMonitorKeysT]

    const allInputs = {
        numberOfSimulations: 'number-of-simulations',
        questionInSession: 'question-in-session',
        lastGood: 'last-good',
        intelligence: 'intelligence',
        questionsDistribution: 'questions-distribution',
        weightsParams,
        weightsEndParams,
        weightsMonitor,
    } as const
    type AllInputsKeysT = keyof typeof allInputs
    type AllInputsValuesT = typeof allInputs[AllInputsKeysT]

    const all: RecursiveHTMLElement<typeof allInputs> = getAllById(allInputs)
    console.log('%c all:', 'background: #ffcc00; color: #003300', all)

    type AllWeightsT = typeof all.weightsParams | typeof all.weightsEndParams | typeof all.weightsMonitor
    const weightsNames = Object.keys(all.weightsMonitor) as (keyof WeightsT)[]

    const getQuestionsDistribution = () => {
        // all.questionsDistribution.
    }

    const weightsOrigin: WeightsT = {
        lastUsed: 0.1, // ostatnie użycie pytania
        nextUse: 0.3, // następne planowane użycie pytania
        appearance: 0.1, // w ilu testach pojawiło się pytanie
        rating: 1.2, // poziom nauki pytań
        littleUsed: 0, // najmniej powtarzalne pytania
        temperature: 0.1, // wielkośc zbioru do losowania
    }

    const weightsEndingOrigin: WeightsT = {
        lastUsed: 0.2, // ostatnie użycie pytania
        nextUse: 0.5, // następne planowane użycie pytania
        appearance: 0.1, // w ilu testach pojawiło się pytanie
        rating: 2, // poziom nauki pytań
        littleUsed: 2, // najmniej powtarzalne pytania
        temperature: 1,
    }

    const get = (weightsCurrentOrigin: WeightsT, weightsCurrent: AllWeightsT) => {
        const weights: Partial<WeightsT> = {}

        weightsNames.forEach((key, i) => {
            const elem = weightsCurrent[key] as HTMLInputElement
            const value = elem.value

            if (value === '') {
                weights[key] = weightsCurrentOrigin[key]
                elem.value = weightsCurrentOrigin[key].toString()
            } else {
                weights[key] = Number(value)
            }
        })

        return weights as WeightsT
    }

    const getWeights = () => get(weightsOrigin, all.weightsParams)
    const getWeightsEnding = () => get(weightsEndingOrigin, all.weightsEndParams)

    const drawWeightsMonitor = (weights: WeightsT) => {
        weightsNames.forEach((key, i) => {
            const elem = all.weightsMonitor[key] as HTMLParagraphElement
            elem.innerHTML = weights[key].toFixed(2)
        })
    }

    return {
        all,
        getWeights,
        getWeightsEnding,
        drawWeightsMonitor,
    }
}())