<script>

    import { AUTH, login, logout } from '../lib/des_api'
    import PillButton from '../lib/common/button/PillButton.svelte'
    import vent_medic_logo from "$lib/images/vent-medic-hdr-logo.svg"

	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

    let email = ""
    let password = ""
    $: loginButtonColor = ( $AUTH.logged_in ? 'bg-purple' : 'bg-accent' )
    $: loginButtonFunc = ( $AUTH.logged_in ? ( ) => { logout( ); dispatch( 'logout' ); } : ( ) => { login( email, password ) } )

    export let page_name = "PAGE_NAME"
</script>



<div class="flx-col container">

    <div class="flx-row { ( $AUTH.logged_in ? 'content-in' : 'content' ) }">  

        <div class="flx-col title-block">
            <div class="flx-col logo" style="background-image: url( { vent_medic_logo } );"></div>
            <div class="subtitle">
                <p>Part of the <span class="data-desk">Data</span><span class="two">2</span><span class="data-desk">Desk</span> ecosystem</p>
            </div>
            
        </div>

        <div class="flx-row page-block"><h3>{ page_name }</h3></div>

        <div class="flx-row login">
        
            { #if $AUTH.logged_in }
            <h4 id="auth">{ $AUTH.name }</h4>
            { :else }
            <div class="flx-col input-container">
                <label class="lbl">
                    email
                    <input name="email"  type="email" bind:value={ email } id="usr"/>
                </label>
            </div>
            
            <div class="flx-col input-container">
                <label class="lbl">
                    password
                    <input name="password" type="password"  bind:value={ password } id="pw" autocomplete="new-password"/>
                </label>
            </div>
            { /if }
            <div class="login-btn">
                
                <div class="mob-msg">{ ( $AUTH.logged_in ? $AUTH.name : 'Sign-In' ) }</div>
               
                <PillButton 
                    cls={ loginButtonColor }
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
        padding-left: 1em;
        padding-right: 1em;
        justify-content: space-between;
        gap: 0;
    }
    .content {
        flex-direction: row;
        justify-content: space-between;
    }
    .title-block { 
        width: auto;
        min-width: 19em;
        gap: 0;  
    }
    .page-block {
        color: var(--orange_a);
        align-items: flex-end;
        padding: 2em;
    }

    .logo {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: left;
        margin-top: 1em;
        height: 3.8em;
        width: 100%;
    }

    .subtitle {
        margin-top: -0.85em;
        margin-left: 3.8em;
        padding-bottom: 0.75em;
    }
    .data-desk { font-style: oblique; color: var(--light); }
    .two { color: var(--accent);  }
    

    .login {
        justify-content: flex-end;
        align-items: flex-end;
        padding-bottom: 1em;
    }

    .input-container { gap: 0.25rem; width: 17em; }

    .lbl { font-size: 0.9rem;  }

    input {
        color: var(--light);
        background-color: var(--light_aa);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
        width: 100%;
    }

    .login-btn {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: auto;
            gap: 1em;
        }
    .mob-msg { display: none;  }
    
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
        }
        .page-block {
            align-items: flex-end;
            padding: 1em 0;
        }
        .page-block h3 { font-size: 1.3em; }
        .login {
            flex-direction:column;
            justify-content: center;
            padding: 0;
            gap:0.5em;
        }
        .input-container {
            width: 100%;
        }
        .login-btn {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            gap: 1em;
        }
        .mob-msg {
            display: block;
            font-size: 1.2em;
        }

        #auth {
            display: none;
        }
    }
</style>