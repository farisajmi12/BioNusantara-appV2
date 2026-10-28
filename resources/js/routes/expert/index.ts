import verification from './verification'
import history from './history'
import validation from './validation'
import statistics from './statistics'
const expert = {
    verification: Object.assign(verification, verification),
history: Object.assign(history, history),
validation: Object.assign(validation, validation),
statistics: Object.assign(statistics, statistics),
}

export default expert