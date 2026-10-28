import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\User\ObservationController::contributions
 * @see app/Http/Controllers/User/ObservationController.php:48
 * @route '/user/kontribusi'
 */
export const contributions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contributions.url(options),
    method: 'get',
})

contributions.definition = {
    methods: ["get","head"],
    url: '/user/kontribusi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\User\ObservationController::contributions
 * @see app/Http/Controllers/User/ObservationController.php:48
 * @route '/user/kontribusi'
 */
contributions.url = (options?: RouteQueryOptions) => {
    return contributions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::contributions
 * @see app/Http/Controllers/User/ObservationController.php:48
 * @route '/user/kontribusi'
 */
contributions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contributions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\User\ObservationController::contributions
 * @see app/Http/Controllers/User/ObservationController.php:48
 * @route '/user/kontribusi'
 */
contributions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contributions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::contributions
 * @see app/Http/Controllers/User/ObservationController.php:48
 * @route '/user/kontribusi'
 */
    const contributionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contributions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::contributions
 * @see app/Http/Controllers/User/ObservationController.php:48
 * @route '/user/kontribusi'
 */
        contributionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contributions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\User\ObservationController::contributions
 * @see app/Http/Controllers/User/ObservationController.php:48
 * @route '/user/kontribusi'
 */
        contributionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contributions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contributions.form = contributionsForm
const user = {
    contributions: Object.assign(contributions, contributions),
}

export default user