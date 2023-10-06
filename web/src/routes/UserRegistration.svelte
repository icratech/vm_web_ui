<script>

    import InputText from "../lib/common/input_text/InputText.svelte"
    import InputPW from "../lib/common/input_pw/InputPW.svelte"

    import { UserSignUp } from "../lib/des_api"

    export let newUser = new UserSignUp( )
    
</script>

<div class="flx-col container">

    <div class="flx-row">
        <p class="lbl fg-accent">Name:</p>
        <InputText enabled={ true } bind:txt={ newUser.name } place="User name"/>
    </div>

    <div class="flx-row">
        <p class="lbl fg-accent">Email:</p>
        <InputText enabled={ true } bind:txt={ newUser.email } place="Email address"/>
    </div>

    <div class="flx-row">
        <p class="lbl fg-accent">Password:</p>
        <InputPW enabled={ true } bind:txt={ newUser.password } auto="new-password" place="Password"/>
    </div>

    <div class="flx-row">
        <p class="lbl fg-accent">Confirm:</p>
        <InputPW enabled={ true } bind:txt={ newUser.password_confirm } auto="new-password" place="Confirm password"/>
    </div>

</div>

<style>
    .container {
        width: 35em;
    }
    .lbl {
        width: 10em;
        font-size: 1rem;
        padding-left: 0.75rem;
        text-align: end;
    }
</style>