<template>
    <div>
        <EditNamePsicologi/>
        <EditPasswordPsicologi/>
    </div>
</template>
<script>
import EditNamePsicologi from '@/components/EditNamePsicologi.vue';
import EditPasswordPsicologi from '@/components/EditPasswordPsicologi.vue';


export default {
      components: {
    EditNamePsicologi,
    EditPasswordPsicologi
  },
}
</script>