<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import tabla from '@/components/tabla.vue';
import formulario from '@/components/formulario.vue';

const datos = ref([]);
const cargando = ref(true);
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


  //Nuevo Proyecto:

  const crearTarea = async (nuevosDatos) => {
    try{
        /*
        const nuevosDatos = {
            title : Titulo.value,
            description : Descripcion.value,
            priority : Prioridad.value,
            due_date : FechaLimite.value,
            status : Status.value,
            projectId: ProyectoSeleccionado.value
        }
            */
        const res = await axios.post('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/tasks',
            nuevosDatos
        )

        datos.value.push(res.data)
        mostrarModal.value= false
        console.log("Los datos son:",datos)

        // Limpiar formulario, son los valores que tendre que poner en v-for en el form html
        /*
        nombre.value = ''
        descripcion.value = ''
        estatus.value = 'active'
        */
    } catch(err){
        error.value = 'Error al crear proyecto'
    }
  }
  
</script>   

<template>
    <div class="flex items-center justify-between" >
         <h1 class="text-xl md:text-2xl lg:text-4xl font-bold mb-2">Listado de Tareas</h1>
         <router-link to="/">
            <button class="bg-blue-200 px-4 py-1 rounded"
              @click="mostrarModal = true">
              Lista de Proyectos
            </button>
         </router-link>
         <button class="bg-blue-200 px-4 py-1 rounded"
          @click="mostrarModal = true">
         Nueva Tarea
        </button>
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

    <!--Modal-->
    <div v-if="mostrarModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
      />
    </div>
    
  </div>
</template>
