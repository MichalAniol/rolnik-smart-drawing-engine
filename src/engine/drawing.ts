const drawing = (function () {
    const NO_ANSWER_1 = '#132366'
    const NO_ANSWER_4 = '#4762d7'

    const BAD_ANSWER = '#970d0d'
    const GOOD_ANSWER = '#0d972f'

    const { cell, table, numQuestions, answers, questions, params } = initData
    const { lastGood } = params
    const { byId, prepare } = dom

    const monitor = byId('monitor') as HTMLCanvasElement
    const mCtx = monitor.getContext("2d")

    const numQuestionsElem = byId('num-questions') as HTMLSpanElement
    numQuestionsElem.innerHTML = numQuestions.toString()

    const session = byId('session') as HTMLDivElement
    const sessionTitle = byId('session-title') as HTMLDivElement

    const width = (table.width * cell.width) + ((table.width - 1) * cell.space)
    const height = (table.height * cell.height) + ((table.height - 1) * cell.space)

    monitor.width = width
    monitor.height = height

    type RgbT = {
        r: number,
        g: number,
        b: number
    }

    const hexToRgb = (hex: string): RgbT => {
        hex = hex.trim().replace(/^#/, '') // usuwa # i białe znaki
        if (hex.length !== 6) {
            throw new Error(`Nieprawidłowy format koloru HEX: "${hex}"`)
        }
        const bigint = parseInt(hex, 16)
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        }
    }

    const mix = (from: RgbT, to: RgbT, ratio: number) => {
        const rgb = {
            r: Math.round(from.r + (to.r - from.r) * ratio),
            g: Math.round(from.g + (to.g - from.g) * ratio),
            b: Math.round(from.b + (to.b - from.b) * ratio)
        }

        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    }

    const aFrom = hexToRgb(BAD_ANSWER)
    const aTo = hexToRgb(GOOD_ANSWER)

    const noFrom = hexToRgb(NO_ANSWER_1)
    const noTo = hexToRgb(NO_ANSWER_4)

    const getColor = (answer: AnswerT | null, question: QuestionT) => {

        if (!answer || answer.history.length === 0) {
            const ratio = question.used.length / 4
            return mix(noFrom, noTo, ratio)
        }

        const latestAnswers = [...answer.history].sort((a, b) => b.timestamp - a.timestamp).slice(0, lastGood)
        const total = latestAnswers.length
        const correct = latestAnswers.filter(q => q.result).length
        const ratio = correct / total // <<<<<

        return mix(aFrom, aTo, ratio)
    }


    const drawCells = () => {
        // mCtx.fillStyle = 'rgb(71, 98, 215)'
        for (let i = 0; i < answers.length; ++i) {
            const pozX = (i % table.width) * (cell.width + cell.space)
            const pozY = Math.floor(i / table.width) * (cell.height + cell.space)
            const answer = answers[i]
            const question = questions[i]

            const color = getColor(answer, question)
            mCtx.fillStyle = color
            mCtx.fillRect(pozX, pozY, cell.width, cell.height);
        }
    }
    drawCells()

    let sessionIndex = 0
    // zaznacza pytania użyte w danej sesji
    const markCells = (data: TensorDataT[]) => {
        sessionIndex++

        mCtx.lineWidth = 2
        mCtx.strokeStyle = 'rgb(216, 19, 19)'

        const oldSessionBox = byId('session-box') as HTMLDivElement
        if (oldSessionBox) prepare(oldSessionBox, { delete: true })

        const sessionBox = prepare('div', { id: 'session-box' })
        prepare(session, { children: [sessionBox] })

        prepare(sessionTitle, { inner: `Session: ${sessionIndex}` })

        const children: (HTMLElement | HTMLImageElement)[] = []
        data.forEach((d) => {
            const pozX = (d.i % table.width) * (cell.width + cell.space)
            const pozY = Math.floor(d.i / table.width) * (cell.height + cell.space)

            mCtx.beginPath()
            mCtx.rect(pozX + 2, pozY + 2, cell.width - 4, cell.height - 4)
            mCtx.stroke()

            children.push(
                prepare('div', {
                    classes: ['session-item'],
                    inner: `question-${d.id}`
                })
            )
        })
        prepare(sessionBox, { children })
    }

    return {
        drawCells,
        markCells,
    }
}())
