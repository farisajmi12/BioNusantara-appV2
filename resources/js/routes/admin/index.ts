import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users from './users'
import species from './species'
import verification from './verification'
/**
* @see \App\Http\Controllers\Admin\ReportController::reports
 * @see app/Http/Controllers/Admin/ReportController.php:18
 * @route '/admin/laporan'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/admin/laporan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::reports
 * @see app/Http/Controllers/Admin/ReportController.php:18
 * @route '/admin/laporan'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::reports
 * @see app/Http/Controllers/Admin/ReportController.php:18
 * @route '/admin/laporan'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReportController::reports
 * @see app/Http/Controllers/Admin/ReportController.php:18
 * @route '/admin/laporan'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ReportController::reports
 * @see app/Http/Controllers/Admin/ReportController.php:18
 * @route '/admin/laporan'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ReportController::reports
 * @see app/Http/Controllers/Admin/ReportController.php:18
 * @route '/admin/laporan'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ReportController::reports
 * @see app/Http/Controllers/Admin/ReportController.php:18
 * @route '/admin/laporan'
 */
        reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reports.form = reportsForm
const admin = {
    users: Object.assign(users, users),
species: Object.assign(species, species),
verification: Object.assign(verification, verification),
reports: Object.assign(reports, reports),
}

export default admin