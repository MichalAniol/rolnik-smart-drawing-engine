
type TensorDataT = {
    id: string;
    i: number; // index
    used?: number; // ile razy użyto
    lastUsed?: number;     // timestamp
    nextUse?: number;      // timestamp
    appearance?: number;   // 0–1
    rating?: number;       // 0–1
    score?: number;
}

const analize = (function () {
    const { answers, questions, params, weights, weightsEnding, weightsBit } = initData
    const { lastGood } = params
    const { getDateAtNoonInXDays } = globalHelpers
    const { drawWeightsMonitor } = inputs


    const GOOD_ANSWERS_RATIO = .995

    // const now = new Date().getTime()
    const now = getDateAtNoonInXDays(initData.dayIndex)

    const countLastFewFalse = (answer: AnswerT) => {
        if (answer) {
            const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp)
            const lastFew = sortedHistory.slice(0, lastGood)
            const result = lastFew.filter(entry => !entry.result).length
            return result
        }
        return 0
    }

    const prepareData = (reverseLastUse: boolean) => {
        let maxLastUse = now
        let maxNextUse = now
        let maxImportance = 1
        let maxUsed = 0

        const preData: TensorDataT[] = questions.map((question, i) => {
            const answer = answers[i]
            let lastUsed = 0
            let nextUse = 0
            let rating = 0

            if (answer !== null) {
                let theLastOne = 0
                const last = answer.history.forEach(a => {
                    if (a.timestamp > theLastOne) theLastOne = a.timestamp
                })
                lastUsed = now - theLastOne

                nextUse = nextUse - now
                if (maxNextUse < nextUse) maxNextUse = nextUse

                let allFalsies = countLastFewFalse(answer)
                rating = allFalsies / lastGood
            }
            if (lastUsed < maxLastUse) maxLastUse = lastUsed

            const appearance = question.used.length
            if (maxImportance < appearance) maxImportance = appearance

            if (answer && maxUsed < answer.history.length) maxUsed = answer.history.length

            return {
                id: question.id,
                i, // index
                used: answer ? answer.history.length : 0,
                lastUsed,
                nextUse,
                appearance,
                rating,
            }
        })

        const data: TensorDataT[] = preData.map(p => {
            // 1 - nieuzyte lub dawno temu, 0 - niedawno
            let lastUsed = p.lastUsed === 0 ? 1 : p.lastUsed / maxLastUse // 1 czym dalej w czasie
            if (reverseLastUse) lastUsed = 1 - lastUsed // 1 czym bliżej w czasie

            return {
                id: p.id,
                i: p.i,
                used: 1 - (p.used / maxUsed), // 1 czym zadziej uzyto
                lastUsed,
                nextUse: p.nextUse / maxNextUse, // 1 czym bliżej w czasie
                appearance: p.appearance / maxImportance, // 1 czym więcej użyte
                rating: p.rating, // 1 czym więcej pomyłek
            }
        })

        return data
    }

    const checkGoodAnswers = () => {
        const countLastFewTrue = (answer: AnswerT) => {
            if (answer) {
                const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp)
                const lastFew = sortedHistory.slice(0, lastGood)
                const result = lastFew.filter(entry => !entry.result).length
                if (result === 0) return true
            }
            return false
        }

        let sume = 0
        initData.answers.forEach(a => {
            if (countLastFewTrue(a)) sume++
        })
        // console.log('%c sume:', 'background: #ffcc00; color: #003300', sume)
        return sume
    }

    type WeightsKeyT = keyof typeof weights

    const checkWeights = () => {
        const goodAnswersRatio = checkGoodAnswers() / initData.questions.length

        const fixToFive = (num: number) => Math.round(num * 100000) / 100000

        if (goodAnswersRatio > GOOD_ANSWERS_RATIO) {
            if (fixToFive(weights.temperature) !== fixToFive(weightsEnding.temperature)) {
                // console.log('%c goodAnswersRatio:', 'background: #ffcc00; color: #003300', goodAnswersRatio, weights)
                for (const key of Object.keys(weights) as (keyof WeightsT)[]) {
                    weights[key] += weightsBit[key]
                }
                // drawWeightsMonitor(weights)
            }
        }
    }

    // Wagi dla cech (suma nie musi być 1, ale lepiej by była)
    const getNormalizedWeights = () => {
        let sume = 0
        Object.keys(weights).forEach((key: WeightsKeyT) => sume += weights[key])
        sume -= weights.temperature

        const normalizedWeights = { ...weights }
        Object.keys(weights).forEach((key: WeightsKeyT) => normalizedWeights[key] = weights[key] / sume)

        normalizedWeights.temperature = weights.temperature
        return normalizedWeights
    }

    const scoringData = (data: TensorDataT[], weights: WeightsT) => {
        const scoredData = data.map(d => {
            const score =
                (weights.lastUsed * d.lastUsed) +
                (weights.nextUse * d.nextUse) +
                (weights.appearance * d.appearance) +
                (weights.rating * d.rating) +
                (weights.littleUsed * d.used)

            return { ...d, score } as TensorDataT
        })

        return scoredData.sort((a, b) => b.score - a.score)
    }

    const getData = () => {
        const data = prepareData(false)
        checkWeights()
        const normalizedWeights = getNormalizedWeights()
        drawWeightsMonitor(normalizedWeights)

        const result = scoringData(data, normalizedWeights)
        const testAnal = result.filter((elem, i) => i < 50).map(elem => elem.id)
        console.log('%c testAnal:', 'background: #ffcc00; color: #003300', testAnal)

        return result
    }

    const test = () => {
        let lastUsedTest: boolean = true
        let nextUseTest: boolean = true
        let importanceTest: boolean = true
        let ratingTest: boolean = true
        prepareData(false).forEach(d => {
            if (d.lastUsed < 0 && d.lastUsed > 1) lastUsedTest = false
            if (d.nextUse < 0 && d.nextUse > 1) nextUseTest = false
            if (d.appearance < 0 && d.appearance > 1) importanceTest = false
            if (d.rating < 0 && d.rating > 1) ratingTest = false
        })
        console.log('%c lastUsedTest:', 'background: #ffcc00; color: #003300', lastUsedTest)
        console.log('%c nextUseTest:', 'background: #ffcc00; color: #003300', nextUseTest)
        console.log('%c importanceTest:', 'background: #ffcc00; color: #003300', importanceTest)
        console.log('%c ratingTest:', 'background: #ffcc00; color: #003300', ratingTest)
    }
    test()

    return {
        getData,
    }
}())
