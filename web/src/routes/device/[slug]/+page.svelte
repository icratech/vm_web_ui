
<script>
    import { page } from '$app/stores'
    console.log( JSON.stringify( $page, null, 4 ) )
    $: device = $page.data.device
</script>

<h3>SN: { device.reg.des_dev_serial }</h3>
<p>CLASS: { device.reg.des_dev_class }</p>
<p>VERSION: { device.reg.des_dev_version }</p>
<p>{ $page.url }</p>