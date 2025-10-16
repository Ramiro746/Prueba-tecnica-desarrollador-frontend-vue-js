<script setup>
import { reactive } from 'vue'

const props = defineProps({
  campos: Array,          // definición de campos dinámicos
  datosIniciales: Object  // valores por defecto
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({ ...props.datosIniciales })

function enviarForm() {
  emit('submit', { ...formData })
}
</script>
<template>  
<div class="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-8 w-116 relative">
    <div class="flex flex-col" v-for="campo in campos" :key="campo.key">
        <label class="font-semibold">{{ campo.label }}</label>

        <!--Input dinamico-->
        <input
            v-if="campo.tipo === 'text' || campo.tipo === 'date'"
            v-model="formData[campo.key]"
            :type="campo.tipo"
            class="border p-2 rounded"
            :placeholder="campo.placeholder" 
        />

        <!--Select Dinamico-->
        <select
            v-else-if="campo.tipo === 'select'"
            v-model="formData[campo.key]"
            class="border p-2 rounded">

            <option value="" disabled selected hidden>{{ campo.placeholder }}</option>
            <option v-for="op in campo.opciones" :key="op.value" :value="op.value">
                {{ op.label }}
            </option>
        </select>
    </div>
    <div class="flex justify-end gap-3 mt-4">
        <button @click="$emit('cancel')" class="bg-gray-200 px-3 py-1 rounded">Cancelar</button>
        <button @click="enviarForm" class="bg-blue-400 px-3 py-1 rounded text-white">Guardar</button>
    </div>
</div>

</template>