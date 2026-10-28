import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
/**
* @see \App\Http\Controllers\User\ObservationController::history
 * @see app/Http/Controllers/User/ObservationController.php:36
 * @route '/user/observasi/riwayat'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/user/observasi/riwayat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\User\ObservationController::history
 * @see app/Http/Controllers/User/ObservationController.php:36
 * @route '/user/observasi/riwayat'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::history
 * @see app/Http/Controllers/User/ObservationController.php:36
 * @route '/user/observasi/riwayat'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\User\ObservationController::history
 * @see app/Http/Controllers/User/ObservationController.php:36
 * @route '/user/observasi/riwayat'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::history
 * @see app/Http/Controllers/User/ObservationController.php:36
 * @route '/user/observasi/riwayat'
 */
    const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::history
 * @see app/Http/Controllers/User/ObservationController.php:36
 * @route '/user/observasi/riwayat'
 */
        historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\User\ObservationController::history
 * @see app/Http/Controllers/User/ObservationController.php:36
 * @route '/user/observasi/riwayat'
 */
        historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
/**
* @see \App\Http\Controllers\User\ObservationController::create
 * @see app/Http/Controllers/User/ObservationController.php:29
 * @route '/user/observasi/buat'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/user/observasi/buat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\User\ObservationController::create
 * @see app/Http/Controllers/User/ObservationController.php:29
 * @route '/user/observasi/buat'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::create
 * @see app/Http/Controllers/User/ObservationController.php:29
 * @route '/user/observasi/buat'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\User\ObservationController::create
 * @see app/Http/Controllers/User/ObservationController.php:29
 * @route '/user/observasi/buat'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::create
 * @see app/Http/Controllers/User/ObservationController.php:29
 * @route '/user/observasi/buat'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::create
 * @see app/Http/Controllers/User/ObservationController.php:29
 * @route '/user/observasi/buat'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\User\ObservationController::create
 * @see app/Http/Controllers/User/ObservationController.php:29
 * @route '/user/observasi/buat'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\User\ObservationController::store
 * @see app/Http/Controllers/User/ObservationController.php:60
 * @route '/user/observasi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/user/observasi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\User\ObservationController::store
 * @see app/Http/Controllers/User/ObservationController.php:60
 * @route '/user/observasi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::store
 * @see app/Http/Controllers/User/ObservationController.php:60
 * @route '/user/observasi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::store
 * @see app/Http/Controllers/User/ObservationController.php:60
 * @route '/user/observasi'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::store
 * @see app/Http/Controllers/User/ObservationController.php:60
 * @route '/user/observasi'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\User\ObservationController::index
 * @see app/Http/Controllers/User/ObservationController.php:18
 * @route '/user/observasi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/user/observasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\User\ObservationController::index
 * @see app/Http/Controllers/User/ObservationController.php:18
 * @route '/user/observasi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::index
 * @see app/Http/Controllers/User/ObservationController.php:18
 * @route '/user/observasi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\User\ObservationController::index
 * @see app/Http/Controllers/User/ObservationController.php:18
 * @route '/user/observasi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::index
 * @see app/Http/Controllers/User/ObservationController.php:18
 * @route '/user/observasi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::index
 * @see app/Http/Controllers/User/ObservationController.php:18
 * @route '/user/observasi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\User\ObservationController::index
 * @see app/Http/Controllers/User/ObservationController.php:18
 * @route '/user/observasi'
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
* @see \App\Http\Controllers\User\ObservationController::show
 * @see app/Http/Controllers/User/ObservationController.php:130
 * @route '/user/observasi/{observation}'
 */
