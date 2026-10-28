import VerificationController from './VerificationController'
import HistoryController from './HistoryController'
import ValidationController from './ValidationController'
const Expert = {
    VerificationController: Object.assign(VerificationController, VerificationController),
HistoryController: Object.assign(HistoryController, HistoryController),
ValidationController: Object.assign(ValidationController, ValidationController),
}

export default Expert