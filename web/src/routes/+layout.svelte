
<script>

    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'

    import { AUTH, get_users, get_event_types } from '../lib/des_api';
    import Header from './Header.svelte'
    import PillButton from '../lib/common/button/PillButton.svelte'
    
    /** @type {import('./$types').LayoutData} */
    export let data
    $: user = data.user // $: { console.log( `LAYOUT PAGE DATA: \n${ JSON.stringify( user, null, 4 ) }\n` ) }
    /** @type {import('./$types').ActionData} */
    export let form

    onMount( async( ) => {

        $AUTH = user // console.log( `layout.svelte ->  onMount( ) -> $AUTH:\n${ JSON.stringify( $AUTH ) }\n` )

        let users = await get_users( ) // console.log( `layout.svelte -> onMount( ):  get_users( ): users\n${ JSON.stringify( users, null, 4 ) }` )
        sessionStorage.setItem( "users", JSON.stringify( users ) ) // users = JSON.parse( sessionStorage.users )  // console.log( `layout.svelte -> sessionStorage: users\n${  JSON.stringify( users, null, 4 )  }` )

        let event_types = await get_event_types( ) // console.log( `layout.svelte -> onMount( ):  get_event_types( ): event_types\n${ JSON.stringify( event_types, null, 4 ) }` )
        sessionStorage.setItem( "event_types", JSON.stringify( event_types ) ) // event_types = JSON.parse( sessionStorage.event_types ) // console.log( `layout.svelte -> sessionStorage: event_types\n${  JSON.stringify( event_types, null, 4 )  }` )

    } )

</script>

<div class="flx-col main">

    <Header bind:user={ user } bind:form={ form }/>

    <div class="flx-row layout">

        <div class="flx-col nav">

            <div class="flx-col">
                <PillButton on:click={ ( ) => { goto( '/' ) } } cls='bg-green_a'>HOM</PillButton>
                <PillButton on:click={ ( ) => { goto( '/device' ) } } cls='bg-green_a'>DEVS</PillButton>
                <PillButton on:click={ ( ) => { goto( '/job' ) } } cls='bg-green_a'>JOBS</PillButton>
            </div>

            { #if user.role == "admin" }
            <div class="flx-col">
                <PillButton on:click={ ( ) => { goto( '/demo' ) } } cls='bg-purple_a'>ADM</PillButton>
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
    }
    .layout {
        overflow: hidden;
        height: 100%;
        padding-bottom: 1em;
    }

    .nav {
        width: 2.5em;
        gap:2em;
        justify-content: space-between;
        padding-left: 1em;
        padding-bottom: 1em;
    }
    .page {
        padding: 0 1rem;
        height: 100%;
        overflow: hidden;
    }

</style>