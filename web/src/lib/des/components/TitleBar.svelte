<script>

    import { createEventDispatcher } from 'svelte'
    import { fade, blur, scale, draw } from 'svelte/transition'
    import { tweened } from 'svelte/motion'
    import { cubicInOut } from 'svelte/easing'

    import { UserSession } from '../api'

    import PillButton from '../../common/button/PillButton.svelte'
    import vent_medic_logo from "$lib/images/vent-medic-hdr-logo.svg"
    
    import btn_img_login_purple from "$lib/images/btn-img-login-purple.svg"
    import btn_img_logout_purple from "$lib/images/btn-img-logout-purple.svg"

	const dispatch = createEventDispatcher()

    export let auth = new UserSession( )
    export let sec = 0

    $: loginButtonImage = ( auth && auth.logged_in ? btn_img_logout_purple : btn_img_login_purple )
    $: loginButtonFunc = ( auth && auth.logged_in ? async( ) => { dispatch( 'logout' ) } : async( ) => { dispatch( 'login' ) } )

    export let page_name = "PAGE_NAME"

    $: login_msg_color = ( sec % 2 === 0  ? 'var(--grey_09)' : 'var(--grey_08)' )
    // $: login_msg_color = ( sec % 2 === 0  ? 'var(--orange_08)' : 'var(--orange_07)' )
    // $: login_msg_color = ( sec % 2 === 0  ? 'var(--purple_08)' : 'var(--purple_07)' )
    // $: login_msg_color = ( sec % 2 === 0  ? 'var(--yellow_08)' : 'var(--yellow_07)' )

</script>


<div class="flx-col container">

    <div class="flx-row content">  

        <div class="flx-row"> 

            <div class="flx-col title-block">
                <div class="flx-col logo" style="background-image: url( { vent_medic_logo } );"></div>
                <div class="subtitle">
                    <p>Part of the <span class="data-desk">Data</span><span class="two">2</span><span class="data-desk">Desk</span> ecosystem</p>
                </div>
            </div>

            <div class="flx-row page-block">
                <h3>{ page_name }</h3>
            </div>

            <div class="flx-row login-btn">     

                { #if ( auth && auth.logged_in ) }
                <div class="flx-row login-msg" style="color:{ login_msg_color };">{ auth.user.name }</div>
                { :else }
                <div class="flx-row login-msg">Login</div>
                { /if }

                <PillButton 
                    img={ loginButtonImage }
                    on:click={ loginButtonFunc }
                    hint={ null } 
                />
            </div>
            
        </div>


    </div>   

</div>


<style>
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        padding: 1em;
        gap: 0.5em;
    }
    .content {
        flex-direction: row;
        justify-content: space-between;
    }


    /* LOGO AND SUCH */
    .title-block { min-width: 19em; width: auto; gap: 0; }
    .logo {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: left;
        height: 3.8em;
    }
    .subtitle { margin-top: -0.85em; margin-left: 3.8em; }
    .data-desk { font-style: oblique; color: var(--light); }
    .two { color: var(--green);  }
        
    .page-block { 
        color: var(--orange_a); 
        justify-content: center;
        align-items: center; 
        min-width: 12em;
        width: 100%; 
    }

    .login-btn {
        justify-content: flex-end;
        align-items: center;
        width: 20em;;
        gap: 0.5em;
    }
    .login-msg {
        justify-content: flex-end;
        min-width: 3.5em;
        font-size: 1.2em;
    }
    
    /* LAP TOP */
    @media(max-width: 1440px) {
        .container { background-color: transparent; }
        .logo { 
            margin-top: 0.5em; 
            height: 3em;
        }
        .subtitle { 
            padding-bottom: 0.25em;
            margin-left: 3em;
        }
    }

    /* TABLET */
    @media(max-width: 1024px) {

    }

    /* MOBILE */
    @media(max-width:425px) {

        .content {
            flex-direction: column;
            padding-bottom: 0.5em;
            gap: 0;
        }

        .page-block { display: none; }

        .login-btn {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            gap: 1em;
        }

    }
</style>