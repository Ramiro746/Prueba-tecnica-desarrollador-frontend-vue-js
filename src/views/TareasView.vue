<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import tabla from '@/components/tabla.vue';
import formulario from '@/components/formulario.vue';

const datos = ref([]);
const cargando = ref(true);
const enviando = ref(false)
const mensajeExito= ref('')
const error = ref(null)

const mostrarModal = ref(false)

const currentPage = ref(1)
const itemsPerPage = 5

//Constantes para el formulario de crear tarea
const Titulo = ref('')
const Descripcion = ref('')
const Prioridad = ref('')
const FechaLimite = ref('')
const Status = ref('') // empieza vacío
const ProyectoSeleccionado = ref('')

const proyectos = ref([])
const opcionesProyectos = computed(() =>
  proyectos.value ? proyectos.value.map(p => ({ value: p.id, label: p.name })) : []
)



onMounted(async () => {

    //Cargamos los proyectos
     try{
        const res = await axios.get('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/projects')
        proyectos.value= res.data //con axios se hace asi, porque devuelve, parametros, data, status, headers

        console.log("Los datos son:",datos)
    } catch(err){
        error.value = 'Error al obtener los proyectos'
    }finally{
        cargando.value = false
    }

    //Llamamos las tareas 
  try{
    const llamada = await axios.get('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/tasks')
    datos.value= llamada.data //con axios se hace asi, porque devuelve, parametros, data, status, headers

    console.log("Los datos son:",datos)
  } catch(err){
    error.value = 'Error al obtener los datos de tareas'
  }finally{
    cargando.value = false
  }
})

 //Calcular datos de la pagina actual (1,2,....)
  const tareasPaginadas = computed(() => {
    const start = (currentPage.value -1)* itemsPerPage
    return datos.value.slice(start, start + itemsPerPage)
  })


  //Nuevo Tarea:

  const crearTarea = async (nuevosDatos) => {
    if(enviando.value)return //evita doble click
    enviando.value = true
    error.value = ''
    mensajeExito.value=''

    try{

      //Validacion
      if(!nuevosDatos.title || !nuevosDatos.projectId){
        error.value = "Por favor completa los campos obligatorios"
        enviando.value = false

        //Borrar mensaje tras 5 segundos
        setTimeout(() => error.value = '', 4000)
        return
      }
        const res = await axios.post('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/tasks',
            nuevosDatos)

        datos.value.push(res.data)
        mostrarModal.value= false
        console.log("Los datos son:",datos)
        mensajeExito.value= "Tarea creada correctamente"

        //Borrar mensaje tras 5 segundos
        setTimeout(() => mensajeExito.value = '', 4000)

    } catch(err){
        error.value = 'Error al crear tarea'

        //Borrar mensaje tras 5 segundos
        setTimeout(() => error.value = '', 4000)
    }finally{
      enviando.value = false
    }
  }
  
</script>   

<template>
    <div class="flex items-center md:flex-row items-center justify-between">
         <h1 class="text-xl md:text-2xl lg:text-4xl font-bold mb-2">Listado de Tareas</h1>

         <div class="lg:flex flex-row gap-10 sm:flex flex-col items-center justify-between gap-2">
            <router-link to="/">
                <button  class="bg-blue-200 px-4 py-1 rounded w-full sm:w-auto"
                  @click="mostrarModal = true">
                  Lista de Proyectos
                </button>
            </router-link>
            <button class="bg-blue-200 px-4 py-1 rounded w-full sm:w-auto"
              @click="mostrarModal = true">
            Nueva Tarea
            </button>
        </div>  
    </div>
  <div>
    <tabla
        :datos="datos"
        :columnas="[
            { key: 'id', label: 'Id'},
            { key: 'title', label: 'Titulo'},
            { key: 'description', label: 'Descripcion'},
            { key: 'due_date', label: 'Fecha Limite'},
            { key: 'priority', label: 'Prioridad'},
            { key: 'status', label: 'Status'},
            { key: 'projectId', label: 'Id Proyecto'},

        ]"  
    />

    <!-- Mensajes globales -->
     <Transition name="fade">
        <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded mt-2">
          {{ error }}
        </div>
     </Transition>
    
     <Transition name="fade">
        <div v-if="mensajeExito" class="bg-red-100 text-red-700 p-2 rounded mt-2">
          {{ mensajeExito }}
        </div>
     </Transition>

    <!--Modal-->
    <div v-if="mostrarModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <formulario
        :campos="[
            { key: 'title', label: 'Título', tipo: 'text', placeholder: 'Titulo de tarea' },
            { key: 'description', label: 'Descripcion', tipo: 'text', placeholder: 'Descripcion' },
            { key: 'priority', label: 'Prioridad', tipo: 'select', placeholder: 'Selecciona prioridad',
                opciones: [
                    { value: 'high', label:'Alta'},
                    { value: 'medium', label:'Media'},
                    { value: 'low', label:'Baja'}
                ]
            },
            { key: 'due_date', label: 'Fecha límite', tipo: 'date' },
            { key: 'status', label: 'Estado', tipo: 'select', placeholder: 'Selecciona estado',
                opciones: [
                    { value: 'pendiente', label: 'Pendiente' },
                    { value: 'completada', label: 'Completada' }
                ]
            },
            { key: 'projectId', label:'Proyectos asociado', tipo:'select', placeholder: 'Selecciona proyecto',
                opciones: opcionesProyectos
            }
            
        ]"
        @submit="crearTarea"
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
