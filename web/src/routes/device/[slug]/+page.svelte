
<script>
    
    /* THIS ALSO WORKS */
    // import { page } from '$app/stores'
    // $: device = $page.data.resp.device
    // $: message = $page.data.resp.message
    // $: status = $page.data.resp.status

    export let data
    $: device = data.resp.device
    $: message = data.resp.message
    $: status = data.resp.status
    $: { console.log( `./device/[slug]: ${ status.toUpperCase() }\t${ message }` ) }

</script>

<h3>SN: { device.des_dev_serial }</h3>
<p>CLASS: { device.des_dev_class }</p>
<p>VERSION: { device.des_dev_version }</p>