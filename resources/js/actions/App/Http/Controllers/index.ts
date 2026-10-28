import User from './User'
import Auth from './Auth'
import WelcomeController from './WelcomeController'
import ExploreController from './ExploreController'
import DashboardController from './DashboardController'
import Admin from './Admin'
import Expert from './Expert'
import Settings from './Settings'
const Controllers = {
    User: Object.assign(User, User),
Auth: Object.assign(Auth, Auth),
WelcomeController: Object.assign(WelcomeController, WelcomeController),
ExploreController: Object.assign(ExploreController, ExploreController),
DashboardController: Object.assign(DashboardController, DashboardController),
Admin: Object.assign(Admin, Admin),
Expert: Object.assign(Expert, Expert),
Settings: Object.assign(Settings, Settings),
}

export default Controllers