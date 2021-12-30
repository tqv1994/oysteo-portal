<script>
    let className = undefined;
    export { className as class };
    export let id = undefined;
    export let tabindex = undefined;
    export let focusable = false;
    export let title = undefined;
    export let style = undefined;
    export let width = "24";
    export let height = "24";
  
    $: ariaLabel = $$props['aria-label'];
    $: ariaLabelledBy = $$props['aria-labelledby'];
    $: labelled = ariaLabel || ariaLabelledBy || title;
    $: attributes = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-hidden': labelled ? undefined : true,
      role: labelled ? 'img' : undefined,
      focusable: tabindex === '0' ? true : focusable,
      tabindex
    };
  </script>
  
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <svg
    data-carbon-icon="IconHome1"
    on:click
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:keyup
    on:keydown
    xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} fill="currentColor" width={width} height={height}
    class={className}
    preserveAspectRatio="xMidYMid meet"
    {style}
    {id}
    {...attributes}
    >
        <g id="Group_11194" data-name="Group 11194" transform="translate(-392.5 1472)">
          <path id="Path_10505" data-name="Path 10505" d="M398.874-1471.767a9.971,9.971,0,0,0-4.172,2.456,11,11,0,0,0-1.525,2.351l-.678,1.419v71.809l.784,1.609a8.138,8.138,0,0,0,4.15,4.045l1.419.678H453.7l1.419-.678a8.139,8.139,0,0,0,4.151-4.045l.783-1.609.064-30.176.042-30.176-8.936-8.958L442.264-1472l-21.282.021C409-1471.958,399.34-1471.873,398.874-1471.767Zm40.955,11.1v7.962l.529.508.508.529h15.9v28.355c0,31.68.106,29.414-1.525,31.087-1.609,1.652.339,1.546-28.969,1.546s-27.36.106-28.969-1.546c-1.652-1.673-1.525,1.313-1.525-37.4,0-38.774-.127-35.83,1.546-37.461,1.609-1.588.3-1.5,22.553-1.5l19.948-.021Zm9,.106,5.506,5.506H443.217v-5.506c0-3.028.021-5.506.064-5.506C443.3-1466.071,445.8-1463.593,448.829-1460.565Z" transform="translate(0 0)"/>
          <path id="Path_10506" data-name="Path 10506" d="M484.482-1343.471l-.529.508v10.821h-5.929v-2.012c0-1.863-.042-2.075-.529-2.541l-.508-.53h-10.63l-.508.53c-.529.508-.529.508-.529,5.082v4.553h-4.129c-4.129,0-4.151,0-4.659.529l-.529.508v14.866l.529.508.508.529h38.583l.508-.529.529-.508v-31.807l-.529-.508-.508-.529H484.99Zm8.788,16.412v13.553h-5.929v-27.106h5.929Zm-18.635,3.388v10.165h-5.929v-20.329h5.929Zm9.318,2.541v7.624h-5.929v-15.247h5.929Zm-18.635,2.541v5.083h-5.929v-10.165h5.929Z" transform="translate(-50.053 -100.894)"/>
          <path id="Path_10507" data-name="Path 10507" d="M456.529-1159.471a1.651,1.651,0,0,0-.529,1.165,1.651,1.651,0,0,0,.529,1.165l.508.529h38.583l.508-.529a1.65,1.65,0,0,0,.529-1.165,1.651,1.651,0,0,0-.529-1.165l-.508-.529H457.038Z" transform="translate(-50.053 -245.93)"/>
        </g>
    <slot>
      {#if title}
        <title>{title}</title>
      {/if}
    </slot>
  </svg>