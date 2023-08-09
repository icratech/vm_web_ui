
<script>
    
    import Header from './Header.svelte'
    
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
            <a href='/'>HOME</a>
            <a href='/device'>DEVICES</a>
            <a href='/job'>JOBS</a>
            <a href='/demo'>DEMO</a>
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
        padding: 1em;
        height: 100vh;
    }
    .nav {
        width: 6em;
        gap:2em;
    }
    .page {
        height: 100%;
    }

</style>