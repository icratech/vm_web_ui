
<script>
    /* THIS ALSO WORKS */
    // import { page } from '$app/stores'
    // $: devices = $page.data.devices

    export let data
    let devices = [ ]
    // $: devices = data.devices
    let titleText = 'Search and select...'  
    $: { console.log( JSON.stringify( data, null, 4 ) ) }
    if ( data.json.status === "success" ) {
        devices = data.json.data.devices
    }  
    if ( data.json.status === "fail" ) {
        console.log( data.json.message )
        titleText = data.json.message
    }

</script>

<h1>DEVICES PAGE</h1>
<p>{ titleText }</p>
<ul>
    { #each devices as device }
    <li>
        <a href="/device/{ device.des_dev_serial }">
            { device.des_dev_serial }
        </a>
    </li>
    {/each}
</ul>