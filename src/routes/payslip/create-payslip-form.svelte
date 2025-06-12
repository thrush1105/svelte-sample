<script lang="ts">
  import { page } from '$app/state';
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { LoaderCircle } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { createPayslipFormSchema, type CreatePayslipFormSchema } from './schema';

  let {
    data,
    update = false
  }: { data: SuperValidated<Infer<CreatePayslipFormSchema>>; update?: boolean } = $props();

  const form = superForm(data, {
    validators: zodClient(createPayslipFormSchema),
    onError({ result }) {
      toast.error(result.error.message, { position: 'bottom-right', richColors: true });
    }
  });

  const { form: formData, enhance, submitting, message } = form;

  /** 総支給額 */
  let totalEarnings = $derived(
    ($formData.basicSalary ?? 0) +
      ($formData.areaAllowance ?? 0) +
      ($formData.commutationAllowance ?? 0) +
      ($formData.overtimeAllowance ?? 0) +
      ($formData.incentive ?? 0)
  );

  /** 控除合計 */
  let totalDeductions = $derived(
    ($formData.healthInsurance ?? 0) +
      ($formData.longTermCareInsurance ?? 0) +
      ($formData.employeesPension ?? 0) +
      ($formData.employmentInsurance ?? 0) +
      ($formData.incomeTax ?? 0) +
      ($formData.residentTax ?? 0) +
      ($formData.yearEndAdjustment ?? 0) +
      ($formData.flatAmountCut ?? 0)
  );

  /** 差引支給額 */
  let netPay = $derived(totalEarnings - totalDeductions);

  $effect(() => {
    if (totalEarnings !== $formData.totalEarnings) {
      $formData.totalEarnings = totalEarnings;
    }
    if (totalDeductions !== $formData.totalDeductions) {
      $formData.totalDeductions = totalDeductions;
    }
    if (netPay !== $formData.netPay) {
      $formData.netPay = netPay;
    }
  });
</script>

{#if page.status >= 400}
  <ErrorAlert title="エラー" message={$message} />
{/if}

<form method="POST" use:enhance>
  <div class="space-y-8">
    <div class="space-y-4">
      <Form.Field {form} name="id">
        <Form.Control>
          {#snippet children({ props })}
            <Input {...props} type="hidden" bind:value={$formData.id} readonly />
          {/snippet}
        </Form.Control>
      </Form.Field>
      <Form.Field {form} name="paymentDate">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>支給日</Form.Label>
            <Input {...props} type="date" bind:value={$formData.paymentDate} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="type">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>給与/賞与</Form.Label>
            <Select.Root {...props} type="single" bind:value={$formData.type}>
              <Select.Trigger>
                {$formData.type === 'salary' ? '給与' : $formData.type === 'bonus' ? '賞与' : ''}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="salary">給与</Select.Item>
                <Select.Item value="bonus">賞与</Select.Item>
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="space-y-4">
      <p class="text-2xl font-bold">支給</p>
      <Form.Field {form} name="basicSalary">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>基本給</Form.Label>
            <Input {...props} type="number" bind:value={$formData.basicSalary} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="areaAllowance">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>地域手当</Form.Label>
            <Input {...props} type="number" bind:value={$formData.areaAllowance} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="commutationAllowance">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>通勤手当</Form.Label>
            <Input {...props} type="number" bind:value={$formData.commutationAllowance} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="overtimeAllowance">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>残業手当</Form.Label>
            <Input {...props} type="number" bind:value={$formData.overtimeAllowance} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="incentive">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>奨励金</Form.Label>
            <Input {...props} type="number" bind:value={$formData.incentive} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="totalEarnings">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>総支給額</Form.Label>
            <Input {...props} type="number" value={$formData.totalEarnings} readonly />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="space-y-4">
      <p class="text-2xl font-bold">控除</p>
      <Form.Field {form} name="healthInsurance">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>健康保険</Form.Label>
            <Input {...props} type="number" bind:value={$formData.healthInsurance} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="longTermCareInsurance">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>介護保険</Form.Label>
            <Input {...props} type="number" bind:value={$formData.longTermCareInsurance} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="employeesPension">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>厚生年金</Form.Label>
            <Input {...props} type="number" bind:value={$formData.employeesPension} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="employmentInsurance">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>雇用保険</Form.Label>
            <Input {...props} type="number" bind:value={$formData.employmentInsurance} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="incomeTax">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>所得税</Form.Label>
            <Input {...props} type="number" bind:value={$formData.incomeTax} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="residentTax">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>住民税</Form.Label>
            <Input {...props} type="number" bind:value={$formData.residentTax} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="yearEndAdjustment">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>年調過不足</Form.Label>
            <Input {...props} type="number" bind:value={$formData.yearEndAdjustment} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="flatAmountCut">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>定額減税</Form.Label>
            <Input {...props} type="number" bind:value={$formData.flatAmountCut} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="totalDeductions">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>控除合計</Form.Label>
            <Input {...props} type="number" value={$formData.totalDeductions} readonly />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="space-y-4">
      <p class="text-2xl font-bold">差引支給額</p>
      <Form.Field {form} name="netPay">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>差引支給額</Form.Label>
            <Input {...props} type="number" value={$formData.netPay} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
      <Button variant="secondary" onclick={() => history.back()}>キャンセル</Button>
      <Form.Button disabled={$submitting}>
        {#if $submitting}
          <LoaderCircle />
        {/if}
        {update ? '更新' : '登録'}
      </Form.Button>
    </div>
  </div>
</form>
