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
        padding: 1em 0.5em;
        border-radius: 0.5em;
        gap: 0;
        height: 100%;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    
</style>