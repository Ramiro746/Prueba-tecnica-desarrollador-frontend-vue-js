<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

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

  const crearTarea = async () => {
    try{
        const nuevosDatos = {
            title : Titulo.value,
            description : Descripcion.value,
            priority : Prioridad.value,
            due_date : FechaLimite.value,
            status : Status.value,
            projectId: ProyectoSeleccionado.value
        }
        const res = await axios.post('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/tasks',
            nuevosDatos
        )

        datos.value.push(res.data)
        mostrarModal.value= false
        console.log("Los datos son:",datos)

        // Limpiar formulario, son los valores que tendre que poner en v-for en el form html
        nombre.value = ''
        descripcion.value = ''
        estatus.value = 'active'

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
    <table class="table-auto border border-gray-300 w-full mt-8">
        <thead>
            <tr class="bg-gray-100">
                <th>Id</th>
                <th>Titulo</th>
                <th>Descripcion</th>
                <th>Prioridad</th>
                <th>Fecha Limite</th>
                <th>Status</th>
                <th>Id Proyecto</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tarea in tareasPaginadas" :key="tarea.id">
                <td class="border p-2">{{tarea.id}}</td>
                <td class="border p-2">{{ tarea.title }}</td>
                <td class="border p-2">{{ tarea.description }}</td>
                <td class="border p-2">{{ tarea.priority }}</td>
                <td class="border p-2">{{ tarea.due_date }}</td>
                <td class="border p-2">{{ tarea.status }}</td>
                <td class="border p-2">{{ tarea.projectId }}</td>
            </tr>
        </tbody>
    </table>
    <div class="mt-4 gap-4 flex justify-start">
        <!--Cuando el usuario haga clic, retrocede una página, a menos que ya esté en la primera (en ese caso, el botón estará desactivado-->
        <button @click="currentPage--" 
                :disabled="currentPage === 1"
                class="bg-blue-200 px-4 py-1 rounded"
        >
            Anterior
        </button>
        <button @click="currentPage++" 
                :disabled="currentPage * itemsPerPage >= datos.length"
                class="bg-blue-200 px-4 py-1 rounded"
        >
            Siguiente
        </button>
    </div>

    <!--Modal-->
    <div v-if="mostrarModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class=" bg-white rounded-lg shadow-lg p-8 w-116 relative">
        <h2>Nuevo Proyecto</h2>

        <div class="flex flex-col mt-3 gap-8">
          <input class="border p-2"
          v-model="Titulo" type="text" placeholder="Titulo">

          <input class="border p-2" 
          v-model="Descripcion" type="text" placeholder="Descripcion">

          <select v-model="Prioridad" name="" id="" class="border p-2">
            <option disabled value="">Prioridad</option>
            <option value="active">High</option>
            <option value="inactive">Medium</option>
            <option value="inactive">Low</option>
          </select>

          <input class="border p-2" 
          v-model="FechaLimite" type="date" placeholder="Fecha Limite">

          <select v-model="estatus" name="" id="" class="border p-2">
            <option disabled value="">Status</option>
            <option value="completed">Completado</option>
            <option value="pending">Pendiente</option>
          </select>

          <select v-model="ProyectoSeleccionado" name="" id="" class="border p-2">
            <option  disabled value="">Proyecto asociado</option>
            <option value="" v-for="pr in proyectos" :key="pr.id" :value="pr.id">
                {{ pr.name }}
            </option>
          </select>
        </div>
        
        <div class="mt-4 flex gap-4">
          <button @click="mostrarModal = false"
                  class="bg-blue-200 px-4 py-1 rounded"
                  >Cancelar</button>
          <button @click="crearTarea"
                  class="bg-blue-200 px-4 py-1 rounded"
                  >Crear</button>
        </div>
      </div>
    </div>
    
  </div>
</template>
