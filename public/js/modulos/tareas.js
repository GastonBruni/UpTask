import axios from "axios";
import Swal from 'sweetalert2';

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes')

if(tareas){

    tareas.addEventListener('click', (e) => {
        if(e.target.classList.constains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('Completo');

                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.constains('fa-trash')){
            
            const tareaHTML = e.target.parentElement.parentElement,
                    idTarea = tareaHTML.dataset.tarea;

                    Swal.fire({
                        title: 'Deseas borrar esta Tarea?',
                        text: "Una Tarea eliminada no se puede recuperar",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, Borrar',
                        cancelButtonText: 'No, Cancelar'
                    }).then((result) => {
                        if (result.value) {
                            const url = `${location.origin}/tareas/${idTarea}`;
                            // enviar el delete por medio de axios
                            axios.delete(url, {params:{idTarea}})
                                .then(function(respuesta){
                                    if(respuesta.status === 200){
                                        console.log(respuesta);

                                        // eliminar el nodo
                                        tareaHTML.parentElement.removeChild(tareaHTML);

                                        // opcional una alerta
                                        Swal.fire(
                                            'Tarea eliminada',
                                            respuesta.data,
                                            'success'
                                        )

                                        actualizarAvance();
                                    }
                                });
                        }
                    })

        }

    });

}

export default tareas;