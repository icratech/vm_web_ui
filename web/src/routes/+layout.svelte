
<script>
    
    import { goto } from '$app/navigation'

    import Header from './Header.svelte'
    import PillButton from '../lib/common/button/PillButton.svelte'
    
    /** @type {import('./$types').LayoutData} */
    export let data
    $: user = data.user
    $: { console.log( `LAYOUT PAGE DATA: \n${ JSON.stringify( user, null, 4 ) }\n` ) }

    /** @type {import('./$types').ActionData} */
    export let form

</script>

<div class="flx-col main">

    <Header bind:user={ user } bind:form={ form }/>

    <div class="flx-row layout">

        <div class="flx-col nav">

            <div class="flx-col">
                <PillButton on:click={ ( ) => { goto( '/' ) } } cls='bg-green_a'>HOME</PillButton>
                <PillButton on:click={ ( ) => { goto( '/device' ) } } cls='bg-green_a'>DEVICES</PillButton>
                <PillButton on:click={ ( ) => { goto( '/job' ) } } cls='bg-green_a'>JOBS</PillButton>
            </div>

            { #if user.role == "admin" }
            <div class="flx-col">
                <PillButton on:click={ ( ) => { goto( '/demo' ) } } cls='bg-purple_a'>ADMIN</PillButton>
            </div>
            { /if }
        </div>

        <div class="flx-col page">
            <slot></slot>
        </div>

    </div>

</div>

<style>
    .main {
        background-color: var(--dark);
        color: var(--accent);
        height: 100vh;
        overflow: hidden;
    }
    .layout {
        padding: 0 1rem;
        overflow: hidden;
        height: 100%;
    }

    .nav {
        width: 3.5em;
        gap:2em;
        justify-content: space-between;
        padding-bottom: 1em;
    }
    .page {
        height: 100%;
        overflow: hidden;
    }

</style>