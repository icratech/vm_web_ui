
<script>
    
    import DateTimeDisplay from "$lib/common/date_time/DateTimeDisplay.svelte"
    import PillButton from '$lib/common/button/PillButton.svelte'

    import ReportTitle from './ReportTitle.svelte'
    import ReportSecTitle from './ReportSecTitle.svelte'

    import { debug } from '../../des/utils'
	import { Job, Report, Section } from "../../des_api"
    export let job = new Job( )
    export let rep = new Report( )

</script>

<div class="flx-col container">

    <ReportTitle bind:rep on:report-selected highlight={ false }/>

    <div class="flx-col section-list">
        { #each rep.rep_secs as sec ( sec.sec_id ) }
            <div class="flx-co">

                <ReportSecTitle 
                    bind:job bind:sec 
                    on:section-selected 
                />

            </div> 

        { /each }
    </div>
    
</div>

<style>
    
    .container {
        height: 100%;
        gap: 1rem;
    }

    .section-list {
        overflow: auto;
        padding-right: 0.5em;
        gap: 0.5em;
    }

</style>
