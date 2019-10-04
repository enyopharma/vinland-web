import { render } from 'react-dom'

import { App } from './components/App'

declare global {
    interface Window { form: any; }
}

window.form = {
    init: (id: string) => {
        render(App, document.getElementById(id))
    }
}
