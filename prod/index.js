const setConsole = () => (function () {
    let styles = [
        'background: linear-gradient(169deg, #f60707 0%, #ffd600 38%, #edff00 51%, #c4ed18 62%, #00ff19 100%)',
        'border: 1px solid #3E0E02',
        'width: 220px',
        'color: black',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 30px',
        'text-align: center',
        'font-weight: bold',
        'font-size: 24px',
        'margin: 10px 0',
        'padding: 10px 0 15px 0'
    ].join(';');
    console.log('%c👉👈', styles);
    let styles2 = [
        'background: linear-gradient(169deg, #f60707 0%, #ffd600 38%, #edff00 51%, #c4ed18 62%, #00ff19 100%)',
        'border: 1px solid #3E0E02',
        'width: 220px',
        'color: black',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 18px',
        'text-align: center',
        'font-weight: bold',
        'font-size: 16px',
        'margin: 10px 0',
        'padding: 10px 0 15px 0'
    ].join(';');
    console.log('%c   𝒂𝒖𝒕𝒐𝒓: 𝐌𝐢𝐜𝐡𝐚𝐥 𝐀𝐧𝐢𝐨𝐥 😎   ', styles2);
}());
class AssertionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AssertionError';
    }
}
const isNotNull = (value) => {
    if (value === null) {
        throw new AssertionError(`Passed value ${value} is nullable`);
    }
};
const globalHelpers = (function () {
    const getDateAtNoonInXDays = (daysPlus, date) => {
        const newDate = date ? new Date(date) : new Date();
        const targetDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + daysPlus, 12, 0, 0, 0);
        return targetDate.getTime();
    };
    const isSameDay = (date1Ms, date2Ms) => {
        const date1 = new Date(date1Ms);
        const date2 = new Date(date2Ms);
        return (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate());
    };
    return {
        getDateAtNoonInXDays,
        isSameDay,
    };
}());
const checked = {
    yes: 'yes',
    no: 'no',
};
const getStorage = async () => {
    const names = {
        test: 'test',
    };
    const defaultData = {
        test: 'test-test',
    };
    const isValidJSONStringify = (str) => {
        try {
            JSON.stringify(str);
            return true;
        }
        catch {
            return false;
        }
    };
    const set = (key, value) => {
        if (isValidJSONStringify(value)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
        else {
            localStorage.setItem(key, value.toString());
        }
    };
    const isValidJSONParse = (str) => {
        try {
            JSON.stringify(str);
            return true;
        }
        catch {
            return false;
        }
    };
    const get = (key) => {
        const value = localStorage.getItem(key);
        if (!value)
            return null;
        if (typeof value === 'boolean')
            return `${value}`;
        if (isValidJSONParse(value)) {
            return JSON.parse(value);
        }
        else {
            return value.toString();
        }
    };
    const initData = () => {
        const list = Object.keys(names);
        list.forEach((k) => {
            const data = get(k);
            if (!data && defaultData[k])
                set(k, defaultData[k]);
        });
    };
    initData();
    return {
        names,
        set,
        get,
    };
};
const dom = (function () {
    const byId = (id) => {
        return document.getElementById(id);
    };
    const byQuery = (query) => document.querySelector(query);
    const byQueryAll = (query) => document.querySelectorAll(query);
    const byQ = (elem, query) => elem.querySelector(query);
    const byQAll = (elem, query) => elem.querySelectorAll(query);
    const getAllById = (obj) => {
        const results = {};
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            if (typeof value === "string") {
                results[key] = byId(value);
            }
            else if (Array.isArray(value)) {
                results[key] = value.map(id => byId(id));
            }
            else if (typeof value === "object" && value !== null) {
                results[key] = getAllById(value);
            }
        });
        return results;
    };
    const prepare = (node, options) => {
        const elem = typeof node === "string" ? document.createElement(node) : node;
        if (elem && elem instanceof HTMLElement) {
            if (options.delete) {
                elem.remove();
                return;
            }
            if (options?.id)
                elem.id = options.id;
            options?.classes?.forEach((c) => elem.classList.add(c));
            options?.children?.forEach((c) => elem.appendChild(c));
            if (options?.src && elem instanceof HTMLImageElement) {
                elem.src = options.src;
            }
            if (options?.inner) {
                elem.textContent = options.inner;
            }
            if (options?.position) {
                elem.style.left = `${options.position.x}px`;
                elem.style.top = `${options.position.y}px`;
            }
            return elem;
        }
    };
    const setStyle = (element, style, value) => element.style[style] = value;
    const setAllStyles = (styles) => styles.forEach((s) => setStyle(s[0], s[1], s[2]));
    const setAttribute = (element, attribute, value) => element.setAttribute(attribute, value);
    const setAllAttributes = (attributes) => attributes.forEach((a) => a[0].setAttribute(a[1], a[2]));
    const disable = (elem) => elem.setAttribute('disabled', '');
    const enable = (elem) => elem.removeAttribute('disabled');
    const check = (elem) => elem.checked = true;
    const uncheck = (elem) => elem.checked = false;
    const display = (elem, attribute) => elem.style.display = attribute;
    const setColor = (elem, color) => elem.style.color = color;
    const removeClass = (elem, attribute) => elem.classList.remove(attribute);
    const addClass = (elem, attribute) => elem.classList.add(attribute);
    const colors = {
        line: 'var(--line_color)',
        prime: 'var(--prime_color)',
        off1: 'var(--off_prime_color)',
        off2: 'var(--off_second_color)',
    };
    const add = (elem, name, fn) => elem.addEventListener(name, fn);
    const xmlns = 'http://www.w3.org/2000/svg';
    const newNS = (name) => document.createElementNS(xmlns, 'rect');
    return {
        byId,
        byQuery,
        byQueryAll,
        byQ,
        byQAll,
        getAllById,
        prepare,
        setStyle,
        setAllStyles,
        setAttribute,
        setAllAttributes,
        disable,
        enable,
        check,
        uncheck,
        display,
        setColor,
        removeClass,
        addClass,
        colors,
        add,
        newNS,
    };
}());
const core = {
    store: null,
};
const inputs = (function () {
    const { getAllById } = dom;
    const weightsParams = {
        lastUsed: 'last-used',
        nextUse: 'next-use',
        appearance: 'appearance',
        rating: 'rating',
        littleUsed: 'little-used',
        temperature: 'temperature',
    };
    const weightsEndParams = {
        lastUsed: 'last-used-end',
        nextUse: 'next-use-end',
        appearance: 'appearance-end',
        rating: 'rating-end',
        littleUsed: 'little-used-end',
        temperature: 'temperature-end',
    };
    const weightsMonitor = {
        lastUsed: 'last-used-monitor',
        nextUse: 'next-use-monitor',
        appearance: 'appearance-monitor',
        rating: 'rating-monitor',
        littleUsed: 'little-used-monitor',
        temperature: 'temperature-monitor',
    };
    const allInputs = {
        numberOfSimulations: 'number-of-simulations',
        questionInSession: 'question-in-session',
        lastGood: 'last-good',
        intelligence: 'intelligence',
        questionsDistribution: 'questions-distribution',
        weightsParams,
        weightsEndParams,
        weightsMonitor,
    };
    const all = getAllById(allInputs);
    console.log('%c all:', 'background: #ffcc00; color: #003300', all);
    const weightsNames = Object.keys(all.weightsMonitor);
    const getQuestionsDistribution = () => {
    };
    const weightsOrigin = {
        lastUsed: 0.1,
        nextUse: 0.3,
        appearance: 0.1,
        rating: 1.2,
        littleUsed: 0,
        temperature: 0.1,
    };
    const weightsEndingOrigin = {
        lastUsed: 0.2,
        nextUse: 0.5,
        appearance: 0.1,
        rating: 2,
        littleUsed: 2,
        temperature: 1,
    };
    const get = (weightsCurrentOrigin, weightsCurrent) => {
        const weights = {};
        weightsNames.forEach((key, i) => {
            const elem = weightsCurrent[key];
            const value = elem.value;
            if (value === '') {
                weights[key] = weightsCurrentOrigin[key];
                elem.value = weightsCurrentOrigin[key].toString();
            }
            else {
                weights[key] = Number(value);
            }
        });
        return weights;
    };
    const getWeights = () => get(weightsOrigin, all.weightsParams);
    const getWeightsEnding = () => get(weightsEndingOrigin, all.weightsEndParams);
    const drawWeightsMonitor = (weights) => {
        weightsNames.forEach((key, i) => {
            const elem = all.weightsMonitor[key];
            elem.innerHTML = weights[key].toFixed(2);
        });
    };
    return {
        all,
        getWeights,
        getWeightsEnding,
        drawWeightsMonitor,
    };
}());
const initData = (function () {
    const { getWeights, getWeightsEnding, drawWeightsMonitor } = inputs;
    const generateTriangularSequence = (length) => {
        const result = [];
        let n = 1, current = 0;
        for (let i = 0; i < length; i++) {
            current += n;
            result.push(current);
            n++;
        }
        return result;
    };
    const params = {
        questionInSession: 40,
        lastGood: 3,
        intelligence: 1 / 3,
        repetition: generateTriangularSequence(10),
    };
    const cell = {
        width: 20,
        height: 20,
        space: 2,
    };
    const quantities = [
        16,
        27,
        142,
        611,
    ];
    const questions = [];
    let numQuestions = 0;
    let index = 1;
    quantities.forEach((q, i) => {
        const used = Array(4 - i).fill('u');
        for (let i = 0; i < q; ++i) {
            questions.push({
                id: `${index}`,
                used
            });
            index++;
        }
        numQuestions += q;
    });
    const table = {
        width: Math.ceil(Math.sqrt(numQuestions)),
        height: Math.ceil(Math.sqrt(numQuestions)),
    };
    const questionsDistribution = [1, 10, 50, 20, 30, 10];
    const questionsDistributionSume = questionsDistribution.reduce((acc, val) => acc + val, 0);
    const distributionRatio = numQuestions / questionsDistributionSume;
    const questionsDistributionScaled = questionsDistribution.map(q => Math.round(q * distributionRatio));
    const pureDistribution = [];
    questionsDistributionScaled.forEach((d, i) => {
        for (let j = 0; j < d; ++j)
            pureDistribution.push(i + 1);
    });
    const shuffleArray = (array) => {
        const result = array.slice();
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        while (result.length < numQuestions) {
            result.push(questionsDistributionScaled.length);
        }
        return result;
    };
    const distribution = shuffleArray(pureDistribution);
    const answers = Array(numQuestions).fill(null);
    const weights = getWeights();
    const weightsEnding = getWeightsEnding();
    drawWeightsMonitor(weights);
    const calculateNormalizedDifference = () => {
        const result = {};
        for (const key of Object.keys(weights)) {
            result[key] = (weightsEnding[key] - weights[key]) / 20;
        }
        return result;
    };
    return {
        cell,
        table,
        numQuestions,
        answers,
        questions,
        params,
        distribution,
        weights,
        weightsEnding,
        weightsBit: calculateNormalizedDifference(),
        dayIndex: 1,
    };
}());
const countingCore = (function () {
}());
const drawing = (function () {
    const NO_ANSWER_1 = '#132366';
    const NO_ANSWER_4 = '#4762d7';
    const BAD_ANSWER = '#970d0d';
    const GOOD_ANSWER = '#0d972f';
    const { cell, table, numQuestions, answers, questions, params } = initData;
    const { lastGood } = params;
    const { byId, prepare } = dom;
    const monitor = byId('monitor');
    const mCtx = monitor.getContext("2d");
    const numQuestionsElem = byId('num-questions');
    numQuestionsElem.innerHTML = numQuestions.toString();
    const session = byId('session');
    const sessionTitle = byId('session-title');
    const width = (table.width * cell.width) + ((table.width - 1) * cell.space);
    const height = (table.height * cell.height) + ((table.height - 1) * cell.space);
    monitor.width = width;
    monitor.height = height;
    const hexToRgb = (hex) => {
        hex = hex.trim().replace(/^#/, '');
        if (hex.length !== 6) {
            throw new Error(`Nieprawidłowy format koloru HEX: "${hex}"`);
        }
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    };
    const mix = (from, to, ratio) => {
        const rgb = {
            r: Math.round(from.r + (to.r - from.r) * ratio),
            g: Math.round(from.g + (to.g - from.g) * ratio),
            b: Math.round(from.b + (to.b - from.b) * ratio)
        };
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    };
    const aFrom = hexToRgb(BAD_ANSWER);
    const aTo = hexToRgb(GOOD_ANSWER);
    const noFrom = hexToRgb(NO_ANSWER_1);
    const noTo = hexToRgb(NO_ANSWER_4);
    const getColor = (answer, question) => {
        if (!answer || answer.history.length === 0) {
            const ratio = question.used.length / 4;
            return mix(noFrom, noTo, ratio);
        }
        const latestAnswers = [...answer.history].sort((a, b) => b.timestamp - a.timestamp).slice(0, lastGood);
        const total = latestAnswers.length;
        const correct = latestAnswers.filter(q => q.result).length;
        const ratio = correct / total;
        return mix(aFrom, aTo, ratio);
    };
    const drawCells = () => {
        for (let i = 0; i < answers.length; ++i) {
            const pozX = (i % table.width) * (cell.width + cell.space);
            const pozY = Math.floor(i / table.width) * (cell.height + cell.space);
            const answer = answers[i];
            const question = questions[i];
            const color = getColor(answer, question);
            mCtx.fillStyle = color;
            mCtx.fillRect(pozX, pozY, cell.width, cell.height);
        }
    };
    drawCells();
    let sessionIndex = 0;
    const markCells = (data) => {
        sessionIndex++;
        mCtx.lineWidth = 2;
        mCtx.strokeStyle = 'rgb(216, 19, 19)';
        const oldSessionBox = byId('session-box');
        if (oldSessionBox)
            prepare(oldSessionBox, { delete: true });
        const sessionBox = prepare('div', { id: 'session-box' });
        prepare(session, { children: [sessionBox] });
        prepare(sessionTitle, { inner: `Session: ${sessionIndex}` });
        const children = [];
        data.forEach((d) => {
            const pozX = (d.i % table.width) * (cell.width + cell.space);
            const pozY = Math.floor(d.i / table.width) * (cell.height + cell.space);
            mCtx.beginPath();
            mCtx.rect(pozX + 2, pozY + 2, cell.width - 4, cell.height - 4);
            mCtx.stroke();
            children.push(prepare('div', {
                classes: ['session-item'],
                inner: `question-${d.id}`
            }));
        });
        prepare(sessionBox, { children });
    };
    return {
        drawCells,
        markCells,
    };
}());
const analize = (function () {
    const { answers, questions, params, weights, weightsEnding, weightsBit } = initData;
    const { lastGood } = params;
    const { getDateAtNoonInXDays } = globalHelpers;
    const { drawWeightsMonitor } = inputs;
    const GOOD_ANSWERS_RATIO = .995;
    const now = getDateAtNoonInXDays(initData.dayIndex);
    const countLastFewFalse = (answer) => {
        if (answer) {
            const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp);
            const lastFew = sortedHistory.slice(0, lastGood);
            const result = lastFew.filter(entry => !entry.result).length;
            return result;
        }
        return 0;
    };
    const prepareData = (reverseLastUse) => {
        let maxLastUse = now;
        let maxNextUse = now;
        let maxImportance = 1;
        let maxUsed = 0;
        const preData = questions.map((question, i) => {
            const answer = answers[i];
            let lastUsed = 0;
            let nextUse = 0;
            let rating = 0;
            if (answer !== null) {
                let theLastOne = 0;
                const last = answer.history.forEach(a => {
                    if (a.timestamp > theLastOne)
                        theLastOne = a.timestamp;
                });
                lastUsed = now - theLastOne;
                nextUse = nextUse - now;
                if (maxNextUse < nextUse)
                    maxNextUse = nextUse;
                let allFalsies = countLastFewFalse(answer);
                rating = allFalsies / lastGood;
            }
            if (lastUsed < maxLastUse)
                maxLastUse = lastUsed;
            const appearance = question.used.length;
            if (maxImportance < appearance)
                maxImportance = appearance;
            if (answer && maxUsed < answer.history.length)
                maxUsed = answer.history.length;
            return {
                id: question.id,
                i,
                used: answer ? answer.history.length : 0,
                lastUsed,
                nextUse,
                appearance,
                rating,
            };
        });
        const data = preData.map(p => {
            let lastUsed = p.lastUsed === 0 ? 1 : p.lastUsed / maxLastUse;
            if (reverseLastUse)
                lastUsed = 1 - lastUsed;
            return {
                id: p.id,
                i: p.i,
                used: 1 - (p.used / maxUsed),
                lastUsed,
                nextUse: p.nextUse / maxNextUse,
                appearance: p.appearance / maxImportance,
                rating: p.rating,
            };
        });
        return data;
    };
    const checkGoodAnswers = () => {
        const countLastFewTrue = (answer) => {
            if (answer) {
                const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp);
                const lastFew = sortedHistory.slice(0, lastGood);
                const result = lastFew.filter(entry => !entry.result).length;
                if (result === 0)
                    return true;
            }
            return false;
        };
        let sume = 0;
        initData.answers.forEach(a => {
            if (countLastFewTrue(a))
                sume++;
        });
        return sume;
    };
    const checkWeights = () => {
        const goodAnswersRatio = checkGoodAnswers() / initData.questions.length;
        const fixToFive = (num) => Math.round(num * 100000) / 100000;
        if (goodAnswersRatio > GOOD_ANSWERS_RATIO) {
            if (fixToFive(weights.temperature) !== fixToFive(weightsEnding.temperature)) {
                for (const key of Object.keys(weights)) {
                    weights[key] += weightsBit[key];
                }
            }
        }
    };
    const getNormalizedWeights = () => {
        let sume = 0;
        Object.keys(weights).forEach((key) => sume += weights[key]);
        sume -= weights.temperature;
        const normalizedWeights = { ...weights };
        Object.keys(weights).forEach((key) => normalizedWeights[key] = weights[key] / sume);
        normalizedWeights.temperature = weights.temperature;
        return normalizedWeights;
    };
    const scoringData = (data, weights) => {
        const scoredData = data.map(d => {
            const score = (weights.lastUsed * d.lastUsed) +
                (weights.nextUse * d.nextUse) +
                (weights.appearance * d.appearance) +
                (weights.rating * d.rating) +
                (weights.littleUsed * d.used);
            return { ...d, score };
        });
        return scoredData.sort((a, b) => b.score - a.score);
    };
    const getData = () => {
        const data = prepareData(false);
        checkWeights();
        const normalizedWeights = getNormalizedWeights();
        drawWeightsMonitor(normalizedWeights);
        const result = scoringData(data, normalizedWeights);
        const testAnal = result.filter((elem, i) => i < 50).map(elem => elem.id);
        console.log('%c testAnal:', 'background: #ffcc00; color: #003300', testAnal);
        return result;
    };
    const test = () => {
        let lastUsedTest = true;
        let nextUseTest = true;
        let importanceTest = true;
        let ratingTest = true;
        prepareData(false).forEach(d => {
            if (d.lastUsed < 0 && d.lastUsed > 1)
                lastUsedTest = false;
            if (d.nextUse < 0 && d.nextUse > 1)
                nextUseTest = false;
            if (d.appearance < 0 && d.appearance > 1)
                importanceTest = false;
            if (d.rating < 0 && d.rating > 1)
                ratingTest = false;
        });
        console.log('%c lastUsedTest:', 'background: #ffcc00; color: #003300', lastUsedTest);
        console.log('%c nextUseTest:', 'background: #ffcc00; color: #003300', nextUseTest);
        console.log('%c importanceTest:', 'background: #ffcc00; color: #003300', importanceTest);
        console.log('%c ratingTest:', 'background: #ffcc00; color: #003300', ratingTest);
    };
    test();
    return {
        getData,
    };
}());
const simulation = (function () {
    const { params } = initData;
    const { questionInSession, lastGood } = params;
    const { markCells, drawCells } = drawing;
    const { getDateAtNoonInXDays } = globalHelpers;
    const prepareAnswers = () => {
        const now = getDateAtNoonInXDays(initData.dayIndex);
        initData.answers.forEach(a => {
            if (!a)
                return;
            if (a.expectedUse < now) {
                a.expectedUse = getDateAtNoonInXDays(0, now);
            }
        });
    };
    const selectByTemperature = (array, temperature, num) => {
        if (temperature < 0) {
            throw new Error("Temperature musi być w zakresie od 0 do 1.");
        }
        if (temperature > 1)
            temperature = 1;
        if (num > array.length) {
            throw new Error("Nie można wybrać więcej elementów niż zawiera tablica.");
        }
        const baseSharpness = 50;
        const k = baseSharpness * (1 - temperature);
        const weights = array.map((_, i) => 1 / Math.log(k * i + 2));
        const result = [];
        const usedIndices = new Set();
        while (result.length < num) {
            const totalWeight = weights.reduce((sum, w, i) => usedIndices.has(i) ? sum : sum + w, 0);
            let rand = Math.random() * totalWeight * temperature;
            for (let i = 0; i < array.length; i++) {
                if (usedIndices.has(i))
                    continue;
                rand -= weights[i];
                if (rand <= 0) {
                    result.push(array[i]);
                    usedIndices.add(i);
                    break;
                }
            }
        }
        return result;
    };
    const makeAnswers = (sessionData) => {
        const now = getDateAtNoonInXDays(initData.dayIndex);
        const checkIfLearned = (distribution, numResult, answer) => {
            if (answer) {
                const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp);
                const lastFew = sortedHistory.slice(0, lastGood);
                const result = lastFew.filter(entry => !entry.result).length;
                if (result === 0)
                    return true;
            }
            if (distribution <= numResult)
                return true;
            const rand = Math.random();
            return initData.params.intelligence > rand;
        };
        const getNextExpectedUse = (answer) => {
            const positives = answer.history
                .filter(entry => entry.result)
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, initData.params.lastGood);
            if (positives.length < 2)
                return 1;
            const now = Date.now();
            const daysAgo = positives
                .map(entry => Math.floor((now - entry.timestamp) / (1000 * 60 * 60 * 24)))
                .sort((a, b) => a - b);
            const spaces = [];
            for (let i = 1; i < daysAgo.length; i++) {
                spaces.push(daysAgo[i] - daysAgo[i - 1]);
            }
            for (let i = 0; i <= initData.params.repetition.length - spaces.length; i++) {
                const slice = initData.params.repetition.slice(i, i + spaces.length);
                const matches = slice.every((val, idx) => val === spaces[idx]);
                if (matches) {
                    return initData.params.repetition[i + spaces.length] ?? null;
                }
            }
            return 1;
        };
        sessionData.forEach((item) => {
            const distribution = initData.distribution[item.i];
            const answer = initData.answers[item.i];
            if (answer) {
                const numResult = answer.history.length;
                answer.history.push({
                    timestamp: getDateAtNoonInXDays(0, now),
                    result: checkIfLearned(distribution, numResult, answer)
                });
                answer.expectedUse = getNextExpectedUse(answer);
            }
            else {
                initData.answers[item.i] = {
                    history: [{
                            timestamp: getDateAtNoonInXDays(0, now),
                            result: checkIfLearned(distribution, 1, answer),
                        }],
                    expectedUse: getDateAtNoonInXDays(1, now)
                };
            }
        });
    };
    const runOnce = () => {
        prepareAnswers();
        const analyzedData = analize.getData();
        const sessionData = selectByTemperature(analyzedData, initData.weights.temperature, questionInSession);
        makeAnswers(sessionData);
        drawCells();
        markCells(sessionData);
        initData.dayIndex++;
    };
    return {
        runOnce
    };
}());
(function () {
    getStorage().then((store) => {
        core.store = store;
        setConsole();
        const runBtn = dom.byId('run-btn');
        let index = 0;
        let interval = null;
        const run = () => {
            if (interval === null) {
                interval = window.setInterval(() => {
                    simulation.runOnce();
                    index++;
                }, 100);
            }
        };
        const stop = () => {
            if (interval !== null) {
                clearInterval(interval);
                interval = null;
            }
        };
        dom.add(runBtn, 'mousedown', run);
        dom.add(runBtn, 'mouseup', stop);
    });
}());
