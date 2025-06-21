<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import Progress from '$lib/components/ui/progress/progress.svelte';

  let { data: statistics } = $props();
</script>

<div class="">
  <div>
    <Accordion.Root type="single">
      <Accordion.Item>
        <Accordion.Trigger class="flex items-center text-lg">
          <p>収入: ¥{statistics.income.total.toLocaleString()}</p>
        </Accordion.Trigger>
        <Accordion.Content>
          <div class="space-y-2">
            {#each statistics.income.details as detail}
              <div class="flex items-center justify-between">
                <span>{detail.category}</span>
                <span>¥{detail.amount.toLocaleString()}</span>
              </div>
              <Progress value={detail.ratio} />
            {/each}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
  <div>
    <Accordion.Root type="single">
      <Accordion.Item>
        <Accordion.Trigger class="flex items-center text-lg">
          <p>支出: ¥{statistics.spending.total.toLocaleString()}</p>
        </Accordion.Trigger>
        <Accordion.Content>
          <div class="space-y-2">
            {#each statistics.spending.details as detail}
              <div class="flex items-center justify-between">
                <span>{detail.category}</span>
                <span>¥{detail.amount.toLocaleString()}</span>
              </div>
              <Progress value={detail.ratio} />
            {/each}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
  <div class="py-4 text-lg">
    <p>差額: ¥{statistics.difference.toLocaleString()}</p>
  </div>
</div>
