<script>

    import { UserSignUp, registerUser, AUTH } from "../lib/des/api"

    import Modal from "../lib/common/modal/Modal.svelte"
    import PillButton from "../lib/common/button/PillButton.svelte"
    import UserRegistration from "../lib/des/components/UserRegistration.svelte"

    import btn_img_edit from '../lib/images/btn-img-edit-orange.svg'
    import vent_medic_logo from "$lib/images/vent-medic-logo.svg"
    import vent_medic_nested from "$lib/images/vent-medic-ship.webp"
    import vent_medic_deployed from "$lib/images/vent-medic-deployed.webp"

    let modal
    let newUser = new UserSignUp( )
    let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    $: nameLength = ( newUser.name.length >= 3 )
    $: validEmail = ( newUser.email.match( validEmailRegex ) ) 
    $: pwLength = ( newUser.password.length >= 8 )
    $: pwMatch = ( newUser.password !== "" && newUser.password == newUser.password_confirm )
    $: valid = ( nameLength && validEmail && pwLength && pwMatch ) 

</script>

<div class="flx-col container" >

    <div class="flx-col welcome">
        <div class="flx-col logo" style="background-image: url( { vent_medic_logo } );"></div>
    
        <Modal bind:this={ modal } bind:valid on:confirm={ async( ) => { registerUser( newUser ) } }>
            <h3 class='fg-accent' slot="title">Register</h3>
            <div slot="content" class="flx-row">
                <UserRegistration bind:newUser />
            </div>
            <div slot="footer" class="flx-col">
                { #if valid }   
                <p class="alert valid">Send request</p>
                { :else }
                    <div class="flx-col validation">
                        { #if !nameLength }
                            <p class="alert invalid">Name must be 3 or more characters.</p>
                        { /if }
                        { #if !validEmail }
                            <p class="alert invalid">Email must be a valid email address.</p>
                        { /if }
                        { #if !pwLength }
                            <p class="alert invalid">Password must be 8 or more characters.</p>
                        { /if }
                        { #if !pwMatch }
                            <p class="alert invalid">Password and confirmation must match.</p> 
                        { /if }
                    </div>
                { /if }
            </div>
        </Modal>

        
        { #if !$AUTH.logged_in }
        <div class="flx-row register">

            Register
            <PillButton 
                on:click={ async( ) => { modal.open( ) } }
                img={ btn_img_edit } 
                hint={ null }
            />

        </div>
        { /if }

        <div class="flx-row banner deployed" style="background-image: url( { vent_medic_deployed} );"></div>
        <div class="flx-row banner ship" style="background-image: url( { vent_medic_nested} );"></div>


    </div>

</div>


<style>

    .container {
        overflow-y: hidden;
        align-items: center;
        height: 100%;
    }

    .welcome {
        justify-content: space-between;
        align-items: center;
        padding-bottom: 3em;
        height: 100%;
    }

    .logo {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-top: 3em;
        height: 10em;
        z-index: 1;
    }

    .banner {
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        justify-content: center;
        height: 100%;
        opacity: .8;
    }
    
    .register {
        font-size: 1.4em;
        font-style: oblique;
        align-items: center;
        justify-content: center;
        padding: 1em 0;
        gap: 0.5em
    }

    .banner.deployed { display: flex; }
    .banner.ship { display: none; }


    .validation {
        align-items: flex-start;
        justify-content: center;
        gap: 0.5em;
        padding-left: 5em;
    }
    .alert {
        font-size: 1.2em;
        font-style: oblique;
    }
    .alert.valid {
        color: var(--green_a);
        text-align: right;
    }
    .alert.invalid {
        color: var(--orange);
    }

    /* LAP TOP */
    @media(max-width: 1440px) {
        
    }

    /* TABLET */
    @media(max-width: 1100px) {

    }

    /* MOBILE */
    @media(max-width: 450px) {
        .container { overflow-y: auto; }
        .banner.deployed { display: none; }
        .banner.ship { display: flex; }
        .logo { height: 7em; }
    }

</style>