export const show = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/user/observasi/{observation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\User\ObservationController::show
 * @see app/Http/Controllers/User/ObservationController.php:130
 * @route '/user/observasi/{observation}'
 */
show.url = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { observation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { observation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    observation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        observation: typeof args.observation === 'object'
                ? args.observation.id
                : args.observation,
                }

    return show.definition.url
            .replace('{observation}', parsedArgs.observation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::show
 * @see app/Http/Controllers/User/ObservationController.php:130
 * @route '/user/observasi/{observation}'
 */
show.get = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\User\ObservationController::show
 * @see app/Http/Controllers/User/ObservationController.php:130
 * @route '/user/observasi/{observation}'
 */
show.head = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::show
 * @see app/Http/Controllers/User/ObservationController.php:130
 * @route '/user/observasi/{observation}'
 */
    const showForm = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::show
 * @see app/Http/Controllers/User/ObservationController.php:130
 * @route '/user/observasi/{observation}'
 */
        showForm.get = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\User\ObservationController::show
 * @see app/Http/Controllers/User/ObservationController.php:130
 * @route '/user/observasi/{observation}'
 */
        showForm.head = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\User\ObservationController::edit
 * @see app/Http/Controllers/User/ObservationController.php:151
 * @route '/user/observasi/{observation}/edit'
 */
export const edit = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/user/observasi/{observation}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\User\ObservationController::edit
 * @see app/Http/Controllers/User/ObservationController.php:151
 * @route '/user/observasi/{observation}/edit'
 */
edit.url = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { observation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { observation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    observation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        observation: typeof args.observation === 'object'
                ? args.observation.id
                : args.observation,
                }

    return edit.definition.url
            .replace('{observation}', parsedArgs.observation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::edit
 * @see app/Http/Controllers/User/ObservationController.php:151
 * @route '/user/observasi/{observation}/edit'
 */
edit.get = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\User\ObservationController::edit
 * @see app/Http/Controllers/User/ObservationController.php:151
 * @route '/user/observasi/{observation}/edit'
 */
edit.head = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::edit
 * @see app/Http/Controllers/User/ObservationController.php:151
 * @route '/user/observasi/{observation}/edit'
 */
    const editForm = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::edit
 * @see app/Http/Controllers/User/ObservationController.php:151
 * @route '/user/observasi/{observation}/edit'
 */
        editForm.get = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\User\ObservationController::edit
 * @see app/Http/Controllers/User/ObservationController.php:151
 * @route '/user/observasi/{observation}/edit'
 */
        editForm.head = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\User\ObservationController::update
 * @see app/Http/Controllers/User/ObservationController.php:162
 * @route '/user/observasi/{observation}'
 */
export const update = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/user/observasi/{observation}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\User\ObservationController::update
 * @see app/Http/Controllers/User/ObservationController.php:162
 * @route '/user/observasi/{observation}'
 */
update.url = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { observation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { observation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    observation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        observation: typeof args.observation === 'object'
                ? args.observation.id
                : args.observation,
                }

    return update.definition.url
            .replace('{observation}', parsedArgs.observation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::update
 * @see app/Http/Controllers/User/ObservationController.php:162
 * @route '/user/observasi/{observation}'
 */
update.put = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::update
 * @see app/Http/Controllers/User/ObservationController.php:162
 * @route '/user/observasi/{observation}'
 */
    const updateForm = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::update
 * @see app/Http/Controllers/User/ObservationController.php:162
 * @route '/user/observasi/{observation}'
 */
        updateForm.put = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\User\ObservationController::destroy
 * @see app/Http/Controllers/User/ObservationController.php:138
 * @route '/user/observasi/{observation}'
 */
export const destroy = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/user/observasi/{observation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\User\ObservationController::destroy
 * @see app/Http/Controllers/User/ObservationController.php:138
 * @route '/user/observasi/{observation}'
 */
destroy.url = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { observation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { observation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    observation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        observation: typeof args.observation === 'object'
                ? args.observation.id
                : args.observation,
                }

    return destroy.definition.url
            .replace('{observation}', parsedArgs.observation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\User\ObservationController::destroy
 * @see app/Http/Controllers/User/ObservationController.php:138
 * @route '/user/observasi/{observation}'
 */
destroy.delete = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\User\ObservationController::destroy
 * @see app/Http/Controllers/User/ObservationController.php:138
 * @route '/user/observasi/{observation}'
 */
    const destroyForm = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\User\ObservationController::destroy
 * @see app/Http/Controllers/User/ObservationController.php:138
 * @route '/user/observasi/{observation}'
 */
        destroyForm.delete = (args: { observation: number | { id: number } } | [observation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ObservationController = { contributions, history, create, store, index, show, edit, update, destroy }

export default ObservationController