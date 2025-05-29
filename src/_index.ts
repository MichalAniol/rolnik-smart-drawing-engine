(function () {

    getStorage().then((store) => {
        core.store = store

        setConsole()

        const runBtn = dom.byId('run-btn')

        let index = 0
        let interval: number | null = null
        const run = () => {
            if (interval === null) {
                interval = window.setInterval(() => {
                    simulation.runOnce()
                    index++
                    // if (index > 150) clearInterval(interval)
                }, 100)
            }
        }

        const stop = (): void => {
            if (interval !== null) {
                clearInterval(interval)
                interval = null
            }
        }

        dom.add(runBtn, 'mousedown', run)
        dom.add(runBtn, 'touchstart', run)

        dom.add(runBtn, 'mouseup', stop)
        dom.add(runBtn, 'touchend', stop)
    })
}())