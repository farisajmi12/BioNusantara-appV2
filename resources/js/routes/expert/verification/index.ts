import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Expert\VerificationController::index
 * @see app/Http/Controllers/Expert/VerificationController.php:15
 * @route '/expert/verifikasi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/expert/verifikasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Expert\VerificationController::index
 * @see app/Http/Controllers/Expert/VerificationController.php:15
 * @route '/expert/verifikasi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Expert\VerificationController::index
 * @see app/Http/Controllers/Expert/VerificationController.php:15
 * @route '/expert/verifikasi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Expert\VerificationController::index
 * @see app/Http/Controllers/Expert/VerificationController.php:15
 * @route '/expert/verifikasi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Expert\VerificationController::index
 * @see app/Http/Controllers/Expert/VerificationController.php:15
 * @route '/expert/verifikasi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Expert\VerificationController::index
 * @see app/Http/Controllers/Expert/VerificationController.php:15
 * @route '/expert/verifikasi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Expert\VerificationController::index
 * @see app/Http/Controllers/Expert/VerificationController.php:15
 * @route '/expert/verifikasi'
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
/**
* @see \App\Http\Controllers\Expert\VerificationController::store
 * @see app/Http/Controllers/Expert/VerificationController.php:26
 * @route '/expert/verifikasi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/expert/verifikasi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Expert\VerificationController::store
 * @see app/Http/Controllers/Expert/VerificationController.php:26
 * @route '/expert/verifikasi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Expert\VerificationController::store
 * @see app/Http/Controllers/Expert/VerificationController.php:26
 * @route '/expert/verifikasi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Expert\VerificationController::store
 * @see app/Http/Controllers/Expert/VerificationController.php:26
 * @route '/expert/verifikasi'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Expert\VerificationController::store
 * @see app/Http/Controllers/Expert/VerificationController.php:26
 * @route '/expert/verifikasi'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const verification = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default verification