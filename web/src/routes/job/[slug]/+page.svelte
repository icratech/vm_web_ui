<script>

    // export let data
    // $: job = data.resp.job
    // $: message = data.resp.message
    // $: status = data.resp.status
    // $: { console.log( `./job/[slug]: ${ status.toUpperCase() }\t${ message }` ) }

    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import InputText from '../../../lib/common/input_text/InputText.svelte'
    import LineChart from '../../../lib/common/chart/LineChart.svelte'


    import btn_img_report from "$lib/images/btn-img-report.svg"

    import { onMount } from "svelte"
	import { JOBS, Report, Section, SectionDataSet  } from "../../../lib/des_api"
    
    export let data
    $: job = $JOBS.filter( ( j ) => { return j.reg.des_job_name == data.job_name } )[0]
    
    $: loaded = false
    onMount( async( ) => {
        loaded = await job.getJobData( )
        console.log( job )
    } )

    let cur_rep = new Report( )

    let new_rep = new Report( )
    const makeReport = ( ) => {
        console.log(  "new report title: ", new_rep.rep_title )
        job.newReport( new_rep )
        cur_rep = new_rep
        new_rep = new Report( )
    }
    let new_sec = new Section( )
    const makeSection = ( rep ) => {
        console.log(  "new section name: ", new_sec.sce_name )
        rep.addSection( new_sec )
        new_sec = new Section( )
    }

</script>
<div class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col status">
            <h3>Device Info</h3>
            { job.reg.des_job_name }

        </div>

        <div class="flx-col panel">
    
            { #if loaded }
            <div class="flx-col chart">
                <LineChart bind:chartdata={ job.cht } />
            </div>
            { :else }
            <h3>loading...</h3>
            { /if }
    
            <div class="flx-row controls">

                <div class="flx-col btns">
    
                    <PillButton 
                        on:click={ ( new_rep.rep_title != "" ? makeReport : console.log( "enter a report title" ) ) }
                        cls={ 'bg-pink' }
                        img={ btn_img_report }
                        hint={ 'New Report' } 
                    />

                    <PillButton 
                        on:click={ ( new_sec.sec_name != "" ? makeSection( cur_rep ) : console.log( "enter a section name" ) ) }
                        cls={ 'bg-pink' }
                        img={ btn_img_report }
                        hint={ 'New Section' } 
                    />

                </div>

                <div class="flx-col txts">

                    <InputText bind:txt={ new_rep.rep_title } place={ "Please enter a report title" } enabled={ true } />
                    
                    <InputText bind:txt={ new_sec.sec_name } place={ "Please enter a section name" } enabled={ true } />

                </div>

                <div class="flx-col">

                </div>

                <div class="flx-col">
                    
                </div>

            </div>

        </div>
    
    </div>

</div>

<style>
    
    .container {
        overflow: hidden;
        height: 100%;
        gap: 1rem;
    }

    .content { 
        /* background-color: var(--light_01); */
        height: 100%;
    }

    .status {
        background-color: var(--light_01);
        max-width: 25%;
        min-width: 25%;
        width: auto;
        padding-right: 0.5em;
    }

    .panel {
        /* background-color: var(--light_01); */
        padding: 0 1em;
        padding-left: 0;
        height: auto;
    }

    .chart { min-height: 38em; }


    .btns { 
        justify-content: flex-end; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }


</style>
