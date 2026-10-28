import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\VerificationController::index
 * @see app/Http/Controllers/Admin/VerificationController.php:16
 * @route '/admin/verifikasi-ahli'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/verifikasi-ahli',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\VerificationController::index
 * @see app/Http/Controllers/Admin/VerificationController.php:16
 * @route '/admin/verifikasi-ahli'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VerificationController::index
 * @see app/Http/Controllers/Admin/VerificationController.php:16
 * @route '/admin/verifikasi-ahli'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\VerificationController::index
 * @see app/Http/Controllers/Admin/VerificationController.php:16
 * @route '/admin/verifikasi-ahli'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\VerificationController::index
 * @see app/Http/Controllers/Admin/VerificationController.php:16
 * @route '/admin/verifikasi-ahli'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\VerificationController::index
 * @see app/Http/Controllers/Admin/VerificationController.php:16
 * @route '/admin/verifikasi-ahli'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\VerificationController::index
 * @see app/Http/Controllers/Admin/VerificationController.php:16
 * @route '/admin/verifikasi-ahli'
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
* @see \App\Http\Controllers\Admin\VerificationController::verify
 * @see app/Http/Controllers/Admin/VerificationController.php:24
 * @route '/admin/verifikasi-ahli/{application}'
 */
export const verify = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: verify.url(args, options),
    method: 'patch',
})

verify.definition = {
    methods: ["patch"],
    url: '/admin/verifikasi-ahli/{application}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\VerificationController::verify
 * @see app/Http/Controllers/Admin/VerificationController.php:24
 * @route '/admin/verifikasi-ahli/{application}'
 */
verify.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return verify.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VerificationController::verify
 * @see app/Http/Controllers/Admin/VerificationController.php:24
 * @route '/admin/verifikasi-ahli/{application}'
 */
verify.patch = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: verify.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\VerificationController::verify
 * @see app/Http/Controllers/Admin/VerificationController.php:24
 * @route '/admin/verifikasi-ahli/{application}'
 */
    const verifyForm = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\VerificationController::verify
 * @see app/Http/Controllers/Admin/VerificationController.php:24
 * @route '/admin/verifikasi-ahli/{application}'
 */
        verifyForm.patch = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\Admin\VerificationController::credential
 * @see app/Http/Controllers/Admin/VerificationController.php:42
 * @route '/admin/verifikasi-ahli/{application}/kredensial'
 */
export const credential = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: credential.url(args, options),
    method: 'get',
})

credential.definition = {
    methods: ["get","head"],
    url: '/admin/verifikasi-ahli/{application}/kredensial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\VerificationController::credential
 * @see app/Http/Controllers/Admin/VerificationController.php:42
 * @route '/admin/verifikasi-ahli/{application}/kredensial'
 */
credential.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return credential.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VerificationController::credential
 * @see app/Http/Controllers/Admin/VerificationController.php:42
 * @route '/admin/verifikasi-ahli/{application}/kredensial'
 */
credential.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: credential.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\VerificationController::credential
 * @see app/Http/Controllers/Admin/VerificationController.php:42
 * @route '/admin/verifikasi-ahli/{application}/kredensial'
 */
credential.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: credential.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\VerificationController::credential
 * @see app/Http/Controllers/Admin/VerificationController.php:42
 * @route '/admin/verifikasi-ahli/{application}/kredensial'
 */
    const credentialForm = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: credential.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\VerificationController::credential
 * @see app/Http/Controllers/Admin/VerificationController.php:42
 * @route '/admin/verifikasi-ahli/{application}/kredensial'
 */
        credentialForm.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: credential.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\VerificationController::credential
 * @see app/Http/Controllers/Admin/VerificationController.php:42
 * @route '/admin/verifikasi-ahli/{application}/kredensial'
 */
        credentialForm.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: credential.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    credential.form = credentialForm
const verification = {
    index: Object.assign(index, index),
verify: Object.assign(verify, verify),
credential: Object.assign(credential, credential),
}

export default verification