<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const datos = ref([]);
const cargando = ref(true);
const error = ref(null)

const mostrarModal = ref(false)

const currentPage = ref(1)
const itemsPerPage = 5

//Constantes para el formulario de crear proyecto
const nombre = ref('')
const descripcion = ref('')
const estatus = ref('') // empieza vacío




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


  //Nuevo Proyecto:

  const crearProyecto = async () => {
    try{
        const nuevosDatos = {
            name : nombre.value,
            description : descripcion.value,
            status : estatus.value
        }
        const res = await axios.post('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/projects',
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
         <h1 class="text-xl md:text-2xl lg:text-4xl font-bold mb-2">Listado de Proyectos</h1>
         <router-link to="/tareas">
            <button class="bg-blue-200 px-4 py-1 rounded"
              @click="mostrarModal = true">
              Lista de Tareas
            </button>
         </router-link>
         <button class="bg-blue-200 px-4 py-1 rounded"
          @click="mostrarModal = true">
         Nuevo Proyecto
        </button>
    </div>
  <div>
    <table class="table-auto border border-gray-300 w-full mt-8">
        <thead>
            <tr class="bg-gray-100">
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="proyecto in proyectosPaginados" :key="proyecto.id">
                <td class="border p-2">{{proyecto.id}}</td>
                <td class="border p-2">{{ proyecto.name }}</td>
                <td class="border p-2">{{ proyecto.description }}</td>
                <td class="border p-2">{{ proyecto.status }}</td>
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
          v-model="nombre" type="text" placeholder="Nombre">

          <input class="border p-2" 
          v-model="descripcion" type="text" placeholder="Descripcion">

          <select v-model="estatus" name="" id="" class="border p-2">
            <option disabled value="">Status</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        
        <div class="mt-4 flex gap-4">
          <button @click="mostrarModal = false"
                  class="bg-blue-200 px-4 py-1 rounded"
                  >Cancelar</button>
          <button @click="crearProyecto"
                  class="bg-blue-200 px-4 py-1 rounded"
                  >Crear</button>
        </div>
      </div>
    </div>
    
  </div>
</template>
