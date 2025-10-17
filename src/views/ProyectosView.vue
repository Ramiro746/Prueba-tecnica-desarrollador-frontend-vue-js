<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import tabla from '@/components/tabla.vue';
import filtro from '@/components/filtro.vue';
import formulario from '@/components/formulario.vue';

const datos = ref([]);
const cargando = ref(true);
const enviando = ref(false)
const mensajeExito= ref('')
const error = ref(null)

const mostrarModal = ref(false)

const currentPage = ref(1)
const itemsPerPage = 5

//Constantes para el formulario de crear proyecto
const nombre = ref('')
const descripcion = ref('')
const estatus = ref('') // empieza vacío


const filtroEstado = ref('')

function filtraPorEstado(estado){
  filtroEstado.value = estado
}

onMounted(async () => {
  try{
    const llamada = await axios.get('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/projects')
    datos.value= llamada.data //con axios se hace asi, porque devuelve, parametros, data, status, headers

    console.log("Los datos son:",datos)
  } catch(err){
    error.value = 'Error al obtener los datos'
  }finally{
    cargando.value = false
  }
})

 //Calcular datos de la pagina actual (1,2,....)
  const proyectosPaginados = computed(() => {
    const start = (currentPage.value -1)* itemsPerPage
    return datos.value.slice(start, start + itemsPerPage)
  })


  const datosFiltrados = computed(() => {
    if(!filtroEstado.value) return datos.value; // si no hay filtro, devuelve todo
    return datos.value.filter(d => d.status === filtroEstado.value);
  })

  //Nuevo Proyecto:
  //cuando se emita el evento submit, el dato que venga lo quiero recibir aquí dentro en (nuevosDatos) = nuevosDatos.name, etc
  const crearProyecto = async (nuevosDatos) => {
    try{
      
      //Validacion
      if(!nuevosDatos.name || !nuevosDatos.status){
        error.value = "Por favor completa los campos obligatorios"
        enviando.value = false

        //Borrar mensaje tras 5 segundos
        setTimeout(() => error.value = '', 4000)
        return
      }
        const res = await axios.post('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/projects',
            nuevosDatos
        )

        datos.value.push(res.data)
        mostrarModal.value= false
        console.log("Los datos son:",datos)
        mensajeExito.value= "Tarea creada correctamente"

      //Borrar mensaje tras 5 segundos
        setTimeout(() => mensajeExito.value = '', 4000)

    } catch(err){
        error.value = 'Error al crear proyecto',err

     //Borrar mensaje tras 5 segundos
        setTimeout(() => error.value = '', 4000) 
    }finally{
      enviando.value = false
    }
  
  }
  
</script>   

<template>
    <div class="flex items-center md:flex-row items-center justify-between" >
         <h1 class="text-xl md:text-2xl lg:text-4xl font-bold mb-2">Listado de Proyectos</h1>

         <div class="lg:flex flex-row gap-10 sm:flex flex-col items-center justify-between gap-2">
          <router-link to="/tareas">
            <button class="bg-blue-200 px-4 py-1 rounded w-full sm:w-auto"
              @click="mostrarModal = true">
              Lista de Tareas
            </button>
         </router-link>
         <button class="bg-blue-200 px-4 py-1 rounded w-full sm:w-auto"
          @click="mostrarModal = true">
          Nuevo Proyecto
        </button>
         </div>   
    </div>
  <div>
    
    <filtro
      :opciones="[
        { value: 'active', label: 'Activo'},
        { value: 'inactive', label: 'Inactivo'},
      ]"
      @update="filtraPorEstado"
    />

    <tabla
      :datos="datosFiltrados"
      :columnas="[
        { key: 'id', label:'Id'},
        { key: 'name', label:'Nombre'},
        { key: 'description', label:'Descripcion'},
        { key: 'status', label:'Status'},

      ]"
      :itemsPorPagina="5"
      />

      <!-- Mensajes globales -->
     <Transition name="fade">
        <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded mt-2">
          {{ error }}
        </div>
     </Transition>
    
     <Transition name="fade">
        <div v-if="mensajeExito" class="bg-green-100 text-white-700 p-2 rounded mt-2">
          {{ mensajeExito }}
        </div>
     </Transition>
    <!--Modal-->
    <div v-if="mostrarModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <formulario
        :campos="[
          { key: 'name', label:'Nombre', tipo:'text', placeholder:'Nombre del proyecto'},
          { key: 'description', label:'Descripcion', tipo:'text', placeholder:'Descripcion'},
          { key: 'status', label:'Status', tipo:'select', placeholder:'Selecciona estado',
            opciones: [
              { value:'active', label: 'Activo'},
              { value:'inactive', label: 'Inactivo'}
            ]
          }
        ]"
        @submit="crearProyecto"
        @cancel="mostrarModal = false"
        :disabled="enviando" 
        />
    </div>
    
  </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active{
  transition: opacity 0.5s ease, transform 0.8s ease;
  
}

.fade-enter-from,
.fade-leave-to{
  opacity: 0;
  transform: translateY(100px);
}
</style>