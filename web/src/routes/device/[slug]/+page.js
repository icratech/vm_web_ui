export const ssr = false

export const load = async( loadEvent ) => {
    return { serial: loadEvent.params.slug }
}