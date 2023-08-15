import { Job } from '../../../lib/des_api'

export const ssr = false

export const load = async( loadEvent ) => {

    /* CALLS THE PARENT LOAD FUNCTION  
        TODO: CHECK IF DEVICE EXISTS AND ONLY LOAD IF NOT
    */
    let device = (await loadEvent.parent()).devices.filter( ( d ) => { return d.reg.des_dev_serial == loadEvent.params.slug } )[0]

        device.job = new Job(
            device.job.admins,
            device.job.configs,
            device.job.events,
            device.job.samples,
            device.job.xypoints,
            device.job.reg 
        )
        console.log( "Device Page Load ", device )
    return { device }

}