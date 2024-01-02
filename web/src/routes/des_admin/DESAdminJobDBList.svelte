<script>
    
    import { getContext, onMount } from "svelte"

    import PillButton from "../../lib/common/button/PillButton.svelte"
	import { JOBS } from "../../lib/c001v001/job";

    $: JOBS = getContext( 'jobs' )

    onMount( async( ) => { 

    } )

</script>


<div class="flx-col container">

    <div class="flx-row panel-title-bar">

        <div class="flx-row panel-title-btns">
            <PillButton />
        </div>
        <h3 class="panel-title">Job Databases</h3>

        <div class="flx-col dbs">
            { #each $JOBS as job, index ( index ) }
                { job.reg.des_job_name }
            { /each }
        </div>

    </div> 

</div>


<style>
    
    .container {
        height: 100%;
        gap: 1rem;
    }

    .panel-title-bar {
        justify-content: space-between;
        /* padding-left: 1em; */
        padding-top: 0;
        padding-right: 0.5em;
        width: 100%;
    }
    .panel-title-btns {
        flex-direction: row;
        width: auto;
    }
    .panel-title {
        align-items: flex-end;
        width: 100%;
    }

    .dbs {
        overflow-y: auto;
        padding-right: 0.5em;
    }

</style>