import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Expert\ValidationController::index
 * @see app/Http/Controllers/Expert/ValidationController.php:11
 * @route '/expert/validasi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/expert/validasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Expert\ValidationController::index
 * @see app/Http/Controllers/Expert/ValidationController.php:11
 * @route '/expert/validasi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Expert\ValidationController::index
 * @see app/Http/Controllers/Expert/ValidationController.php:11
 * @route '/expert/validasi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Expert\ValidationController::index
 * @see app/Http/Controllers/Expert/ValidationController.php:11
 * @route '/expert/validasi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Expert\ValidationController::index
 * @see app/Http/Controllers/Expert/ValidationController.php:11
 * @route '/expert/validasi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Expert\ValidationController::index
 * @see app/Http/Controllers/Expert/ValidationController.php:11
 * @route '/expert/validasi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Expert\ValidationController::index
 * @see app/Http/Controllers/Expert/ValidationController.php:11
 * @route '/expert/validasi'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const validation = {
    index: Object.assign(index, index),
}

export default validation