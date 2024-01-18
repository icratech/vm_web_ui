
<script>
    
    import { debug } from '../../../des/utils'

	import { Job } from "../../job"
    import { Report } from '../../models'

    import ReportTitle from './ReportTitle.svelte'
    import ReportSecTitle from './ReportSecTitle.svelte'

    export let job = new Job( )
    export let rep = new Report( )

</script>

<div class="flx-col container">

    <ReportTitle bind:rep on:report-selected highlight={ false } on:generate-pdf on:generate-csv />

    <div class="flx-col section-list">
        { #each rep.rep_secs as sec ( sec.sec_id ) }
            <div class="flx-co">

                <ReportSecTitle 
                    bind:job 
                    bind:sec 
                    on:section-selected 
                />

            </div> 

        { /each }
    </div>
    
</div>

<style>
    
    .container {
        padding-right: 0.5em;
        height: 100%;
        gap: 1rem;
    }

    .section-list {
        overflow: auto;
        padding-right: 0.5em;
        gap: 0.75em;
    }

</style>
