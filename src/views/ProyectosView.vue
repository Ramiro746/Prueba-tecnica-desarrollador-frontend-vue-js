<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import tabla from '@/components/tabla.vue';
import filtro from '@/components/filtro.vue';
import formulario from '@/components/formulario.vue';

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
  const crearProyecto = async () => {
    try{
      /*
        const nuevosDatos = {
            name : nombre.value,
            description : descripcion.value,
            status : estatus.value
        }
            */
        const res = await axios.post('https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/projects',
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

    <!--Modal-->
    <div v-if="mostrarModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <formulario
        :campos="[
          { key: 'name', label:'Nombre', tipo:'text', placeholder:'Nombre del proyecto'},
          { key: 'description', label:'Descripcion', tipo:'text', placeholder:'Descripcion'},
          { key: 'status', label:'Status', tipo:'text', placeholder:'Selecciona estado',
            opciones: [
              { value:'active', label: 'Activo'},
              { value:'inactive', label: 'Inactivo'}
            ]
          }
        ]"
        @submit="crearProyecto"
        @cancel="mostrarModal = false"
        />
    </div>
    
  </div>
</template>
