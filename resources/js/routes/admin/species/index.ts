import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SpeciesController::index
 * @see app/Http/Controllers/Admin/SpeciesController.php:19
 * @route '/admin/spesies'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/spesies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SpeciesController::index
 * @see app/Http/Controllers/Admin/SpeciesController.php:19
 * @route '/admin/spesies'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SpeciesController::index
 * @see app/Http/Controllers/Admin/SpeciesController.php:19
 * @route '/admin/spesies'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SpeciesController::index
 * @see app/Http/Controllers/Admin/SpeciesController.php:19
 * @route '/admin/spesies'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SpeciesController::index
 * @see app/Http/Controllers/Admin/SpeciesController.php:19
 * @route '/admin/spesies'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SpeciesController::index
 * @see app/Http/Controllers/Admin/SpeciesController.php:19
 * @route '/admin/spesies'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SpeciesController::index
 * @see app/Http/Controllers/Admin/SpeciesController.php:19
 * @route '/admin/spesies'
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
const species = {
    index: Object.assign(index, index),
}

export default species