<script>
    
    import { goto } from '$app/navigation'
    import JobCard from './JobCard.svelte'

    export let data
    $: jobs = data.resp.jobs
    $: message = data.resp.message
    $: status = data.resp.status
    $: { console.log( `./job: ${ status.toUpperCase() }\t${ message }` ) }

</script>

<dvi class="flx-col container">

    <h1>JOBS PAGE</h1>
    <p>STATUS: { status }</p>
    <p>MESSAGE: { message }</p>
    
    <div class="flx-col job-list">
        { #each jobs as job ( `job_page_${ job.des_job_id }`  )  }
            <JobCard 
                bind:job={ job }
                on:go={ ( ) => { goto( `job/${job.des_job_name }` ) } }
            />
        { /each }
    </div>

</dvi>  

<style>

    .container {
        height: 100%;
        gap: 1rem;
    }

    .job-list {
        width: 100%;
        overflow-y: auto;
        padding: 1em;
    }

</style>