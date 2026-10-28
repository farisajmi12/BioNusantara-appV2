import UserController from './UserController'
import SpeciesController from './SpeciesController'
import VerificationController from './VerificationController'
import ReportController from './ReportController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
SpeciesController: Object.assign(SpeciesController, SpeciesController),
VerificationController: Object.assign(VerificationController, VerificationController),
ReportController: Object.assign(ReportController, ReportController),
}

export default Admin