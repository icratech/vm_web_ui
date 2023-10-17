
<script>
	import { Header } from "../../des_api"
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte";

    export let hdr = new Header( )

    $: displayDate = ( hdr.hdr_job_start == 0 ? hdr.hdr_time : hdr.hdr_job_start )

</script>

<div class="flx-col card-content">
    <div class="flx-row">
        <p class="lbl">Company:</p>
        <p>{ hdr.hdr_well_co }</p>
    </div>
    
    <div class="flx-row">
        <p class="lbl">Well Name:</p>
        <p>{ hdr.hdr_well_name }</p>
    </div>
    
    <div class="flx-row">
        <p class="lbl">Surface Loc:</p>
        <p>{ hdr.hdr_well_sf_loc }</p>
    </div>
</div>

<style>
    
    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        width: 6em;
    }

</style>