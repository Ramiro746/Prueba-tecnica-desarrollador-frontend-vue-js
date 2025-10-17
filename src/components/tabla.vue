<script setup> //Si no pongo setup, no funciona defineProps, sino hay que definirlo de otra manera
import { computed, ref } from 'vue'

const props = defineProps({
  datos: Array,
  columnas: Array,
  itemsPorPagina: { type: Number, default: 5 }
})

const paginaActual = ref(1)

const datosPaginados = computed(() => {
  const start = (paginaActual.value - 1) * props.itemsPorPagina
  const end = start + props.itemsPorPagina
  return props.datos.slice(start, end)
})
</script>
<template>
<div class="overflow-x-auto">
    <table class=" mt-8 min-w-full border border-gray-300 text-sm md:text-base">
      <thead>
        <tr class="bg-gray-100">
          <th v-for="col in columnas" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in datosPaginados" :key="item.id">
          <td v-for="col in columnas" :key="col.key" class="border p-2">
            {{ item[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Botones de paginación -->
    <div class="mt-4 gap-4 flex justify-start">
        <!--Cuando el usuario haga clic, retrocede una página, a menos que ya esté en la primera (en ese caso, el botón estará desactivado-->
      <button
        @click="paginaActual--"
        :disabled="paginaActual === 1"
        class="bg-blue-200 px-4 py-1 rounded"
      >
        Anterior
      </button>
      <button
        @click="paginaActual++"
        :disabled="paginaActual * itemsPorPagina >= datos.length"
        class="bg-blue-200 px-4 py-1 rounded"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>