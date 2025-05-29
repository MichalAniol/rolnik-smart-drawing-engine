const simulation = (function () {
    const { params } = initData
    const { questionInSession, lastGood } = params
    const { markCells, drawCells } = drawing
    const { getDateAtNoonInXDays } = globalHelpers


    const prepareAnswers = () => {
        // const now = new Date().getTime()
        const now = getDateAtNoonInXDays(initData.dayIndex)

        initData.answers.forEach(a => {
            if (!a) return

            if (a.expectedUse < now) {
                a.expectedUse = getDateAtNoonInXDays(0, now)
            }
        })
    }

    const selectByTemperature = (array: TensorDataT[], temperature: number, num: number) => {
        if (temperature < 0) {
            throw new Error("Temperature musi być w zakresie od 0 do 1.")
        }

        if (temperature > 1) temperature = 1

        if (num > array.length) {
            throw new Error("Nie można wybrać więcej elementów niż zawiera tablica.")
        }

        // Parametr krzywizny rozkładu – im niższa temperatura, tym bardziej skupione na początku
        const baseSharpness = 50 // może być też np. 20, jeśli chcesz mocniejsze skupienie
        const k = baseSharpness * (1 - temperature)

        // Oblicz wagi wg odwróconego logarytmu
        const weights = array.map((_, i) => 1 / Math.log(k * i + 2))

        // Losowanie bez powtórzeń wg wag
        const result: TensorDataT[] = []
        const usedIndices = new Set<number>()

        while (result.length < num) {
            // Suma wag nieużytych
            const totalWeight = weights.reduce((sum, w, i) => usedIndices.has(i) ? sum : sum + w, 0)
            let rand = Math.random() * totalWeight * temperature

            for (let i = 0; i < array.length; i++) {
                if (usedIndices.has(i)) continue
                rand -= weights[i]
                if (rand <= 0) {
                    result.push(array[i])
                    usedIndices.add(i)
                    break
                }
            }
        }

        return result
    }

    const makeAnswers = (sessionData: TensorDataT[]) => {
        // const now = new Date().getTime()
        const now = getDateAtNoonInXDays(initData.dayIndex)

        const checkIfLearned = (distribution: number, numResult: number, answer: AnswerT) => {
            if (answer) {
                const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp)
                const lastFew = sortedHistory.slice(0, lastGood)
                const result = lastFew.filter(entry => !entry.result).length
                if (result === 0) return true
            }

            // console.log('%c distribution:', 'background: #ffcc00; color: #003300', distribution, numResult)
            if (distribution <= numResult) return true
            const rand = Math.random()
            // console.log('%c rand:', 'background: #ffcc00; color: #003300', rand, initData.params.intelligence)
            return initData.params.intelligence > rand
        }

        const getNextExpectedUse = (answer: AnswerT) => {
            // krok 1: przefiltruj tylko pozytywne odpowiedzi
            const positives = answer.history
                .filter(entry => entry.result)
                .sort((a, b) => b.timestamp - a.timestamp) // od najnowszych
                .slice(0, initData.params.lastGood)

            if (positives.length < 2) return 1

            // krok 2: przelicz timestampy na ilość dni od teraz
            const now = Date.now();
            const daysAgo = positives
                .map(entry => Math.floor((now - entry.timestamp) / (1000 * 60 * 60 * 24)))
                .sort((a, b) => a - b); // rosnąco (od najstarszego)

            // krok 3: policz odstępy między dniami
            const spaces: number[] = []
            for (let i = 1; i < daysAgo.length; i++) {
                spaces.push(daysAgo[i] - daysAgo[i - 1])
            }

            // krok 4: znajdź matching podciąg w initData.params.repetition
            for (let i = 0; i <= initData.params.repetition.length - spaces.length; i++) {
                const slice = initData.params.repetition.slice(i, i + spaces.length)
                const matches = slice.every((val, idx) => val === spaces[idx])
                if (matches) {
                    return initData.params.repetition[i + spaces.length] ?? null
                }
            }

            return 1
        }

        sessionData.forEach((item) => {
            const distribution = initData.distribution[item.i]
            const answer = initData.answers[item.i]
            if (answer) {
                const numResult = answer.history.length
                answer.history.push({
                    timestamp: getDateAtNoonInXDays(0, now),
                    result: checkIfLearned(distribution, numResult, answer)
                })
                answer.expectedUse = getNextExpectedUse(answer)
            } else {
                initData.answers[item.i] = {
                    history: [{
                        timestamp: getDateAtNoonInXDays(0, now),
                        result: checkIfLearned(distribution, 1, answer),
                    }],
                    expectedUse: getDateAtNoonInXDays(1, now)
                }
            }
        })
    }

    const runOnce = () => {
        prepareAnswers()
        const analyzedData = analize.getData()

        const sessionData = selectByTemperature(analyzedData, initData.weights.temperature, questionInSession)
        // const testSession = sessionData.filter((elem, i) => i < 10).map(elem => elem.id)
        // console.log('%c testSession:', 'background: #ffcc00; color: #003300', testSession)

        // console.log('%c sessionData:', 'background: #ffcc00; color: #003300', sessionData)

        makeAnswers(sessionData)

        drawCells()
        markCells(sessionData)

        initData.dayIndex++
    }
    return {
        runOnce
    }
}())
