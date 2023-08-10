<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    export let job = {
        des_job_name: "",
        des_job_start: 0,
        des_job_end: 0,
    }

</script>

<div class="flx-row container">

    <PillButton on:click={ ( ) => { dispatch( 'go' ) } }/>

<div class="flx-row job-reg-hdr">
                        
        <div class="job-name">
            <h4>DB: { job.des_job_name }</h4>
        </div>
        <div class="flx-col job-reg-se">
            <p>START: { job.des_job_start }</p>
            <p>END: { job.des_job_end }</p>
        </div>

    </div>
</div>

<style>
        
    .container{
        padding: 1em;
        background-color: var(--light_aa);
        border-radius: 0.5em;
        gap: 1em;
    }

     /* HEADER - JOB STATE - COL */
     /* .job-state {
        width: 35%;
    } */
    /* HEADER - JOB REG - COL */
    .job-reg-hdr {
        height: 3em;
    }
    .job-name {
        width: 70%;
    }
    .job-reg-se {
        width: 30%;
        align-items: flex-end;
        gap: 0;
    }

</style>
