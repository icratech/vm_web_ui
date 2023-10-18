<script>

    import BarGaugeH from '../../common/bar_gauge/BarGaugeH.svelte'
    import { Config, Sample,COLORS } from '../../des_api'

    export let cfg = new Config( )
    export let smp = new Sample( )

</script>


<div class="flx-col container">

    <BarGaugeH title="CH4"
        base_color={ COLORS.CH4 }
        bind:num={ smp.smp_ch4 }
        max={ 100 }
        unit={ "%" }
    />
    
    { #if smp.smp_lo_flow < cfg.cfg_flow_tog }
    <BarGaugeH title="L-Flow"
        base_color={ COLORS.LO_FLOW }
        bind:num={ smp.smp_lo_flow }
        max={ 2 }
        unit={ "L/min" }
    />
    { :else }
    <BarGaugeH title="H-Flow"
        base_color={ COLORS.HI_FLOW }
        bind:num={ smp.smp_hi_flow }
        max={ 250 }
        unit={ "L/min" }
    />
    { /if }
    
    <BarGaugeH title="Pressure"
        base_color={ COLORS.PRESS }
        bind:num={ smp.smp_press }
        max={ 7000 }
        unit={ "kPa" }
    />
    
    <BarGaugeH title="Battery"
        base_color={ COLORS.BAT_VOLT }
        bind:num={ smp.smp_bat_volt }
        max={ 14 }
        unit={ "Volts" }
    />
    
</div>

<style>
    .container {
        justify-content: center;
        padding: 0;
        border-radius: 0.5em;
        height: 100%;
        gap: 0;
    }
    
    /* LAP TOP */
    @media(max-width: 1440px) {
        
    }

    /* TABLET */
    @media(max-width: 1024px) {
        .container { 
            background-color: transparent;
            border: none;
            /* padding: 0;  */
            /* gap: 0.5em;  */
        }
    }

    /* MOBILE */
    @media(max-width: 425px) { 
    
    }

</style>