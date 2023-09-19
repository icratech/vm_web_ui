
<script>

    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'

    import { AUTH, get_user, get_users, get_event_types, DEVICES, DEMO_DEVICES, USERS, EVENT_TYPES } from '../lib/des_api';
    import Header from './Header.svelte'
    import PillButton from '../lib/common/button/PillButton.svelte'
    import btn_img_home from "$lib/images/btn-img-home.svg"
    import btn_img_gauge from "$lib/images/btn-img-gauge.svg"

    onMount( async( ) => {

        if ( sessionStorage.getItem( 'des_token') != 'none' ) { // console.log( "Current des_token: ", token )
            await get_user( ) 
        }

        let users = await get_users( ) 
        // console.log( `layout.svelte -> onMount( ):  get_users( ): users\n${ JSON.stringify( users, null, 4 ) }` )
        sessionStorage.setItem( "users", JSON.stringify( users ) ) // users = JSON.parse( sessionStorage.users )  // console.log( `layout.svelte -> sessionStorage: users\n${  JSON.stringify( users, null, 4 )  }` )

        let event_types = await get_event_types( )
        // console.log( `layout.svelte -> onMount( ):  get_event_types( ): event_types\n${ JSON.stringify( event_types, null, 4 ) }` )
        sessionStorage.setItem( "event_types", JSON.stringify( event_types ) ) // event_types = JSON.parse( sessionStorage.event_types ) // console.log( `layout.svelte -> sessionStorage: event_types\n${  JSON.stringify( event_types, null, 4 )  }` )

        /* INCASE WEBSOCKETS WERE OPEN, CLOSE THEM; 
        CAUSES THE SERVER TO UNSUBSCRIBE THIS DEVICE USER'S MQTT CLIENT FROM ALL TOPICS */
        window.onbeforeunload = ( ) => { 
            $DEVICES.forEach( dev => { dev.disconnectWS( ) } )
            $DEMO_DEVICES.forEach( dev => { dev.disconnectSIM( ) } ) 
        } 
    } )

    const src = '$lib/space.jpg'
</script>

<div class="flx-col main">

    <Header />

    <div class="flx-row layout">

        <div class="flx-col nav">

            <div class="flx-col">
                <PillButton on:click={ ( ) => { goto( '/' ) } } cls='bg-accent' img={ btn_img_home } hint={ null } />
                <PillButton on:click={ ( ) => { goto( '/device' ) } } cls='bg-accent' img={ btn_img_gauge } hint={ 'Device list' }  />
                <PillButton on:click={ ( ) => { goto( '/job' ) } } cls='bg-accent'  hint={ 'Job list' } />
            </div>

            { #if $AUTH.role == "admin" }
            <div class="flx-col">
                <PillButton on:click={ ( ) => { goto( '/demo' ) } } cls='bg-purple'  hint={ "If you don't know..." } />
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
        /* background-color: var(--dark); */
        /* background-image: url( "$lib/images/bg-img-light.svg" ); */
        /* background-image: url( "$lib/images/bg-img-red.svg" ); */
        /* background-image: url( "$lib/images/bg-img-orange.svg" ); */
        /* background-image: url( "$lib/images/bg-img-yellow.svg" ); */
        /* background-image: url( "$lib/images/bg-img-green.svg" ); */
        /* background-image: url( "$lib/images/bg-img-aqua.svg" ); */
        background-image: url( "$lib/images/bg-img-blue.svg" );
        /* background-image: url( "$lib/images/bg-img-purple.svg" ); */
        /* background-image: url( "$lib/images/bg-img-pink.svg" ); */
        /* background-image: url( "$lib/images/bug.jpg" );
        background-size: cover; */
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        color: var(--grey);
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