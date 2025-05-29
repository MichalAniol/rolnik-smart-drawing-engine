type AnswerT = {
    history: {
        timestamp: number,
        result: boolean,
    }[],
    expectedUse: number,
}

type QuestionT = {
    question?: string,
    imgSrc?: string,
    imgUrl?: string,
    answer?: string,
    falseAnswers?: string[],
    version?: string,
    id?: string,
    used?: string[],
    firstUsed?: string,
    num?: number,
}
type QuestionsT = QuestionT[]

type ParamsT = {
    questionInSession: number; // ilość elementów w return funkcji
    newToOldRatio: number; // np. 0.3 znaczy 30% nowych, 70% starych (0-1)
    lastGood: number; // ile ostatnich elementów jest ocenianych (1-infinity)
    multiUsedFirst: number; // o ile czesciej mają być wybierane elementy z wysokim answerRatio
}

type WeightsT = {
    lastUsed: number,
    nextUse: number,
    appearance: number,
    rating: number,
    littleUsed: number,
    temperature: number,
}

const initData = (function () {
    const { getWeights, getWeightsEnding, drawWeightsMonitor } = inputs

    const generateTriangularSequence = (length: number) => {
        const result: number[] = []
        let n = 1, current = 0

        for (let i = 0; i < length; i++) {
            current += n;
            result.push(current)
            n++
        }

        return result
    }

    const params = {
        questionInSession: 40,
        lastGood: 3,
        intelligence: 1 / 3, // prawdopodobieństwo na ile % odpowiada dobrze
        repetition: generateTriangularSequence(10),
    }
    // console.log('%c params:', 'background: #ffcc00; color: #003300', params)

    const cell = {
        width: 20,
        height: 20,
        space: 2,
    }

    const quantities = [
        16,
        27,
        142,
        611,
    ]
    const questions: QuestionsT = []
    let numQuestions = 0

    let index = 1
    quantities.forEach((q, i) => {
        const used = Array(4 - i).fill('u') // symuluje ilość użyć pytania w prawdziwym teście
        for (let i = 0; i < q; ++i) {
            questions.push({
                id: `${index}`,
                used
            })
            index++
        }
        numQuestions += q
    })

    const table = {
        width: Math.ceil(Math.sqrt(numQuestions)),
        height: Math.ceil(Math.sqrt(numQuestions)),
    }

    // po ilu próbach ma się pojawić prawidłowa odpowiedź
    // const questionsDistribution = [5, 10, 20, 30, 20, 10, 5]
    const questionsDistribution = [1, 10, 50, 20, 30, 10]

    const questionsDistributionSume = questionsDistribution.reduce((acc, val) => acc + val, 0)
    const distributionRatio = numQuestions / questionsDistributionSume
    const questionsDistributionScaled = questionsDistribution.map(q => Math.round(q * distributionRatio))

    const pureDistribution: number[] = []
    questionsDistributionScaled.forEach((d, i) => {
        for (let j = 0; j < d; ++j) pureDistribution.push(i + 1)
    })

    const shuffleArray = (array: number[]) => {
        const result = array.slice() // kopiujemy tablicę, by nie modyfikować oryginału
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // losowy indeks z zakresu [0, i]
            [result[i], result[j]] = [result[j], result[i]] // zamiana miejscami
        }
        while (result.length < numQuestions) {
            result.push(questionsDistributionScaled.length)
        }

        return result
    }

    const distribution = shuffleArray(pureDistribution)

    const answers: (AnswerT | null)[] = Array(numQuestions).fill(null)

    const weights: WeightsT = getWeights()
    const weightsEnding: WeightsT = getWeightsEnding()
    drawWeightsMonitor(weights)

    const calculateNormalizedDifference = () => {
        const result: Partial<WeightsT> = {};

        for (const key of Object.keys(weights) as (keyof WeightsT)[]) {
            result[key] = (weightsEnding[key] - weights[key]) / 20
        }

        return result as WeightsT
    }

    return {
        cell, // parametry wyświetlania jednej komórki odpowiadającej pytaniu
        table, // tabela z komórkami
        numQuestions, // ilość pytań w sesji
        answers, // symulator pamięci odpowiedzi
        questions, // symulator lista pytań
        params, // parametry wyboru pytania
        distribution, // symulacja szybkości nauki - jak szybko zaczyna odpowiadać tylko dobrze
        weights, // wagi do przeliczania parametrów
        weightsEnding, // wagi po rozwiązaniu wszystkich pytań
        weightsBit: calculateNormalizedDifference(),
        dayIndex: 1,
    }
}())