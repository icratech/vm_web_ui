import { Job, DEVICES } from '../../../lib/des_api'

// export const ssr = false

export const load = async( loadEvent ) => {


    // let devs
    // let unsub = DEVICES.subscribe( d => { devs = d } )
    // unsub( )
    // console.log( "Device Page Load DEVICES ", devs )
    // let device = devs.filter( ( d ) => { return d.reg.des_dev_serial == loadEvent.params.slug } )[0]

    /* CALLS THE PARENT LOAD FUNCTION  
        TODO: CHECK IF DEVICE EXISTS AND ONLY LOAD IF NOT
    */
    let device = (await loadEvent.parent()).devices.filter( ( d ) => { return d.reg.des_dev_serial == loadEvent.params.slug } )[0]
    
    device.job = new Job(
        device.job.admins,
        device.job.headers,
        device.job.configs,
        device.job.events,
        device.job.samples,
        device.job.xypoints,
        device.job.reg 
    )
    
    console.log( "Device Page Load ", device )
    // console.log( "Device Page Load -> header\n", JSON.stringify( device.job.headers[0], null, 4 ) )
    // console.log( "Device Page Load -> admin\n", JSON.stringify( device.job.admins[0], null, 4 ) )
    // console.log( "Device Page Load -> config\n", JSON.stringify( device.job.configs[0], null, 4 ) )
    // console.log( "Device Page Load -> event\n",  JSON.stringify( device.job.events[0], null, 4 ) )
    // console.log( "Device Page Load -> sample\n",  JSON.stringify( device.job.samples[0], null, 4 ) )
    return { device }

}