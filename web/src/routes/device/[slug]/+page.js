export const ssr = false
export const load = async( serverLoadEvent ) => {

    return { serial: serverLoadEvent.params.slug }

}