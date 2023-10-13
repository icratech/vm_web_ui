<script>

    // export let user
    // export let form

    import { AUTH, login, logout } from '../lib/des_api'
    import PillButton from '../lib/common/button/PillButton.svelte'

    let email = ""
    let password = ""
    $: loginButtonColor = ( $AUTH.logged_in ? 'bg-purple' : 'bg-accent' )
    $: loginButtonText = ( $AUTH.logged_in ? 'out' : 'in' )
    $: loginButtonFunc = ( $AUTH.logged_in ? logout : ( ) => { login( email, password ) } )

</script>



<div class="flx-col container">

    <div class="flx-row content">  

        <div class="flx-col title-block">
            <div class="flx-row icon-block">
                <h1 style="color: var(--grey_a)">V<span class="ent">ENT</span><span class="medic">MEDIC</span></h1>
            </div>
            <div class="subtitle">
                <p>Part of the <span class="data-desk">Data</span><span class="two">2</span><span class="data-desk">Desk</span> ecosystem</p>
            </div>
            
        </div>

        <div class="flx-row login">
        
            { #if $AUTH.logged_in }
            <h4>{ $AUTH.name }, you are a tolerable person.</h4>
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
            <PillButton 
                cls={ loginButtonColor }
                on:click={ loginButtonFunc }
                hint={ null } 
            />
        </div>


    </div>        

</div>


<style>
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        /* border-right: solid 0.05em var(--light_01); */
        padding-left: 1em;
        padding-right: 2em;
        justify-content: space-between;
        gap: 0;
    }
    .content {
        /* padding-left: 1rem; */
        justify-content: space-between;
    }
    .title-block {
        min-width: 20rem;
        gap: 0;
    }
    .icon-block {
        padding: 0;
    }

	.ent {
        font-size: 1.8rem;
        color: var(--light);
    }
    .medic {
        font-size: 1.8rem;
        color: var(--accent_a);
    }

    .subtitle {
        margin-top: -0.3em;
        padding-bottom: 0.75em;
    }
    .data-desk {
        font-style: oblique;
        color: var(--light);
    }
    .two {
        color: var(--accent);
    }
    

    .login {
        justify-content: flex-end;
        align-items: flex-end;
        padding-bottom: 1em;
        margin-right: 1em;
    }

    .input-container {
        gap: 0.25rem;
        width: 17em;
    }

    .lbl {
        font-size: 0.9rem;
    }

    input {
        color: var(--light);
        background-color: var(--light_aa);
        padding: 0.5rem;
        border-radius: 0.5rem;
        /* border-top: solid 0.05em var(--dark); */
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
        /* border-left: solid 0.05em var(--dark); */
        width: 100%;
    }

</style>