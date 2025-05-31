<script lang="ts">
  import GoogleIcon from '$lib/components/google-icon.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Github } from '@lucide/svelte';
</script>

<form method="POST" action="/login?/loginWithOAuth">
  <input type="hidden" name="provider" value="github" />
  <Button type="submit" variant="outline" class="w-full">
    <Github />
    GitHubで登録
  </Button>
</form>

<form method="POST" action="/login?/loginWithOAuth">
  <input type="hidden" name="provider" value="google" />
  <Button type="submit" variant="outline" class="w-full">
    <GoogleIcon />
    Googleで登録
  </Button>
</form>
