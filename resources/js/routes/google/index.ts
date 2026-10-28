import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::login
 * @see app/Http/Controllers/Auth/SocialAuthController.php:16
 * @route '/auth/google'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/auth/google',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::login
 * @see app/Http/Controllers/Auth/SocialAuthController.php:16
 * @route '/auth/google'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::login
 * @see app/Http/Controllers/Auth/SocialAuthController.php:16
 * @route '/auth/google'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::login
 * @see app/Http/Controllers/Auth/SocialAuthController.php:16
 * @route '/auth/google'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\SocialAuthController::login
 * @see app/Http/Controllers/Auth/SocialAuthController.php:16
 * @route '/auth/google'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::login
 * @see app/Http/Controllers/Auth/SocialAuthController.php:16
 * @route '/auth/google'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::login
 * @see app/Http/Controllers/Auth/SocialAuthController.php:16
 * @route '/auth/google'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
const google = {
    login: Object.assign(login, login),
}

export default google