<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    opciones: Array, // lista de opciones [{ value: 'active', label: 'Activo' }, ...]
    modelValue: String  // valor actual del filtro
})

const valor = ref(props.modelValue)
watch(valor, newVal => {
    valor.value = newVal
})
</script>
<template>

<select v-model="valor" 
        @change="$emit('update', valor)" 
        class="border p-2"> <!--cada vez que el usuario cambia el valor, se emite un evento personalizado hacia el componente padre.-->
    <option value="">Todos</option>
    <option v-for="opcion in opciones" :key="opcion.value" :value="opcion.value">
        {{ opcion.label }}
    </option>
</select>
</template>