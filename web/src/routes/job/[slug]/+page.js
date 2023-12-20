export const ssr = false

export const load = async( loadEvent ) => {
    return { job_name: loadEvent.params.slug }
}