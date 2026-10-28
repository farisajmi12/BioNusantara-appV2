import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Expert\HistoryController::index
 * @see app/Http/Controllers/Expert/HistoryController.php:12
 * @route '/expert/riwayat'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/expert/riwayat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Expert\HistoryController::index
 * @see app/Http/Controllers/Expert/HistoryController.php:12
 * @route '/expert/riwayat'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Expert\HistoryController::index
 * @see app/Http/Controllers/Expert/HistoryController.php:12
 * @route '/expert/riwayat'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Expert\HistoryController::index
 * @see app/Http/Controllers/Expert/HistoryController.php:12
 * @route '/expert/riwayat'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Expert\HistoryController::index
 * @see app/Http/Controllers/Expert/HistoryController.php:12
 * @route '/expert/riwayat'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Expert\HistoryController::index
 * @see app/Http/Controllers/Expert/HistoryController.php:12
 * @route '/expert/riwayat'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Expert\HistoryController::index
 * @see app/Http/Controllers/Expert/HistoryController.php:12
 * @route '/expert/riwayat'
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
const HistoryController = { index }

export default HistoryController