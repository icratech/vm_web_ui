
export let ssr = false
import { getDeviceBySerial } from '../../../c001v001_data'

export const load = async( { params } ) => {
    let device = await getDeviceBySerial( params.slug )
    return { device } 
}
