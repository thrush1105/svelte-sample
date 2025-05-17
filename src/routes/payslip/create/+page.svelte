<script lang="ts">
  import PayslipForm from '../payslip-form.svelte';
  import type { PageProps } from './$types.js';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>給与明細を追加</title>
</svelte:head>

<PayslipForm {data} />
